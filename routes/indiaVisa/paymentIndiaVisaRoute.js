import express from 'express';
import {
  createIndiaVisaCheckoutSession,
  webhookCheckout,
  handleCompletedCheckout,
} from '../../controllers/indiaVisa/paymentIndiaVisaController.js';
import Stripe from 'stripe';

const indiaVisaPaymentRouter = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_LIVE);

// Create Checkout Session
indiaVisaPaymentRouter.post(
  '/create-checkout-session/:id',
  createIndiaVisaCheckoutSession
);

// Manual payment verification endpoint
indiaVisaPaymentRouter.get('/verify-payment', async (req, res) => {
  try {
    const { sessionId, orderId, forceUpdate } = req.query;

    if (!sessionId) {
      return res.status(400).json({
        status: 'error',
        message: 'Session ID is required',
      });
    }

    console.log(
      `Manual payment verification requested for session ${sessionId}`,
      orderId ? `with orderId ${orderId}` : '',
      forceUpdate ? '(force update requested)' : ''
    );

    // Check if the payment is already processed
    if (orderId) {
      const visaRequestForm = await (
        await import('../../models/visa.js')
      ).default;
      const existingRecord = await visaRequestForm.findById(orderId);

      if (existingRecord && existingRecord.paid) {
        return res.status(200).json({
          status: 'success',
          message: 'Payment already verified',
          data: {
            paid: true,
            applicationId: orderId,
          },
        });
      }
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return res.status(404).json({
        status: 'error',
        message: 'Session not found',
      });
    }

    // Check if payment is successful
    if (session.payment_status === 'paid') {
      // Process the payment
      console.log(
        `Processing manual payment verification for session ${sessionId}`
      );

      // If forceUpdate is true, we'll bypass the normal queue and update directly
      if (forceUpdate === 'true' && orderId) {
        console.log(`Force update requested for orderId ${orderId}`);
        try {
          const visaRequestForm = await (
            await import('../../models/visa.js')
          ).default;

          // Directly update the database
          const updatedRecord = await visaRequestForm.findByIdAndUpdate(
            orderId,
            {
              visaStatus: 'pending',
              price: session.amount_total / 100,
              paid: true,
              paymentMethod: 'stripe',
              paymentId: session.id,
              paymentStatus: session.payment_status,
              paymentAmount: session.amount_total / 100,
              paymentDate: new Date(),
            },
            { new: true }
          );

          if (updatedRecord) {
            console.log(`Force updated record ${orderId} successfully`);
            return res.status(200).json({
              status: 'success',
              message: 'Payment force-updated successfully',
              data: {
                paid: true,
                applicationId: orderId,
              },
            });
          }
        } catch (dbError) {
          console.error('Force update database error:', dbError);
          return res.status(500).json({
            status: 'error',
            message: 'Database update failed',
            error:
              process.env.NODE_ENV === 'development'
                ? dbError.message
                : undefined,
          });
        }
      }

      // Use the same handler as the webhook
      const result = await handleCompletedCheckout(session);

      return res.status(200).json({
        status: 'success',
        message: result
          ? 'Payment verified successfully'
          : 'Payment processing initiated',
        data: {
          paid: true,
          applicationId:
            session.client_reference_id || session.metadata?.orderId,
        },
      });
    } else {
      return res.status(200).json({
        status: 'error',
        message: 'Payment not complete',
        data: {
          paid: false,
          paymentStatus: session.payment_status,
        },
      });
    }
  } catch (error) {
    console.error('Manual payment verification error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to verify payment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

export default indiaVisaPaymentRouter;
