import crypto from 'crypto';
import { PassThrough } from 'stream';
import cloudinary from '../../config/cloudinary.js';
import VisaApplication from '../models/visaApplication.model.js';

// Helper function to validate document data
const validateDocumentData = documentData => {
  const requiredFields = ['url', 'publicId', 'name', 'type'];
  const missingFields = requiredFields.filter(field => !documentData[field]);

  if (missingFields.length > 0) {
    console.error('❌ Missing required document fields:', missingFields);
    return false;
  }

  return true;
};

/**
 * Get Cloudinary configuration for unsigned upload
 * GET /api/v2/visa/documents/config
 */
export const getCloudinaryConfig = async (req, res) => {
  try {
    // Check Cloudinary configuration
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'Cloudinary not configured',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        uploadPreset: 'visacollect', // Use the actual preset from Cloudinary
      },
    });
  } catch (error) {
    console.error('❌ Error getting Cloudinary config:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get Cloudinary configuration',
      error: error.message,
    });
  }
};

/**
 * Get Cloudinary upload signature for direct upload
 * POST /api/v2/visa/documents/signature
 */
export const getUploadSignature = async (req, res) => {
  try {
    const { applicationId, documentType, fileName, mimeType } = req.body;

    if (!applicationId || !documentType) {
      return res.status(400).json({
        success: false,
        message: 'Application ID and document type are required',
      });
    }

    // Find the application by custom applicationId
    const application = await VisaApplication.findOne({
      applicationId: applicationId,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Check Cloudinary configuration
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return res.status(500).json({
        success: false,
        message: 'Cloudinary not configured',
      });
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = `visa-applications/${application.applicationId}/${documentType}`;

    // Create signature
    const params = {
      timestamp,
      folder,
      resource_type: 'auto',
    };

    const signature = crypto
      .createHash('sha1')
      .update(
        `folder=${folder}&resource_type=auto&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`
      )
      .digest('hex');

    res.status(200).json({
      success: true,
      data: {
        signature,
        timestamp,
        apiKey: process.env.CLOUDINARY_API_KEY,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        folder,
      },
    });
  } catch (error) {
    console.error('❌ Error generating signature:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate upload signature',
      error: error.message,
    });
  }
};

/**
 * Save document info after Cloudinary upload
 * POST /api/v2/visa/documents/save
 */
export const saveDocumentInfo = async (req, res) => {
  try {
    const { applicationId, documentType, cloudinaryData, fileName, mimeType } =
      req.body;

    if (!applicationId || !documentType || !cloudinaryData) {
      return res.status(400).json({
        success: false,
        message:
          'Application ID, document type, and Cloudinary data are required',
      });
    }

    // Find the application by custom applicationId
    const application = await VisaApplication.findOne({
      applicationId: applicationId,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Validate that we have both url and publicId
    if (!cloudinaryData.secure_url || !cloudinaryData.public_id) {
      console.error('❌ Missing required fields from Cloudinary:', {
        secure_url: cloudinaryData.secure_url,
        public_id: cloudinaryData.public_id,
      });
      return res.status(500).json({
        success: false,
        message: 'Invalid response from Cloudinary - missing required fields',
      });
    }

    // Save document info to application with both url and publicId
    const documentData = {
      name: fileName || cloudinaryData.original_filename || 'document',
      url: cloudinaryData.secure_url,
      type: documentType,
      uploadedAt: new Date(),
      publicId: cloudinaryData.public_id,
      fileSize: cloudinaryData.bytes,
      mimeType: mimeType || cloudinaryData.format,
    };

    // Validate document data before saving
    if (!validateDocumentData(documentData)) {
      return res.status(500).json({
        success: false,
        message: 'Invalid document data - missing required fields',
      });
    }

    console.log('💾 Saving document to database:', {
      name: documentData.name,
      url: documentData.url,
      publicId: documentData.publicId,
      type: documentData.type,
    });

    await VisaApplication.findByIdAndUpdate(application._id, {
      $push: { documents: documentData },
    });

    console.log(
      `Document saved successfully for application ${application.applicationId}:`,
      {
        documentType,
        publicId: cloudinaryData.public_id,
        url: cloudinaryData.secure_url,
      }
    );

    res.status(200).json({
      success: true,
      data: {
        documentType,
        url: cloudinaryData.secure_url,
        publicId: cloudinaryData.public_id,
        fileName: documentData.name,
        fileSize: documentData.fileSize,
        mimeType: documentData.mimeType,
        uploadedAt: documentData.uploadedAt,
      },
    });
  } catch (error) {
    console.error('❌ Error saving document info:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save document info',
      error: error.message,
    });
  }
};

/**
 * Upload document to Cloudinary (legacy - using multer)
 * POST /api/v2/visa/documents/upload
 */
export const uploadDocument = async (req, res) => {
  console.log('📤 Document upload request received:', {
    body: req.body,
    file: req.file
      ? {
          fieldname: req.file.fieldname,
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
          path: req.file.path,
        }
      : null,
    headers: req.headers,
  });

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

    // Find the application by custom applicationId
    console.log('🔍 Looking for application with ID:', applicationId);
    const application = await VisaApplication.findOne({
      applicationId: applicationId,
    });

    console.log('🔍 Application found:', application ? 'Yes' : 'No');
    if (application) {
      console.log('🔍 Application details:', {
        id: application._id,
        applicationId: application.applicationId,
        emailAddress: application.emailAddress,
      });
    }

    if (!application) {
      console.log('❌ Application not found for ID:', applicationId);
      return res.status(404).json({
        success: false,
        message: 'Application not found',
        applicationId: applicationId,
      });
    }

    let result;

    // Upload to Cloudinary using the same proven approach as main backend
    try {
      console.log('☁️ Uploading to Cloudinary...');
      console.log(
        '☁️ File buffer size:',
        file.buffer ? file.buffer.length : 'No buffer'
      );

      // Convert buffer to stream for Cloudinary upload
      const bufferStream = new PassThrough();
      bufferStream.end(file.buffer);

      result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `visa-applications/${application.applicationId}/${documentType}`,
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) {
              console.error('❌ Cloudinary upload failed:', error);
              reject(new Error(`Cloudinary upload failed: ${error.message}`));
            } else {
              console.log('✅ Cloudinary upload successful:', result.public_id);
              resolve(result);
            }
          }
        );

        bufferStream.pipe(uploadStream);
      });
    } catch (cloudinaryError) {
      console.error('❌ Cloudinary upload failed:', cloudinaryError);
      throw new Error(`Cloudinary upload failed: ${cloudinaryError.message}`);
    }

    // Validate that we have both url and publicId
    if (!result.secure_url || !result.public_id) {
      console.error('❌ Missing required fields from Cloudinary (legacy):', {
        secure_url: result.secure_url,
        public_id: result.public_id,
      });
      return res.status(500).json({
        success: false,
        message: 'Invalid response from Cloudinary - missing required fields',
      });
    }

    // Update application with document URL and publicId
    const documentData = {
      name: file.originalname,
      url: result.secure_url,
      type: documentType,
      uploadedAt: new Date(),
      publicId: result.public_id,
      fileSize: file.buffer ? file.buffer.length : 0,
      mimeType: file.mimetype,
    };

    // Validate document data before saving
    if (!validateDocumentData(documentData)) {
      return res.status(500).json({
        success: false,
        message: 'Invalid document data - missing required fields',
      });
    }

    console.log('💾 Saving document to database (legacy):', {
      name: documentData.name,
      url: documentData.url,
      publicId: documentData.publicId,
      type: documentData.type,
    });

    await VisaApplication.findByIdAndUpdate(application._id, {
      $push: { documents: documentData },
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
        fileSize: file.buffer ? file.buffer.length : 0,
        mimeType: file.mimetype,
        uploadedAt: new Date(),
      },
    });
  } catch (error) {
    console.error('❌ Error uploading document:', error);
    console.error('❌ Error stack:', error.stack);
    console.error('❌ Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
    });

    res.status(500).json({
      success: false,
      message: 'Failed to upload document',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
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

    // Find the application by custom applicationId
    const application = await VisaApplication.findOne({
      applicationId: applicationId,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Find document in the documents array
    const documentIndex = application.documents.findIndex(
      doc => doc.type === documentType
    );

    if (documentIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    const documentInfo = application.documents[documentIndex];

    // Delete from Cloudinary if it's a Cloudinary document
    if (documentInfo.url && !documentInfo.url.startsWith('file://')) {
      try {
        await cloudinary.uploader.destroy(documentInfo.publicId || '');
      } catch (cloudinaryError) {
        console.log(
          '⚠️ Cloudinary deletion failed, continuing with local removal:',
          cloudinaryError
        );
      }
    }

    // Remove document from application
    await VisaApplication.findByIdAndUpdate(application._id, {
      $pull: { documents: { type: documentType } },
    });

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

    // Find the application by custom applicationId
    const application = await VisaApplication.findOne({
      applicationId: applicationId,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Convert documents array to object format for frontend compatibility
    const documentsObj = {};
    const uploadStatus = {
      passportPhoto: false,
      passportCopy: false,
      visaPhoto: false,
      supportingDocument: false,
    };

    application.documents.forEach(doc => {
      documentsObj[doc.type] = {
        url: doc.url,
        publicId: doc.publicId || '',
        uploadedAt: doc.uploadedAt,
        fileName: doc.name,
        fileSize: doc.fileSize || 0,
        mimeType: doc.mimeType || 'image/jpeg',
      };
      uploadStatus[doc.type] = true;

      console.log('📋 Document found in database:', {
        type: doc.type,
        url: doc.url,
        publicId: doc.publicId,
        fileName: doc.name,
      });
    });

    res.status(200).json({
      success: true,
      data: {
        applicationId: application.applicationId,
        documents: documentsObj,
        uploadStatus,
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
