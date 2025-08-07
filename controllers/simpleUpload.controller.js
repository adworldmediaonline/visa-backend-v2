import { PassThrough } from 'stream';
import cloudinary from '../config/cloudinary.js';
import SimpleUpload from '../models/simpleUpload.model.js';

export const uploadFile = async (req, res) => {
  console.log('📤 Simple upload request received');
  console.log('📤 Request body:', req.body);
  console.log(
    '📤 Request file:',
    req.file
      ? {
          fieldname: req.file.fieldname,
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          bufferSize: req.file.buffer ? req.file.buffer.length : 'No buffer',
        }
      : 'No file'
  );
  console.log('📤 Request headers:', req.headers);

  try {
    const file = req.file;

    if (!file) {
      console.log('❌ No file uploaded');
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    console.log('✅ File received, uploading to Cloudinary...');

    // Upload to Cloudinary
    let result;
    try {
      const bufferStream = new PassThrough();
      bufferStream.end(file.buffer);

      result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'simple-uploads',
            resource_type: 'auto',
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

    // Save to database
    const uploadData = {
      fileName: file.originalname,
      originalName: file.originalname,
      mimeType: file.mimetype,
      fileSize: file.buffer ? file.buffer.length : 0,
      url: result.secure_url,
      publicId: result.public_id,
    };

    const savedUpload = await SimpleUpload.create(uploadData);

    console.log('✅ File uploaded and saved to database:', savedUpload._id);

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        id: savedUpload._id,
        fileName: savedUpload.fileName,
        url: savedUpload.url,
        publicId: savedUpload.publicId,
        fileSize: savedUpload.fileSize,
        mimeType: savedUpload.mimeType,
        uploadedAt: savedUpload.uploadedAt,
      },
    });
  } catch (error) {
    console.error('❌ Simple upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload file',
      error: error.message,
    });
  }
};

export const getAllUploads = async (req, res) => {
  try {
    const uploads = await SimpleUpload.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: uploads,
    });
  } catch (error) {
    console.error('❌ Error getting uploads:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get uploads',
      error: error.message,
    });
  }
};

export const submitFiles = async (req, res) => {
  console.log('📤 Submit files request received');
  console.log('📤 Request body:', req.body);

  try {
    const { files, submittedAt } = req.body;

    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files provided for submission',
      });
    }

    console.log('✅ Files received for submission:', files.length);

    // Here you would typically:
    // 1. Validate the files exist in the database
    // 2. Associate them with a specific application or user
    // 3. Update their status to 'submitted'
    // 4. Create any necessary records in other collections

    // For now, we'll just mark them as submitted in the SimpleUpload collection
    const fileIds = files.map(file => file.id);

    const updateResult = await SimpleUpload.updateMany(
      { _id: { $in: fileIds } },
      {
        $set: {
          status: 'submitted',
          submittedAt: submittedAt || new Date(),
        },
      }
    );

    console.log('✅ Files marked as submitted:', updateResult.modifiedCount);

    res.status(200).json({
      success: true,
      message: `Successfully submitted ${files.length} files`,
      data: {
        submittedCount: updateResult.modifiedCount,
        submittedAt: submittedAt || new Date(),
        fileIds: fileIds,
      },
    });
  } catch (error) {
    console.error('❌ Submit files error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit files',
      error: error.message,
    });
  }
};

export const deleteUpload = async (req, res) => {
  try {
    const { id } = req.params;

    const upload = await SimpleUpload.findById(id);
    if (!upload) {
      return res.status(404).json({
        success: false,
        message: 'Upload not found',
      });
    }

    // Delete from Cloudinary
    if (upload.publicId) {
      try {
        await cloudinary.uploader.destroy(upload.publicId);
        console.log('✅ File deleted from Cloudinary:', upload.publicId);
      } catch (cloudinaryError) {
        console.error('❌ Failed to delete from Cloudinary:', cloudinaryError);
      }
    }

    // Delete from database
    await SimpleUpload.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Upload deleted successfully',
    });
  } catch (error) {
    console.error('❌ Error deleting upload:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete upload',
      error: error.message,
    });
  }
};
