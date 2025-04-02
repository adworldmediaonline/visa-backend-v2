import expressAsyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import cloudinary from '../../config/cloudinary.js';
import EthiopiaVisaApplication from '../../models/ethiopia/ethiopiaVisaApplicationModel.js';
import EthiopiaVisaDocuments from '../../models/ethiopia/ethiopiaVisaDocumentsModel.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFile } from 'fs/promises';
import camelCase from 'lodash.camelcase';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let visaTypesAndPrices;
try {
  const jsonContent = await readFile(
    join(__dirname, 'visaTypesAndPrices.json'),
    'utf8'
  );
  visaTypesAndPrices = JSON.parse(jsonContent);
} catch (error) {
  console.error('Error loading visa types and prices:', error);
  visaTypesAndPrices = { visaTypes: [] };
}

// Get required documents from visaTypesAndPrices.json
const getRequiredDocuments = visaType => {
  const visaTypeData = visaTypesAndPrices.visaTypes.find(
    type => type.name.toLowerCase() === visaType.toLowerCase()
  );

  if (!visaTypeData) {
    return [];
  }

  // Convert attachment names to lowercase and remove spaces for consistent comparison
  return visaTypeData.attachments.map(doc =>
    doc.toLowerCase().replace(/\s+/g, '')
  );
};

// Upload a document for a visa application
const uploadDocument = expressAsyncHandler(async (req, res) => {
  try {
    const {
      applicationId,
      documentType,
      visaType,
      applicantType = 'primary',
      additionalApplicantIndex = null,
    } = req.body;

    if (!applicationId || !documentType || !visaType) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message:
          'Missing required fields: applicationId, documentType, and visaType are required',
      });
    }

    // Check if the document type is valid for the visa type
    const requiredDocuments = getRequiredDocuments(visaType);
    const normalizedDocType = documentType.toLowerCase().replace(/\s+/g, '');

    // const normalizedDocType = camelcase(documentType);

    if (!requiredDocuments.includes(normalizedDocType)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: `${documentType} is not required for ${visaType} visa type`,
      });
    }

    // Check if application exists
    const application = await EthiopiaVisaApplication.findById(applicationId);
    if (!application) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Visa application not found',
      });
    }

    if (!req.file) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Please upload a document',
      });
    }

    // Upload document to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: `ethiopia-visa/${visaType}/${applicationId}`,
      resource_type: 'auto',
    });

    // Find or create document record
    let documentRecord;

    if (applicantType === 'primary') {
      documentRecord = await EthiopiaVisaDocuments.findOne({
        visaApplicationId: applicationId,
        applicantType: 'primary',
      });
    } else if (
      applicantType === 'additional' &&
      additionalApplicantIndex !== null
    ) {
      documentRecord = await EthiopiaVisaDocuments.findOne({
        visaApplicationId: applicationId,
        applicantType: 'additional',
        additionalApplicantIndex: additionalApplicantIndex,
      });
    }

    if (!documentRecord) {
      documentRecord = new EthiopiaVisaDocuments({
        visaApplicationId: applicationId,
        visaType,
        applicantType,
        additionalApplicantIndex:
          applicantType === 'additional' ? additionalApplicantIndex : null,
      });
    }

    // Update the document field
    const normalizedDocumentTypeCamelCase = camelCase(documentType);

    documentRecord.documents[normalizedDocumentTypeCamelCase] = {
      secure_url: result.secure_url,
      public_id: result.public_id,
      fileName: req.file.originalname,
      uploadedAt: new Date(),
    };

    // Check if all required documents are uploaded
    const requiredDocs = getRequiredDocuments(visaType);
    const isComplete = requiredDocs.every(docType => {
      // Find a matching document in the current document record
      const docKey = Object.keys(documentRecord.documents).find(
        key => key.toLowerCase().replace(/\s+/g, '') === docType
      );
      return (
        docKey &&
        documentRecord.documents[docKey] &&
        documentRecord.documents[docKey].secure_url
      );
    });

    documentRecord.isComplete = isComplete;
    await documentRecord.save();

    // Update the application with the document reference
    if (applicantType === 'primary') {
      application.documents = documentRecord._id;
    } else if (
      applicantType === 'additional' &&
      additionalApplicantIndex !== null
    ) {
      if (!application.additionalApplicants[additionalApplicantIndex]) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Additional applicant not found at the specified index',
        });
      }
      application.additionalApplicants[additionalApplicantIndex].documents =
        documentRecord._id;
    }

    await application.save();

    res.status(StatusCodes.OK).json({
      success: true,
      message: `${documentType} uploaded successfully`,
      data: {
        documentId: documentRecord._id,
        normalizedDocumentTypeCamelCase,
        fileInfo: documentRecord.documents[documentType],
        isComplete: documentRecord.isComplete,
      },
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error uploading document',
      error: error.message,
    });
  }
});

// Get all documents for a visa application
const getDocuments = expressAsyncHandler(async (req, res) => {
  try {
    const {
      applicationId,
      applicantType = 'primary',
      additionalApplicantIndex = null,
    } = req.params;

    let query = {
      visaApplicationId: applicationId,
      applicantType,
    };

    if (applicantType === 'additional' && additionalApplicantIndex !== null) {
      query.additionalApplicantIndex = additionalApplicantIndex;
    }

    const documents = await EthiopiaVisaDocuments.findOne(query);

    if (!documents) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'No documents found for this application',
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: documents,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error retrieving documents',
      error: error.message,
    });
  }
});

// Delete a document
const deleteDocument = expressAsyncHandler(async (req, res) => {
  try {
    const {
      applicationId,
      documentType,
      applicantType = 'primary',
      additionalApplicantIndex = null,
    } = req.params;

    let query = {
      visaApplicationId: applicationId,
      applicantType,
    };

    if (applicantType === 'additional' && additionalApplicantIndex !== null) {
      query.additionalApplicantIndex = additionalApplicantIndex;
    }

    const documentRecord = await EthiopiaVisaDocuments.findOne(query);
    const normalizedDocumentTypeCamelCase = camelCase(documentType);

    if (
      !documentRecord ||
      !documentRecord.documents[normalizedDocumentTypeCamelCase]
    ) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Document not found',
      });
    }

    // Delete from cloudinary
    const publicId =
      documentRecord.documents[normalizedDocumentTypeCamelCase].public_id;
    console.log(publicId);
    await cloudinary.uploader.destroy(publicId);

    // Remove document from record
    documentRecord.documents[normalizedDocumentTypeCamelCase] = undefined;

    // Update isComplete status
    const visaType = documentRecord.visaType;
    const requiredDocs = getRequiredDocuments(visaType);
    const isComplete = requiredDocs.every(docType => {
      // Find a matching document in the current document record
      console.log(documentRecord.documents);
      const docKey = Object.keys(documentRecord.documents).find(
        key => camelCase(key) === docType
      );
      return (
        docKey &&
        documentRecord.documents[docKey] &&
        documentRecord.documents[docKey].secure_url
      );
    });

    documentRecord.isComplete = isComplete;
    await documentRecord.save();

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Document deleted successfully',
      data: {
        isComplete: documentRecord.isComplete,
      },
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error deleting document',
      error: error.message,
    });
  }
});

export { uploadDocument, getDocuments, deleteDocument };
