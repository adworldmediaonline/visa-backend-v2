import Stripe from 'stripe';
import VisaRequestForm from '../../models/visa.js';
import { indianVisaPaymentFinalPrice } from '../../utils/indianVisaPaymentFinalPrice.js';
import {
  sendIndiaVisaPaymentConfirmationEmail,
  sendAdminAlert,
} from '../../mailConfig/mail.config.js';
import { sendEmailBasedOnDomain } from '../../utils/sendEmailBasedOnDomain.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_LIVE);

// Queue for failed payment processing tasks
const paymentProcessingQueue = [];

// Process the payment queue more frequently
const QUEUE_PROCESSING_INTERVAL = 60 * 1000; // 1 minute instead of 15 minutes

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

// Function to process a queue item
const processQueueItem = async task => {
  try {
    console.log(`Processing queued task: ${task.type}`);

    if (task.type === 'completedCheckout') {
      await handleCompletedCheckout(task.data, true);
    } else if (task.type === 'failedPayment') {
      await handleFailedPayment(task.data, true);
    }
    console.log(`Successfully processed queued task: ${task.type}`);
    return true;
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
          task.data.metadata?.domainUrl
        );
      } catch (alertError) {
        console.error('Failed to send alert for failed task:', alertError);
      }
      return false;
    } else {
      // Re-queue with incremented retry count
      paymentProcessingQueue.push({
        ...task,
        retries: (task.retries || 0) + 1,
      });
      return false;
    }
  }
};

// Process an item immediately without waiting for the queue interval
const processImmediately = async task => {
  console.log(`Processing ${task.type} immediately without queueing`);
  const success = await processQueueItem(task);

  if (!success) {
    console.log(`Immediate processing failed, item has been queued for retry`);
  }

  return success;
};

