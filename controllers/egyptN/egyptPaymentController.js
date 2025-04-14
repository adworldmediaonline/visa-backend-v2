import EgyptVisaApplicationN from '../../models/egyptN/egyptVisaApplicationModel.js';
import { StatusCodes } from 'http-status-codes';
import expressAsyncHandler from 'express-async-handler';
import { sendEmail } from '../../utils/mailConfigs.js';
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from '../../utils/razorpay.js';
import { Stripe } from 'stripe';

const egyptPaymentController = {
  // Create a payment order
  createPaymentOrder: expressAsyncHandler(async (req, res) => {
    try {
      const { formId } = req.body;

      // Find the application
      const application = await EgyptVisaApplicationN.findById(
        formId
      ).populate('visaDetails');

      if (!application) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Application not found',
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      // Get visa fee from visa details
      if (!application.visaDetails || !application.visaDetails.visaFee) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Visa details not found or visa fee not set',
          statusCode: StatusCodes.BAD_REQUEST,
        });
      }

      const amount = application.visaDetails.visaFee * application.noOfVisa;

      // Create Razorpay order
      const order = await createRazorpayOrder(amount, formId, {
        formId,
        email: application.emailAddress,
        visaType: application.visaDetails.visaType,
      });

      return res.status(StatusCodes.OK).json({
        success: true,
        data: {
          orderId: order.id,
          amount: order.amount / 100, // Convert back to dollars
          currency: order.currency,
          receipt: order.receipt,
          key: process.env.RAZORPAY_KEY_ID,
        }
      });
    } catch (error) {
      console.error('Error creating payment order:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error creating payment order',
        error: error.message,
      });
    }
  }),

  // Verify payment and update application status
  verifyPayment: expressAsyncHandler(async (req, res) => {
    try {
      const { orderId, paymentId, signature, formId } = req.body;

      // Verify the payment signature
      const isValid = verifyRazorpayPayment(orderId, paymentId, signature);

      if (!isValid) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Invalid payment signature',
          statusCode: StatusCodes.BAD_REQUEST,
        });
      }

      // Update application payment status
      const updatedApplication =
        await EgyptVisaApplicationN.findByIdAndUpdate(
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
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Application not found',
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      // Send confirmation email
      await sendConfirmationEmail(
        updatedApplication.emailAddress,
        updatedApplication._id,
        req.headers.origin
      );

      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Payment verified successfully',
        data: updatedApplication,
      });
    } catch (error) {
      console.error('Error verifying payment:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error verifying payment',
        error: error.message,
      });
    }
  }),

  // Stripe Payment
  createStripeSession: expressAsyncHandler(async (req, res) => {
    try {
      const { formId } = req.body;
      // Find the application
      const application = await EgyptVisaApplicationN.findById(formId)
        .populate('personalInfo')
        .populate('visaDetails');
      if (!application) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Application not found',
          statusCode: StatusCodes.NOT_FOUND,
        });
      }
      // Get visa fee from visa details
      if (!application.visaDetails || !application.visaDetails.visaFee) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Visa details not found or visa fee not set',
          statusCode: StatusCodes.BAD_REQUEST,
        });
      }

      const YOUR_DOMAIN = req.headers.origin || 'https://visacollect.com/payment';

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

      return res.status(StatusCodes.OK).json({
        success: true,
        data: {
          sessionId: session.id,
          session_url: session.url,
          key: process.env.STRIPE_PUBLIC_KEY,
        }
      });
    } catch (error) {
      console.error('Error creating Stripe session:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error creating Stripe session',
        error: error.message || 'Internal Server Error',
      });
    }
  }),

  // Verify payment and update application status
  verifyStripePayment: expressAsyncHandler(async (req, res) => {
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
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Invalid payment',
          statusCode: StatusCodes.BAD_REQUEST,
        });
      }

      // Get applicationId from session metadata
      const applicationId = session.metadata.applicationId;
      if (!applicationId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Application ID not found in payment data',
          statusCode: StatusCodes.BAD_REQUEST,
        });
      }

      // Find the application
      const application = await EgyptVisaApplicationN.findById(applicationId);
      if (!application) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Application not found',
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      // Update application status
      const updatedApplication =
        await EgyptVisaApplicationN.findByIdAndUpdate(
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
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Application not found',
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      // Send confirmation email
      sendConfirmationEmail(
        application.emailAddress,
        application._id,
        req.headers.origin
      );

      return res.status(StatusCodes.OK).json({
        success: true,
        applicationId: updatedApplication._id,
        message: 'Payment verified and application status updated',
      });
    } catch (error) {
      console.error('Error verifying payment:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error verifying payment',
        error: error.message || 'Internal Server Error',
      });
    }
  }),
};

// Helper function to send confirmation email
const sendConfirmationEmail = async (email, id, domainUrl) => {
  try {
    const mailOptions = {
      to: email,
      subject: 'Egypt eVisa Payment Confirmation',
      html: `<p>Dear Applicant,</p>
             <p>Thank you for your payment. Your Egypt eVisa application has been received and is now being processed.</p>
             <p>Your Application ID: <strong>${id}</strong></p>
             <p>Please keep this ID for future reference. You will be notified via email about the status of your application.</p>
             <p>Best regards,<br>Egypt eVisa Team</p>`,
    };

    const info = await sendEmail(mailOptions);
    console.log('Confirmation email sent:', info.response);
    return true;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return true;
  }
};

export default egyptPaymentController;
