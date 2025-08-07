import cloudinary from '../../config/cloudinary.js';
import VisaApplication from '../models/visaApplication.model.js';

/**
 * Upload document to Cloudinary
 * POST /api/v2/visa/documents/upload
 */
export const uploadDocument = async (req, res) => {
  try {
    const { applicationId, documentType } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    if (!applicationId || !documentType) {
      return res.status(400).json({
        success: false,
        message: 'Application ID and document type are required',
      });
    }

    // Validate document type
    const allowedTypes = [
      'passportPhoto',
      'passportCopy',
      'visaPhoto',
      'supportingDocument',
    ];
    if (!allowedTypes.includes(documentType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid document type',
      });
    }

    // Find the application
    const application = await VisaApplication.findOne({
      $or: [{ _id: applicationId }, { applicationId: applicationId }],
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Upload to Cloudinary
    const uploadOptions = {
      folder: `visa-applications/${application.applicationId}/${documentType}`,
      resource_type: 'auto',
      allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
      transformation: [{ quality: 'auto:good' }, { fetch_format: 'auto' }],
    };

    const result = await cloudinary.uploader.upload(file.path, uploadOptions);

    // Update application with document URL
    const updateData = {
      [`formData.documents.${documentType}`]: {
        url: result.secure_url,
        publicId: result.public_id,
        uploadedAt: new Date(),
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
      },
    };

    await VisaApplication.findByIdAndUpdate(application._id, {
      $set: updateData,
    });

    console.log(
      `Document uploaded successfully for application ${application.applicationId}:`,
      {
        documentType,
        publicId: result.public_id,
        url: result.secure_url,
      }
    );

    res.status(200).json({
      success: true,
      data: {
        documentType,
        url: result.secure_url,
        publicId: result.public_id,
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
        uploadedAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload document',
      error: error.message,
    });
  }
};

/**
 * Delete document from Cloudinary
 * DELETE /api/v2/visa/documents/:applicationId/:documentType
 */
export const deleteDocument = async (req, res) => {
  try {
    const { applicationId, documentType } = req.params;

    // Find the application
    const application = await VisaApplication.findOne({
      $or: [{ _id: applicationId }, { applicationId: applicationId }],
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Get document info
    const documentInfo = application.formData?.documents?.[documentType];
    if (!documentInfo || !documentInfo.publicId) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(documentInfo.publicId);

    // Remove document from application
    const updateData = {
      $unset: {
        [`formData.documents.${documentType}`]: 1,
      },
    };

    await VisaApplication.findByIdAndUpdate(application._id, updateData);

    console.log(
      `Document deleted successfully for application ${application.applicationId}:`,
      {
        documentType,
        publicId: documentInfo.publicId,
      }
    );

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully',
      data: {
        documentType,
        publicId: documentInfo.publicId,
      },
    });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete document',
      error: error.message,
    });
  }
};

/**
 * Get document upload status
 * GET /api/v2/visa/documents/:applicationId
 */
export const getDocuments = async (req, res) => {
  try {
    const { applicationId } = req.params;

    // Find the application
    const application = await VisaApplication.findOne({
      $or: [{ _id: applicationId }, { applicationId: applicationId }],
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    const documents = application.formData?.documents || {};

    res.status(200).json({
      success: true,
      data: {
        applicationId: application.applicationId,
        documents,
        uploadStatus: {
          passportPhoto: !!documents.passportPhoto,
          passportCopy: !!documents.passportCopy,
          visaPhoto: !!documents.visaPhoto,
          supportingDocument: !!documents.supportingDocument,
        },
      },
    });
  } catch (error) {
    console.error('Error getting documents:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get documents',
      error: error.message,
    });
  }
};
