import express from 'express';
import egyptPaymentController from '../../controllers/egyptN/egyptPaymentController.js';

const egyptPaymentRouter = express.Router();

// Create a payment order
egyptPaymentRouter.post('/create-order', egyptPaymentController.createPaymentOrder);

// Verify payment
egyptPaymentRouter.post('/verify-payment', egyptPaymentController.verifyPayment);

// Stripe payment
egyptPaymentRouter.post('/stripe-payment', egyptPaymentController.createStripeSession);

// Stripe Verify payment
egyptPaymentRouter.post('/stripe-verify-payment', egyptPaymentController.verifyStripePayment);

export default egyptPaymentRouter;
