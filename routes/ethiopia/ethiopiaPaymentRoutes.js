import express from 'express';
import ethiopiaPaymentController from '../../controllers/ethiopia/ethiopiaPaymentController.js';

const ethiopiaPaymentRouter = express.Router();

// Create a payment order
ethiopiaPaymentRouter.post('/create-order', ethiopiaPaymentController.createPaymentOrder);

// Verify payment
ethiopiaPaymentRouter.post('/verify-payment', ethiopiaPaymentController.verifyPayment);

// Stripe payment
ethiopiaPaymentRouter.post('/stripe-payment', ethiopiaPaymentController.createStripeSession);

// Stripe Verify payment
ethiopiaPaymentRouter.post('/stripe-verify-payment', ethiopiaPaymentController.verifyStripePayment);

export default ethiopiaPaymentRouter;
