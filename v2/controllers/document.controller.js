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
        Object.keys(params)
          .sort()
          .map(key => `${key}=${params[key]}`)
          .join('&') + process.env.CLOUDINARY_API_SECRET
      )
      .digest('hex');

    res.status(200).json({
      success: true,
      data: {
        signature,
        timestamp,
        folder,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
      },
    });
  } catch (error) {
    console.error('❌ Error getting upload signature:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get upload signature',
      error: error.message,
    });
  }
};

/**
 * Save document info after direct Cloudinary upload
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

    // Find the application
    const application = await VisaApplication.findOne({
      applicationId: applicationId,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Prepare document data
    const documentData = {
      name: fileName || 'document',
      url: cloudinaryData.secure_url,
      type: documentType,
      uploadedAt: new Date(),
      publicId: cloudinaryData.public_id,
      fileSize: cloudinaryData.bytes || 0,
      mimeType: mimeType || 'image/jpeg',
    };

    // Validate document data
    if (!validateDocumentData(documentData)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid document data',
      });
    }

    // Save to database
    await VisaApplication.findByIdAndUpdate(
      application._id,
      {
        $push: { documents: documentData },
      },
      { new: true }
    );

    console.log('✅ Document info saved to database:', {
      applicationId: application.applicationId,
      documentType,
      publicId: cloudinaryData.public_id,
    });

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
 * Upload document using multer (robust implementation)
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
          bufferSize: req.file.buffer ? req.file.buffer.length : 'No buffer',
        }
      : null,
    headers: req.headers,
  });

  try {
    const { applicationId, documentType } = req.body;
    const file = req.file;

    // Validate request
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

    // No explicit file size restriction here; rely on infra limits and Cloudinary

    // Find the application
    console.log('🔍 Looking for application with ID:', applicationId);
    const application = await VisaApplication.findOne({
      applicationId: applicationId,
    });

    if (!application) {
      console.log('❌ Application not found for ID:', applicationId);
      return res.status(404).json({
        success: false,
        message: 'Application not found',
        applicationId: applicationId,
      });
    }

    console.log('✅ Application found:', application.applicationId);

    // Upload to Cloudinary
    let result;
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
            // Remove format restrictions to allow Cloudinary to auto-detect
            transformation: [{ quality: 'auto:good' }],
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
      return res.status(500).json({
        success: false,
        message: 'Failed to upload to Cloudinary',
        error: cloudinaryError.message,
      });
    }

    // Validate Cloudinary response
    if (!result.secure_url || !result.public_id) {
      console.error('❌ Invalid Cloudinary response:', result);
      return res.status(500).json({
        success: false,
        message: 'Invalid response from Cloudinary',
      });
    }

    // Prepare document data
    const documentData = {
      name: file.originalname,
      url: result.secure_url,
      type: documentType,
      uploadedAt: new Date(),
      publicId: result.public_id,
      fileSize: file.buffer ? file.buffer.length : 0,
      mimeType: file.mimetype,
    };

    // Save to database
    try {
      await VisaApplication.findByIdAndUpdate(
        application._id,
        {
          $push: { documents: documentData },
        },
        { new: true }
      );

      console.log('✅ Document saved to database:', {
        applicationId: application.applicationId,
        documentType,
        publicId: result.public_id,
      });

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
    } catch (dbError) {
      console.error('❌ Database save failed:', dbError);

      // Try to delete from Cloudinary if database save fails
      try {
        await cloudinary.uploader.destroy(result.public_id);
        console.log('✅ Cleaned up Cloudinary file after DB failure');
      } catch (cleanupError) {
        console.error('❌ Failed to cleanup Cloudinary file:', cleanupError);
      }

      return res.status(500).json({
        success: false,
        message: 'Failed to save document to database',
        error: dbError.message,
      });
    }
  } catch (error) {
    console.error('❌ Document upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload document',
      error: error.message,
    });
  }
};

/**
 * Delete document
 * DELETE /api/v2/visa/documents/:applicationId/:documentType
 */
export const deleteDocument = async (req, res) => {
  try {
    const { applicationId, documentType } = req.params;

    if (!applicationId || !documentType) {
      return res.status(400).json({
        success: false,
        message: 'Application ID and document type are required',
      });
    }

    // Find the application
    const application = await VisaApplication.findOne({
      applicationId: applicationId,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Find the document to get its publicId
    const document = application.documents.find(
      doc => doc.type === documentType
    );

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    // Remove from database
    await VisaApplication.findByIdAndUpdate(application._id, {
      $pull: { documents: { type: documentType } },
    });

    // Try to delete from Cloudinary if publicId exists
    if (document.publicId) {
      try {
        await cloudinary.uploader.destroy(document.publicId);
        console.log('✅ Document deleted from Cloudinary:', document.publicId);
      } catch (cloudinaryError) {
        console.error('❌ Failed to delete from Cloudinary:', cloudinaryError);
        // Don't fail the request if Cloudinary deletion fails
      }
    }

    console.log('✅ Document deleted from database:', {
      applicationId: application.applicationId,
      documentType,
    });

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully',
    });
  } catch (error) {
    console.error('❌ Error deleting document:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete document',
      error: error.message,
    });
  }
};

/**
 * Get documents for an application
 * GET /api/v2/visa/documents/:applicationId
 */
export const getDocuments = async (req, res) => {
  try {
    const { applicationId } = req.params;

    if (!applicationId) {
      return res.status(400).json({
        success: false,
        message: 'Application ID is required',
      });
    }

    // Find the application
    const application = await VisaApplication.findOne({
      applicationId: applicationId,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Transform documents array to object format for frontend compatibility
    const documents = {};
    const uploadStatus = {
      passportPhoto: false,
      passportCopy: false,
      visaPhoto: false,
      supportingDocument: false,
    };

    application.documents.forEach(doc => {
      documents[doc.type] = {
        url: doc.url,
        publicId: doc.publicId,
        uploadedAt: doc.uploadedAt,
        fileName: doc.name,
        fileSize: doc.fileSize,
        mimeType: doc.mimeType,
      };
      uploadStatus[doc.type] = true;
    });

    res.status(200).json({
      success: true,
      data: {
        applicationId: application.applicationId,
        documents,
        uploadStatus,
      },
    });
  } catch (error) {
    console.error('❌ Error getting documents:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get documents',
      error: error.message,
    });
  }
};
