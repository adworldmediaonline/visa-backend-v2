import express from 'express';
import multer from 'multer';
import {
  deleteDocument,
  getDocuments,
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
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    },
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images and PDFs
    if (
      file.mimetype.startsWith('image/') ||
      file.mimetype === 'application/pdf'
    ) {
      cb(null, true);
    } else {
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

// Document Upload Routes
router.post('/documents/upload', upload.single('document'), uploadDocument);
router.delete('/documents/:applicationId/:documentType', deleteDocument);
router.get('/documents/:applicationId', getDocuments);

// Admin Routes (consider adding authentication middleware)
router.get('/applications', getAllApplications);

export default router;
