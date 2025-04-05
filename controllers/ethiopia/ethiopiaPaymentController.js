import EthiopiaVisaApplication from '../../models/ethiopia/ethiopiaVisaApplicationModel.js';
import EthiopiaVisaDetails from '../../models/ethiopia/ethiopiaVisaDetailsModel.js';
import { sendEmail } from '../../utils/mailConfigs.js';
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from '../../utils/razorpay.js';
import { sendEmailBasedOnDomain } from '../../utils/sendEmailBasedOnDomain.js';
import nodemailer from 'nodemailer';
import { Stripe } from 'stripe';

const ethiopiaPaymentController = {
  // Create a payment order
  createPaymentOrder: async (req, res) => {
    try {
      const { formId } = req.body;

      // Find the application
      const application = await EthiopiaVisaApplication.findById(
        formId
      ).populate('visaDetails');

      if (!application) {
        return res.status(404).json({
          error: 'Application not found',
          statusCode: 404,
        });
      }

      // Get visa fee from visa details
      if (!application.visaDetails || !application.visaDetails.visaFee) {
        return res.status(400).json({
          error: 'Visa details not found or visa fee not set',
          statusCode: 400,
        });
      }

      const amount = application.visaDetails.visaFee * application.noOfVisa;

      // Create Razorpay order
      const order = await createRazorpayOrder(amount, formId, {
        formId,
        email: application.emailAddress,
        visaType: application.visaDetails.visaType,
      });

      return res.status(200).json({
        orderId: order.id,
        amount: order.amount / 100, // Convert back to dollars
        currency: order.currency,
        receipt: order.receipt,
        key: process.env.RAZORPAY_KEY_ID,
      });
    } catch (error) {
      console.error('Error creating payment order:', error);
      return res.status(500).json({
        error: error.message,
        statusCode: 500,
      });
    }
  },

  // Verify payment and update application status
  verifyPayment: async (req, res) => {
    try {
      const { orderId, paymentId, signature, formId } = req.body;

      // Verify the payment signature
      const isValid = verifyRazorpayPayment(orderId, paymentId, signature);

      if (!isValid) {
        return res.status(400).json({
          error: 'Invalid payment signature',
          statusCode: 400,
        });
      }

      // Update application payment status
      const updatedApplication =
        await EthiopiaVisaApplication.findByIdAndUpdate(
          formId,
          {
            applicationStatus: 'submitted',
            lastExitUrl: 'attachments',
            paymentStatus: 'paid',
            paymentMethod: 'razorpay',
            paymentId: paymentId,
            paymentDate: new Date(),
          },
          { new: true }
        );

      if (!updatedApplication) {
        return res.status(404).json({
          error: 'Application not found',
          statusCode: 404,
        });
      }

      // Send confirmation email
      await sendConfirmationEmail(
        updatedApplication.emailAddress,
        updatedApplication._id,
        req.headers.origin
      );

      return res.status(200).json({
        message: 'Payment verified successfully',
        application: updatedApplication,
      });
    } catch (error) {
      console.error('Error verifying payment:', error);
      return res.status(500).json({
        error: error.message,
        statusCode: 500,
      });
    }
  },

  // Stripe Payment
  createStripeSession: async (req, res) => {
    try {
      const { formId } = req.body;
      // Find the application
      const application = await EthiopiaVisaApplication.findById(formId)
        .populate('personalInfo')
        .populate('visaDetails');
      if (!application) {
        return res.status(404).json({
          error: 'Application not found',
          statusCode: 404,
        });
      }
      // Get visa fee from visa details
      if (!application.visaDetails || !application.visaDetails.visaFee) {
        return res.status(400).json({
          error: 'Visa details not found or visa fee not set',
          statusCode: 400,
        });
      }

      const YOUR_DOMAIN = req.headers.origin || 'http://localhost:3000/payment';

      const name =
        application.personalInfo.givenName +
          ' ' +
          application.personalInfo.surname || '';
      const email = application.emailAddress || '';

      const amount =
        application.visaDetails.visaFee * application.noOfVisa * 100;

      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_LIVE);

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        customer_email: email,
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: name,
                description: `${application.visaDetails.visaType} Visa Application`,
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        metadata: {
          applicationId: formId,
        },
        mode: 'payment',
        success_url: `${YOUR_DOMAIN}/payment?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${YOUR_DOMAIN}/payment?canceled=true`,
      });

      console.log('Stripe Session:', session);

      return res.status(200).json({
        sessionId: session.id,
        session_url: session.url,
        key: process.env.STRIPE_PUBLIC_KEY,
      });
    } catch (error) {
      console.error('Error creating Stripe session:', error);
      return res.status(500).json({
        error: error.message || 'Internal Server Error',
        statusCode: 500,
      });
    }
  },

  // Verify payment and update application status
  verifyStripePayment: async (req, res) => {
    try {
      const { sessionId } = req.body;
      // Verify the payment
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_LIVE);
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (
        !session ||
        !session.payment_status ||
        session.payment_status !== 'paid'
      ) {
        return res.status(400).json({
          success: false,
          error: 'Invalid payment',
          statusCode: 400,
        });
      }

      // Get applicationId from session metadata
      const applicationId = session.metadata.applicationId;
      if (!applicationId) {
        return res.status(400).json({
          success: false,
          error: 'Application ID not found in payment data',
          statusCode: 400,
        });
      }

      // Find the application
      const application = await EthiopiaVisaApplication.findById(applicationId);
      if (!application) {
        return res.status(404).json({
          success: false,
          error: 'Application not found',
          statusCode: 404,
        });
      }

      // Update application status
      const updatedApplication =
        await EthiopiaVisaApplication.findByIdAndUpdate(
          application._id,
          {
            applicationStatus: 'submitted',
            paymentMethod: 'stripe',
            lastExitUrl: 'attachments',
            paymentId: session.id,
            paymentStatus: session.payment_status,
            paymentAmount: session.amount_total / 100,
            paymentDate: new Date(),
          },
          { new: true }
        );

      if (!updatedApplication) {
        return res.status(404).json({
          success: false,
          error: 'Application not found',
          statusCode: 404,
        });
      }

      // Send confirmation email
      sendConfirmationEmail(
        application.personalInfo.email,
        application._id,
        req.headers.origin
      );

      return res.status(200).json({
        success: true,
        applicationId: updatedApplication._id,
        message: 'Payment verified and application status updated',
        statusCode: 200,
      });
    } catch (error) {
      console.error('Error verifying payment:', error);
      return res.status(500).json({
        error: error.message || 'Internal Server Error',
        statusCode: 500,
      });
    }
  },
};

// Helper function to send confirmation email
const sendConfirmationEmail = async (email, id, domainUrl) => {
  try {
    const mailOptions = {
      to: email,
      subject: 'Ethiopia eVisa Payment Confirmation',
      html: `<p>Dear Applicant,</p>
             <p>Thank you for your payment. Your Ethiopia eVisa application has been received and is now being processed.</p>
             <p>Your Application ID: <strong>${id}</strong></p>
             <p>Please keep this ID for future reference. You will be notified via email about the status of your application.</p>
             <p>Best regards,<br>Ethiopia eVisa Team</p>`,
    };

    const info = await sendEmail(mailOptions);
    console.log('Confirmation email sent:', info.response);
    return true;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return true;
  }
};

export default ethiopiaPaymentController;