// Initialize queue processing
setInterval(async () => {
  if (paymentProcessingQueue.length > 0) {
    console.log(
      `Processing ${paymentProcessingQueue.length} queued payment tasks`
    );

    // Take the first item from the queue
    const task = paymentProcessingQueue.shift();
    await processQueueItem(task);
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
    //ss

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
        process.env.STRIPE_WEBHOOK_SECRET_LIVE ? 'Present' : 'Missing'
      );

      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET_LIVE
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

    // Determine if this event requires database access
    const requiresDatabase = [
      'checkout.session.completed',
      'payment_intent.payment_failed',
    ].includes(event.type);

    // For events that don't require DB access, process them separately
    if (!requiresDatabase) {
      handleNonDatabaseEvent(event);
      return;
    }

    // Process the event asynchronously without blocking response
    // Use a try/catch inside to prevent crashes
    process.nextTick(async () => {
      try {
        console.log(`Processing webhook event ${event.type} asynchronously`);

        switch (event.type) {
          case 'checkout.session.completed':
            console.log(
              'Handling checkout.session.completed',
              event.data.object.id
            );
            // Process checkout.session.completed immediately without queueing
            const success = await processImmediately({
              type: 'completedCheckout',
              data: event.data.object,
              retries: 0,
            });

            if (!success) {
              console.log(
                'Payment processing failed - already queued for retry'
              );
            }
            break;
          case 'payment_intent.payment_failed':
            console.log(
              'Handling payment_intent.payment_failed',
              event.data.object.id
            );
            await handleFailedPayment(event.data.object);
            break;
          default:
            console.log(
              `Unhandled event type ${event.type} - ID: ${
                event.id || 'unknown'
              }`
            );
        }
      } catch (error) {
        console.error(`Error processing webhook event ${event.type}:`, error);

        // Check if it's a MongoDB connection error
        if (
          error.name === 'MongooseServerSelectionError' ||
          error.message.includes('Could not connect')
        ) {
          console.log(
            'MongoDB connection error detected during webhook processing'
          );

          // For specific event types that require database operations, queue them
          if (event.type === 'checkout.session.completed') {
            console.log(
              'Adding completed checkout to retry queue due to MongoDB connection issue'
            );
            paymentProcessingQueue.push({
              type: 'completedCheckout',
              data: event.data.object,
              retries: 0,
            });
          } else if (event.type === 'payment_intent.payment_failed') {
            console.log(
              'Adding failed payment to retry queue due to MongoDB connection issue'
            );
            paymentProcessingQueue.push({
              type: 'failedPayment',
              data: event.data.object,
              retries: 0,
            });
          }

          // Don't crash the server for MongoDB connection issues
          console.log(
            'Continuing webhook processing despite MongoDB connection error'
          );
        } else {
          // For other errors, still add to retry queue for checkout events
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

        // Even if processing fails, don't crash the server
        console.log(
          'Webhook processing will continue asynchronously through the retry queue'
        );
      }
    });

    return;
  } catch (error) {
    console.error('Webhook processing error:', error);

    // This should only happen for errors outside the event processing
    // We still want to respond to Stripe
    if (!res.headersSent) {
      return res.status(500).json({
        status: 'error',
        message: 'Webhook processing failed',
        error:
          process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
};

// Handle events that don't require database access
const handleNonDatabaseEvent = event => {
  try {
    const eventData = event.data.object;

    switch (event.type) {
      case 'payment_intent.created':
        console.log(
          'Payment intent created:',
          eventData.id,
          'Amount:',
          eventData.amount / 100,
          'Currency:',
          eventData.currency,
          'Metadata:',
          JSON.stringify(eventData.metadata || {})
        );
        break;
      case 'payment_intent.succeeded':
        console.log(
          'Payment intent succeeded:',
          eventData.id,
          'Amount:',
          eventData.amount / 100,
          'Currency:',
          eventData.currency,
          'Status:',
          eventData.status
        );
        break;
      case 'charge.succeeded':
        console.log(
          'Charge succeeded:',
          eventData.id,
          'Amount:',
          eventData.amount / 100,
          'Currency:',
          eventData.currency,
          'Status:',
          eventData.status
        );
        break;
      case 'checkout.session.async_payment_succeeded':
        console.log(
          'Async payment succeeded for session:',
          eventData.id,
          'Payment intent:',
          eventData.payment_intent
        );
        break;
      case 'checkout.session.async_payment_failed':
        console.log(
          'Async payment failed for session:',
          eventData.id,
          'Payment intent:',
          eventData.payment_intent
        );
        break;
      default:
        console.log(
          `Received non-database event type ${event.type} - ID: ${
            event.id || 'unknown'
          }`
        );
    }
  } catch (error) {
    // Never crash the server for non-critical event handling
    console.error('Error handling non-database event:', error);
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
    const domainUrl = session.metadata?.domainUrl;
    const price = session.amount_total / 100;

    console.log(`Using orderId: ${orderId}, domainUrl: ${domainUrl}`);

    try {
      // Check if payment has already been processed to prevent duplicates
      const existingRecord = await VisaRequestForm.findById(
        indianVisaBookingId
      );
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

      // Send payment confirmation email
      try {
        const { HOSTINGER_EMAIL } = sendEmailBasedOnDomain(domainUrl);
        await sendIndiaVisaPaymentConfirmationEmail(
          user,
          session,
          domainUrl,
          HOSTINGER_EMAIL
        );
        console.log('Payment confirmation email sent successfully');
      } catch (emailError) {
        console.error('Failed to send payment confirmation email:', emailError);
        // Don't throw an error here, continue processing
      }

      // Log successful processing
      console.log(
        `Successfully processed payment for application ID: ${indianVisaBookingId}`
      );
    } catch (dbError) {
      // Special handling for MongoDB connection errors
      console.error('Database operation failed:', dbError);

      // Check if it's a MongoDB connection error
      if (
        dbError.name === 'MongooseServerSelectionError' ||
        dbError.message.includes('Could not connect')
      ) {
        console.log('MongoDB connection error detected - queueing for retry');

        // Always queue for retry on connection errors
        if (!isRetry || isRetry) {
          paymentProcessingQueue.push({
            type: 'completedCheckout',
            data: session,
            retries: isRetry ? 3 : 0, // Set higher retry count to trigger admin alert sooner
          });
        }

        // Send special alert for Webhook+DB connection issues
        try {
          const alertDomainUrl = session.metadata?.domainUrl;
          await sendAdminAlert(
            'URGENT: Webhook DB Connection Issue',
            {
              sessionId: session.id,
              clientReferenceId: session.client_reference_id,
              orderId: orderId,
              error: `MongoDB connection failed: ${dbError.message}`,
              action:
                'Payment was received but database update failed. Manual verification needed.',
            },
            alertDomainUrl
          );
        } catch (emailError) {
          console.error('Failed to send admin alert email:', emailError);
        }

        // Don't throw - allow function to complete
        return false;
      }

      // Re-throw other DB errors
      throw dbError;
    }

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
        const alertDomainUrl = session.metadata?.domainUrl;
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
        await sendAdminAlert('Failed Payment Processing Error', {
          paymentIntentId: paymentIntent.id,
          orderId: paymentIntent.metadata?.orderId,
          error: error.message,
          paymentData: {
            id: paymentIntent.id,
            status: paymentIntent.status,
            error: paymentIntent.last_payment_error,
          },
        });
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
