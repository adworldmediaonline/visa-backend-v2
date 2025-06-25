import express from 'express';
import {
  submitContactForm,
  getAllContactSubmissions,
  getContactSubmissionById,
  updateContactStatus,
} from '../controllers/contactController.js';

const router = express.Router();

// Public routes
router.post('/', submitContactForm);

// Admin routes (you can add authentication middleware here later)
router.get('/admin/submissions', getAllContactSubmissions);
router.get('/admin/submissions/:id', getContactSubmissionById);
router.put('/admin/submissions/:id/status', updateContactStatus);

export default router; 