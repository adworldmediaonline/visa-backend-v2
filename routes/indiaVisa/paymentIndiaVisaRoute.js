import express from 'express';
const indiaVisaPaymentRouter = express.Router();
import {
  createIndiaVisaCheckoutSession,
  handleCompletedCheckout,
} from '../../controllers/indiaVisa/paymentIndiaVisaController.js';

// Regular payment checkout route
indiaVisaPaymentRouter
  .route('/checkout-session/:id')
  .post(createIndiaVisaCheckoutSession);

// Manual payment verification route - for when webhooks fail
indiaVisaPaymentRouter
  .route('/verify-payment/:sessionId')
  .get(async (req, res) => {
    try {
      const { sessionId } = req.params;

      if (!sessionId) {
        return res.status(400).json({
          status: 'error',
          message: 'Session ID is required',
        });
      }

      console.log(
        `Manual payment verification requested for session: ${sessionId}`
      );

      // Import Stripe and retrieve the session
      const Stripe = await import('stripe');
      const stripe = new Stripe.default(process.env.STRIPE_SECRET_KEY_TEST);

      // Get session details from Stripe
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (!session) {
        return res.status(404).json({
          status: 'error',
          message: 'Session not found',
        });
      }

      if (session.payment_status !== 'paid') {
        return res.status(400).json({
          status: 'error',
          message: `Payment not completed. Current status: ${session.payment_status}`,
        });
      }

      // Process the payment
      const result = await handleCompletedCheckout(session);

      if (result) {
        return res.status(200).json({
          status: 'success',
          message: 'Payment verified and processed successfully',
          session_id: sessionId,
          client_reference_id: session.client_reference_id,
        });
      } else {
        return res.status(500).json({
          status: 'error',
          message: 'Payment verification failed',
          session_id: sessionId,
        });
      }
    } catch (error) {
      console.error('Manual payment verification error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Error processing payment verification',
        error:
          process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  });

export default indiaVisaPaymentRouter;
