import expressAsyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import cloudinary from '../../config/cloudinary.js';
import EthiopiaVisaApplication from '../../models/ethiopia/ethiopiaVisaApplicationModel.js';
import EthiopiaVisaDocuments from '../../models/ethiopia/ethiopiaVisaDocumentsModel.js';

// Required documents for each visa type
const requiredDocuments = {
    journalist: ['passport', 'photo', 'applicationLetter', 'supportLetter', 'invitingCompanyInfo'],
    workshop: ['passport', 'photo', 'applicationLetter', 'invitationLetter'],
    tourist: ['passport', 'photo'],
    investment: ['passport', 'photo', 'supportLetter'],
    government: ['passport', 'photo', 'applicationLetter'],
    ngo: ['passport', 'photo', 'applicationLetter', 'registrationLicense'],
    private: ['passport', 'photo', 'businessLicense', 'applicationLetter', 'tinCertificate'],
    foreignInvestor: ['passport', 'photo', 'foreignInvestorEmployeeVisa'],
    student: ['passport', 'photo', 'acceptanceLetter'],
    religion: ['passport', 'photo', 'supportLetter'],
    residence: ['passport', 'photo', 'foreignInvestorEmployeeVisa'],
    sports: ['passport', 'photo', 'foreignInvestorEmployeeVisa'],
    medical: ['passport', 'photo', 'invitationLetter', 'applicationLetter'],
    business: ['passport', 'photo', 'applicationLetter', 'bankStatement', 'companyProfile']
};

// Upload a document for a visa application
const uploadDocument = expressAsyncHandler(async (req, res) => {
    try {
        const {
            applicationId,
            documentType,
            visaType,
            applicantType = 'primary',
            additionalApplicantIndex = null
        } = req.body;

        if (!applicationId || !documentType || !visaType) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'Missing required fields: applicationId, documentType, and visaType are required'
            });
        }

        // Check if the document type is valid for the visa type
        if (!requiredDocuments[visaType].includes(documentType)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: `${documentType} is not required for ${visaType} visa type`
            });
        }

        // Check if application exists
        const application = await EthiopiaVisaApplication.findById(applicationId);
        if (!application) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: 'Visa application not found'
            });
        }

        if (!req.file) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'Please upload a document'
            });
        }

        // Upload document to cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: `ethiopia-visa/${visaType}/${applicationId}`,
            resource_type: 'auto'
        });

        // Find or create document record
        let documentRecord;

        if (applicantType === 'primary') {
            documentRecord = await EthiopiaVisaDocuments.findOne({
                visaApplicationId: applicationId,
                applicantType: 'primary'
            });
        } else if (applicantType === 'additional' && additionalApplicantIndex !== null) {
            documentRecord = await EthiopiaVisaDocuments.findOne({
                visaApplicationId: applicationId,
                applicantType: 'additional',
                additionalApplicantIndex: additionalApplicantIndex
            });
        }

        if (!documentRecord) {
            documentRecord = new EthiopiaVisaDocuments({
                visaApplicationId: applicationId,
                visaType,
                applicantType,
                additionalApplicantIndex: applicantType === 'additional' ? additionalApplicantIndex : null
            });
        }

        // Update the document field
        documentRecord.documents[documentType] = {
            secure_url: result.secure_url,
            public_id: result.public_id,
            fileName: req.file.originalname,
            uploadedAt: new Date()
        };

        // Check if all required documents are uploaded
        const isComplete = requiredDocuments[visaType].every(
            docType => documentRecord.documents[docType] && documentRecord.documents[docType].secure_url
        );

        documentRecord.isComplete = isComplete;
        await documentRecord.save();

        // Update the application with the document reference
        if (applicantType === 'primary') {
            application.documents = documentRecord._id;
        } else if (applicantType === 'additional' && additionalApplicantIndex !== null) {
            if (!application.additionalApplicants[additionalApplicantIndex]) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: 'Additional applicant not found at the specified index'
                });
            }
            application.additionalApplicants[additionalApplicantIndex].documents = documentRecord._id;
        }

        await application.save();

        res.status(StatusCodes.OK).json({
            success: true,
            message: `${documentType} uploaded successfully`,
            data: {
                documentId: documentRecord._id,
                documentType,
                fileInfo: documentRecord.documents[documentType],
                isComplete: documentRecord.isComplete
            }
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Error uploading document',
            error: error.message
        });
    }
});

// Get all documents for a visa application
const getDocuments = expressAsyncHandler(async (req, res) => {
    try {
        const { applicationId, applicantType = 'primary', additionalApplicantIndex = null } = req.params;

        let query = {
            visaApplicationId: applicationId,
            applicantType
        };

        if (applicantType === 'additional' && additionalApplicantIndex !== null) {
            query.additionalApplicantIndex = additionalApplicantIndex;
        }

        const documents = await EthiopiaVisaDocuments.findOne(query);

        if (!documents) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: 'No documents found for this application'
            });
        }

        res.status(StatusCodes.OK).json({
            success: true,
            data: documents
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Error retrieving documents',
            error: error.message
        });
    }
});

// Delete a document
const deleteDocument = expressAsyncHandler(async (req, res) => {
    try {
        const { applicationId, documentType, applicantType = 'primary', additionalApplicantIndex = null } = req.params;

        let query = {
            visaApplicationId: applicationId,
            applicantType
        };

        if (applicantType === 'additional' && additionalApplicantIndex !== null) {
            query.additionalApplicantIndex = additionalApplicantIndex;
        }

        const documentRecord = await EthiopiaVisaDocuments.findOne(query);

        if (!documentRecord || !documentRecord.documents[documentType]) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: 'Document not found'
            });
        }

        // Delete from cloudinary
        const publicId = documentRecord.documents[documentType].public_id;
        await cloudinary.uploader.destroy(publicId);

        // Remove document from record
        documentRecord.documents[documentType] = undefined;

        // Update isComplete status
        const visaType = documentRecord.visaType;
        const isComplete = requiredDocuments[visaType].every(
            docType => documentRecord.documents[docType] && documentRecord.documents[docType].secure_url
        );

        documentRecord.isComplete = isComplete;
        await documentRecord.save();

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Document deleted successfully',
            data: {
                isComplete: documentRecord.isComplete
            }
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Error deleting document',
            error: error.message
        });
    }
});

export { uploadDocument, getDocuments, deleteDocument };
