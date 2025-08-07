import express from 'express';
import multer from 'multer';
import {
  deleteDocument,
  getCloudinaryConfig,
  getDocuments,
  getUploadSignature,
  saveDocumentInfo,
  uploadDocument,
} from '../controllers/document.controller.js';
import {
  addDocument,
  getAllApplications,
  getApplication,
  getVisaRules,
  startApplication,
  submitApplication,
  updateApplication,
  updatePayment,
} from '../controllers/visa.controller.js';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      console.log('📁 Multer destination called for file:', file.originalname);
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const filename = file.fieldname + '-' + uniqueSuffix + '-' + file.originalname;
      console.log('📁 Multer filename generated:', filename);
      cb(null, filename);
    },
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    console.log('🔍 Multer fileFilter called for:', file.originalname, 'mimetype:', file.mimetype);
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

// Visa Rules Routes
router.get('/rules', getVisaRules);

// Application Routes
router.post('/applications/start', startApplication);
router.get('/applications/:id', getApplication);
router.patch('/applications/:id', updateApplication);
router.post('/applications/:id/submit', submitApplication);
router.post('/applications/:id/documents', addDocument);
router.post('/applications/:id/payment', updatePayment);

// Document Upload Routes (Direct to Cloudinary)
router.get('/documents/config', getCloudinaryConfig);
router.post('/documents/signature', getUploadSignature);
router.post('/documents/save', saveDocumentInfo);

// Legacy Document Upload Routes (using multer)
router.post('/documents/upload', upload.single('document'), (req, res, next) => {
  console.log('📤 Document upload route hit');
  console.log('📤 Request body:', req.body);
  console.log('📤 Request file:', req.file);
  
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
}, uploadDocument);

// Simple test endpoint for file upload
router.post('/test-upload', upload.single('document'), (req, res) => {
  try {
    console.log('🧪 Test upload endpoint hit');
    console.log('🧪 Request body:', req.body);
    console.log('🧪 Request file:', req.file);
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      file: {
        fieldname: req.file.fieldname,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
      },
    });
  } catch (error) {
    console.error('❌ Test upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Test upload failed',
      error: error.message,
    });
  }
});

// Simple health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'V2 API is running',
    timestamp: new Date().toISOString(),
  });
});
router.delete('/documents/:applicationId/:documentType', deleteDocument);
router.get('/documents/:applicationId', getDocuments);

// Admin Routes (consider adding authentication middleware)
router.get('/applications', getAllApplications);

export default router;
