import express from 'express';
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

// Visa Rules Routes
router.get('/rules', getVisaRules);

// Application Routes
router.post('/applications/start', startApplication);
router.get('/applications/:id', getApplication);
router.patch('/applications/:id', updateApplication);
router.post('/applications/:id/submit', submitApplication);
router.post('/applications/:id/documents', addDocument);
router.post('/applications/:id/payment', updatePayment);

// Admin Routes (consider adding authentication middleware)
router.get('/applications', getAllApplications);

export default router;
