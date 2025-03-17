import cloudinary from '../config/cloudinary.js';
import { StatusCodes } from 'http-status-codes';
import expressAsyncHandler from 'express-async-handler';

// @desc    Upload single image
// @route   POST /api/v1/upload/single
// @access  Private
const uploadSingleImage = expressAsyncHandler(async (req, res) => {
  try {
    if (!req.file) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Please upload an image',
      });
    }

    // Upload image to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'visa-images',
      resource_type: 'auto',
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        secure_url: result.secure_url,
        public_id: result.public_id,
        fileName: req.file.originalname,
      },
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error uploading image',
      error: error.message,
    });
  }
});

// @desc    Upload multiple images
// @route   POST /api/v1/upload/multiple
// @access  Private
const uploadMultipleImages = expressAsyncHandler(async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Please upload at least one image',
      });
    }

    const uploadPromises = req.files.map(async file => {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'visa-images',
        resource_type: 'auto',
      });

      return {
        secure_url: result.secure_url,
        public_id: result.public_id,
        fileName: file.originalname,
      };
    });

    const uploadedImages = await Promise.all(uploadPromises);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Images uploaded successfully',
      data: uploadedImages,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error uploading images',
      error: error.message,
    });
  }
});

// @desc    Delete image from cloudinary
// @route   DELETE /api/v1/upload/:publicId
// @access  Private
const deleteImage = expressAsyncHandler(async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Please provide public_id',
      });
    }

    // The publicId already includes the folder name, so we don't need to add it again
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'ok') {
      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Image deleted successfully',
      });
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Error deleting image',
        error: 'Image not found or already deleted',
      });
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error deleting image',
      error: error.message,
    });
  }
});

export { uploadSingleImage, uploadMultipleImages, deleteImage };
