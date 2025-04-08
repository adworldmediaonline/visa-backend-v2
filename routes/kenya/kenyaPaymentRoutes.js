import express from 'express';
import kenyaPaymentController from '../../controllers/kenya/kenyaPaymentController';

const kenyaPaymentRouter = express.Router();

// Create a payment order
kenyaPaymentRouter.post('/create-order', kenyaPaymentController.createPaymentOrder);

// Verify payment
kenyaPaymentRouter.post('/verify-payment', kenyaPaymentController.verifyPayment);

// Stripe payment
kenyaPaymentRouter.post('/stripe-payment', kenyaPaymentController.createStripeSession);

// Stripe Verify payment
kenyaPaymentRouter.post('/stripe-verify-payment', kenyaPaymentController.verifyStripePayment);

export default kenyaPaymentRouter;
