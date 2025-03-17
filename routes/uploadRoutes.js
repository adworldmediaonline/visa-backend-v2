import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import {
  uploadSingleImage,
  uploadMultipleImages,
  deleteImage,
} from '../controllers/imageController.js';

const router = express.Router();

// Upload single image
router.post('/single', upload.single('image'), uploadSingleImage);

// Upload multiple images
router.post('/multiple', upload.array('images', 10), uploadMultipleImages);

// Delete image - using * to capture the full path including slashes
router.delete('/:publicId(*)', deleteImage);

export default router;
