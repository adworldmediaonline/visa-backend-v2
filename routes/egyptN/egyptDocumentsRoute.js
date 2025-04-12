import express from 'express';
import {
  uploadDocument,
  getDocuments,
  deleteDocument,
  getRequiredDocumentsForVisaType
} from '../../controllers/egyptN/egyptDocumentsController.js';
import upload from '../../middleware/uploadMiddleware.js';

const egyptDocumentsRoute = express.Router();

// Upload a document
egyptDocumentsRoute.post('/upload', upload.single('image'), uploadDocument);

// Get all documents for an application
egyptDocumentsRoute.get(
  '/:applicationId/:applicantType?/:additionalApplicantIndex?',
  getDocuments
);

// Delete a document
egyptDocumentsRoute.delete(
  '/:applicationId/:documentType/:applicantType?/:additionalApplicantIndex?',
  deleteDocument
);

// Get required documents for a visa type
egyptDocumentsRoute.get(
  '/required-documents/:visaType',
  getRequiredDocumentsForVisaType
);

export default egyptDocumentsRoute;
