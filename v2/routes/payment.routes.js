import express from 'express';
import { capturePayPalOrderForApplication, createPayPalOrderForApplication } from '../controllers/payment.controller.js';

const router = express.Router();

router.post('/applications/:id/paypal/create-order', createPayPalOrderForApplication);
router.post('/applications/:id/paypal/capture', capturePayPalOrderForApplication);

export default router;


