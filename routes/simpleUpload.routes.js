import express from 'express';
import multer from 'multer';
import {
  deleteUpload,
  getAllUploads,
  submitFiles,
  uploadFile,
} from '../controllers/simpleUpload.controller.js';

const router = express.Router();

// Configure multer for file uploads (no size limit; allow images and PDFs)
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    console.log(
      '🔍 Multer fileFilter called for:',
      file.originalname,
      'mimetype:',
      file.mimetype
    );
    // Allow images and PDFs
    if (
      file.mimetype.startsWith('image/') ||
      file.mimetype === 'application/pdf'
    ) {
      console.log('✅ File type allowed:', file.mimetype);
      cb(null, true);
    } else {
      console.log('❌ File type not allowed:', file.mimetype);
      cb(new Error('Only images and PDF files are allowed'), false);
    }
  },
});

// Simple upload route
router.post(
  '/upload',
  upload.single('file'),
  (req, res, next) => {
    console.log('📤 Simple upload route hit');
    console.log('📤 Request headers:', req.headers);
    console.log('📤 Request body:', req.body);
    console.log('📤 Request file:', req.file);
    console.log('📤 Content-Type:', req.get('Content-Type'));

    // Handle multer errors
    if (req.fileValidationError) {
      console.log('❌ File validation error:', req.fileValidationError);
      return res.status(400).json({
        success: false,
        message: req.fileValidationError,
      });
    }

    if (!req.file) {
      console.log('❌ No file uploaded');
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    next();
  },
  uploadFile
);

// Get all uploads
router.get('/uploads', getAllUploads);

// Submit files
router.post('/submit', submitFiles);

// Delete upload
router.delete('/uploads/:id', deleteUpload);

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Simple upload service is healthy',
    timestamp: new Date().toISOString(),
  });
});

export default router;
