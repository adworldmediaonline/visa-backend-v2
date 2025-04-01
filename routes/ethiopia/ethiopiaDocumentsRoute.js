import express from 'express';
import {
  uploadDocument,
  getDocuments,
  deleteDocument,
} from '../../controllers/ethiopia/ethiopiaDocumentsController.js';
import upload from '../../middleware/uploadMiddleware.js';

const ethiopiaDocumentsRoute = express.Router();

// Upload a document
ethiopiaDocumentsRoute.post('/upload', upload.single('image'), uploadDocument);

// Get all documents for an application
ethiopiaDocumentsRoute.get(
  '/:applicationId/:applicantType?/:additionalApplicantIndex?',
  getDocuments
);

// Delete a document
ethiopiaDocumentsRoute.delete(
  '/:applicationId/:documentType/:applicantType?/:additionalApplicantIndex?',
  deleteDocument
);

export default ethiopiaDocumentsRoute;
