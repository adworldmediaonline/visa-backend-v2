import express from 'express';
import {
  uploadDocument,
  getDocuments,
  deleteDocument,
} from '../../controllers/kenya/kenyaDocumentsController.js';
import upload from '../../middleware/uploadMiddleware.js';

const kenyaDocumentsRoute = express.Router();

// Upload a document
kenyaDocumentsRoute.post('/upload', upload.single('image'), uploadDocument);

// Get all documents for an application
kenyaDocumentsRoute.get(
  '/:applicationId/:applicantType?/:additionalApplicantIndex?',
  getDocuments
);

// Delete a document
kenyaDocumentsRoute.delete(
  '/:applicationId/:documentType/:applicantType?/:additionalApplicantIndex?',
  deleteDocument
);

export default kenyaDocumentsRoute;
