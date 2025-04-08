import Stripe from 'stripe';
import VisaRequestForm from '../../models/visa.js';
import { indianVisaPaymentFinalPrice } from '../../utils/indianVisaPaymentFinalPrice.js';
import {
  sendIndiaVisaPaymentConfirmationEmail,
  sendAdminAlert,
} from '../../mailConfig/mail.config.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_TEST);

// Queue for failed payment processing tasks
const paymentProcessingQueue = [];

// Process the payment queue periodically
const QUEUE_PROCESSING_INTERVAL = 15 * 60 * 1000; // 15 minutes

// Retry helper with exponential backoff
const retryOperation = async (
  operation,
  maxRetries = 3,
  initialDelay = 1000
) => {
  let lastError;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      const delay = initialDelay * Math.pow(2, attempt);
      console.log(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};

// Initialize queue processing
setInterval(async () => {
  if (paymentProcessingQueue.length > 0) {
    console.log(
      `Processing ${paymentProcessingQueue.length} queued payment tasks`
    );

    // Take the first item from the queue
    const task = paymentProcessingQueue.shift();

    try {
      if (task.type === 'completedCheckout') {
        await handleCompletedCheckout(task.data, true);
      } else if (task.type === 'failedPayment') {
        await handleFailedPayment(task.data, true);
      }
      console.log(`Successfully processed queued task: ${task.type}`);
    } catch (error) {
      console.error(`Failed to process queued task: ${task.type}`, error);

      // If it's the final retry, send an alert
      if (task.retries >= 3) {
        try {
          await sendAdminAlert(
            'Critical Payment Processing Failure',
            {
              taskType: task.type,
              data: task.data,
              error: error.message,
              retryCount: task.retries,
            },
            task.data.metadata?.domainUrl || process.env.DEFAULT_DOMAIN_URL
          );
        } catch (alertError) {
          console.error('Failed to send alert for failed task:', alertError);
        }
      } else {
        // Re-queue with incremented retry count
        paymentProcessingQueue.push({
          ...task,
          retries: (task.retries || 0) + 1,
        });
      }
    }
  }
}, QUEUE_PROCESSING_INTERVAL);

// Truncate metadata strings to meet Stripe's 500 character limit
const truncateForMetadata = str => {
  if (!str) return '';
  const maxLength = 450; // Using 450 to be safe
  return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
};

const createIndiaVisaCheckoutSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { termsAndConditions, termsAndConditionsContent, domainUrl } =
      req.body;

    if (
      !id ||
      !domainUrl ||
      !termsAndConditions ||
      !termsAndConditionsContent
    ) {
      return res.status(400).json({
        status: 'error',
        message:
          'Missing required fields: domain URL, ID, or terms and conditions',
      });
    }

    const indiaVisaModel = await VisaRequestForm.findById(id).populate('step2');

    if (!indiaVisaModel) {
      return res.status(404).json({
        status: 'error',
        message: 'Visa application not found',
      });
    }

    // Save the full terms and conditions to the model first
    // This ensures we don't lose the data even if we truncate for Stripe
    await VisaRequestForm.findByIdAndUpdate(id, {
      termsAndConditions,
      termsAndConditionsContent,
    });

    const finalVisaPrice = indianVisaPaymentFinalPrice(
      35,
      indiaVisaModel.nationalityRegion,
      indiaVisaModel.visaService,
      indiaVisaModel.eTouristVisa
    );

    const sessionParams = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'India E-Visa',
              description: `Visa application for ${
                indiaVisaModel?.step2?.firstName || ''
              } ${indiaVisaModel?.step2?.lastName || ''}`,
            },
            unit_amount: finalVisaPrice * 100,
          },
          quantity: 1,
        },
      ],
      client_reference_id: id,
      customer_email: indiaVisaModel.emailId,
      mode: 'payment',
      success_url: `${domainUrl}/thankyou/?success=true&orderId=${id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domainUrl}/cancel/?cancel=true&orderId=${id}`,
      metadata: {
        orderId: id,
        domainUrl,
        termsAndConditions: truncateForMetadata(termsAndConditions),
        // Don't include the full content in metadata - it exceeds Stripe's limits
        termsAccepted: 'true', // Just store that terms were accepted
      },
      payment_intent_data: {
        capture_method: 'automatic',
        metadata: {
          orderId: id,
        },
      },
    };

    const session = await retryOperation(async () => {
      return await stripe.checkout.sessions.create(sessionParams);
    });

    return res.status(200).json({
      status: 'success',
      session,
    });
  } catch (error) {
    console.error('Checkout session error:', error);

    // Send alert for critical checkout errors
    if (req.body?.domainUrl) {
      try {
        await sendAdminAlert(
          'Checkout Session Creation Failure',
          {
            id: req.params.id,
            error: error.message,
            stack: error.stack,
          },
          req.body.domainUrl
        );
      } catch (emailError) {
        console.error('Failed to send admin alert email:', emailError);
      }
    }

    return res.status(500).json({
      status: 'error',
      message: 'Failed to create checkout session',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

const webhookCheckout = async (req, res) => {
  let event;

  try {
    // Log the request for debugging
    console.log('Webhook request received:', {
      path: req.path,
      method: req.method,
      headers: {
        'stripe-signature': req.headers['stripe-signature']
          ? 'Present'
          : 'Missing',
        'content-type': req.headers['content-type'],
      },
      bodyType: typeof req.body,
      bodyIsBuffer: Buffer.isBuffer(req.body),
      bodyLength: req.body?.length || 0,
    });

    const signature = req.headers['stripe-signature'];

    if (!signature) {
      console.error('Webhook error: Stripe signature missing');
      return res.status(400).json({
        status: 'error',
        message: 'Stripe signature missing',
      });
    }

    try {
      // Verify the event - ensure req.body is a Buffer for proper signature verification
      const rawBody = req.body;

      if (!Buffer.isBuffer(rawBody)) {
        console.error('Webhook error: Request body is not a Buffer');
        return res.status(400).json({
          status: 'error',
          message: 'Request body must be raw for signature verification',
        });
      }

      console.log(
        'Using webhook secret:',
        process.env.STRIPE_WEBHOOK_SECRET_TEST ? 'Present' : 'Missing'
      );

      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET_TEST
      );
      console.log('Webhook event verified:', event.type);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).json({
        status: 'error',
        message: `Webhook signature verification failed: ${err.message}`,
      });
    }

    // We need to respond quickly to the webhook to prevent timeout
    // Send immediate response but process the event asynchronously
    console.log('Sending 200 response to Stripe webhook');
    res.status(200).json({ received: true });

    // Process the event asynchronously
    setTimeout(async () => {
      try {
        console.log(`Processing webhook event ${event.type} asynchronously`);

        switch (event.type) {
          case 'checkout.session.completed':
            console.log(
              'Handling checkout.session.completed',
              event.data.object.id
            );
            await handleCompletedCheckout(event.data.object);
            break;
          case 'payment_intent.payment_failed':
            console.log(
              'Handling payment_intent.payment_failed',
              event.data.object.id
            );
            await handleFailedPayment(event.data.object);
            break;
          default:
            console.log(`Unhandled event type ${event.type}`);
        }
      } catch (error) {
        console.error(`Error processing webhook event ${event.type}:`, error);

        // Add to retry queue
        if (event.type === 'checkout.session.completed') {
          console.log('Adding completed checkout to retry queue');
          paymentProcessingQueue.push({
            type: 'completedCheckout',
            data: event.data.object,
            retries: 0,
          });
        } else if (event.type === 'payment_intent.payment_failed') {
          console.log('Adding failed payment to retry queue');
          paymentProcessingQueue.push({
            type: 'failedPayment',
            data: event.data.object,
            retries: 0,
          });
        }
      }
    }, 0);

    return;
  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Webhook processing failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

const handleCompletedCheckout = async (session, isRetry = false) => {
  try {
    // Log full session details for debugging
    console.log('Processing completed checkout session:', {
      id: session.id,
      client_reference_id: session.client_reference_id,
      payment_status: session.payment_status,
      metadata: session.metadata,
    });

    const indianVisaBookingId = session.client_reference_id;

    if (!indianVisaBookingId) {
      throw new Error('Session does not have a client_reference_id');
    }

    // Use either metadata.orderId or client_reference_id
    const orderId = session.metadata?.orderId || indianVisaBookingId;
    const domainUrl =
      session.metadata?.domainUrl || process.env.DEFAULT_DOMAIN_URL;
    const price = session.amount_total / 100;

    console.log(`Using orderId: ${orderId}, domainUrl: ${domainUrl}`);

    // Check if payment has already been processed to prevent duplicates
    const existingRecord = await VisaRequestForm.findById(indianVisaBookingId);
    console.log('Found existing record:', existingRecord ? 'Yes' : 'No');

    if (
      existingRecord &&
      existingRecord.paid &&
      existingRecord.paymentId === session.id
    ) {
      console.log(`Payment ${session.id} already processed. Skipping.`);
      return;
    }

    // Find and update the visa request
    console.log(`Updating visa request with ID: ${indianVisaBookingId}`);
    const user = await VisaRequestForm.findByIdAndUpdate(
      indianVisaBookingId,
      {
        visaStatus: 'pending',
        price,
        paid: true,
        paymentMethod: 'stripe',
        paymentId: session.id,
        paymentStatus: session.payment_status,
        paymentAmount: session.amount_total / 100,
        paymentDate: new Date(),
      },
      { new: true }
    );

    if (!user) {
      const error = new Error(
        `No visa application found with ID: ${indianVisaBookingId}`
      );

      if (!isRetry) {
        // Add to retry queue if this is the first attempt
        console.log(`Adding to retry queue: ${indianVisaBookingId}`);
        paymentProcessingQueue.push({
          type: 'completedCheckout',
          data: session,
          retries: 0,
        });
      }

      throw error;
    }

    // Send confirmation email
    console.log(`Sending confirmation email to: ${user.emailId}`);
    await sendIndiaVisaPaymentConfirmationEmail(
      user.emailId,
      orderId,
      domainUrl
    );

    // Log successful processing
    console.log(
      `Successfully processed payment for application ID: ${indianVisaBookingId}`
    );

    return true;
  } catch (error) {
    console.error('Error processing completed checkout:', error);

    if (!isRetry) {
      // Queue for retry only if this is not already a retry attempt
      console.log('Adding failed checkout to retry queue');
      paymentProcessingQueue.push({
        type: 'completedCheckout',
        data: session,
        retries: 0,
      });
    } else {
      // Send alert on repeated failures
      try {
        const alertDomainUrl =
          session.metadata?.domainUrl || process.env.DEFAULT_DOMAIN_URL;
        console.log(`Sending alert email to admin via ${alertDomainUrl}`);

        await sendAdminAlert(
          'Payment Processing Failure',
          {
            sessionId: session.id,
            clientReferenceId: session.client_reference_id,
            error: error.message,
            sessionData: {
              id: session.id,
              payment_status: session.payment_status,
              client_reference_id: session.client_reference_id,
              metadata: session.metadata,
            },
          },
          alertDomainUrl
        );
      } catch (emailError) {
        console.error('Failed to send admin alert email:', emailError);
      }
    }

    return false;
  }
};

const handleFailedPayment = async (paymentIntent, isRetry = false) => {
  try {
    console.log('Processing failed payment:', {
      id: paymentIntent.id,
      status: paymentIntent.status,
      metadata: paymentIntent.metadata,
    });

    // Get the order ID from metadata
    const orderId = paymentIntent.metadata?.orderId;

    if (!orderId) {
      console.error(
        'Failed payment has no orderId in metadata:',
        paymentIntent.id
      );
      return false;
    }

    // Update visa application with failure
    console.log(`Updating visa application with failed payment: ${orderId}`);
    await VisaRequestForm.findByIdAndUpdate(orderId, {
      paymentStatus: 'failed',
      paymentFailureReason:
        paymentIntent.last_payment_error?.message || 'Unknown error',
    });

    // Notify customer about failed payment
    const application = await VisaRequestForm.findById(orderId);
    if (application && application.emailId) {
      console.log(
        `Should notify customer about failed payment: ${application.emailId}`
      );
      // Implement customer notification about failed payment
      // This could be another email function
    }

    return true;
  } catch (error) {
    console.error('Error processing failed payment:', error);

    if (!isRetry && paymentIntent.metadata?.orderId) {
      // Queue for retry
      console.log('Adding failed payment processing to retry queue');
      paymentProcessingQueue.push({
        type: 'failedPayment',
        data: paymentIntent,
        retries: 0,
      });
    } else {
      // Send alert on critical failure
      try {
        await sendAdminAlert(
          'Failed Payment Processing Error',
          {
            paymentIntentId: paymentIntent.id,
            orderId: paymentIntent.metadata?.orderId,
            error: error.message,
            paymentData: {
              id: paymentIntent.id,
              status: paymentIntent.status,
              error: paymentIntent.last_payment_error,
            },
          },
          process.env.DEFAULT_DOMAIN_URL
        );
      } catch (emailError) {
        console.error('Failed to send admin alert email:', emailError);
      }
    }

    return false;
  }
};

export {
  createIndiaVisaCheckoutSession,
  webhookCheckout,
  handleCompletedCheckout,
};
