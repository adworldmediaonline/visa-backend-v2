import nodemailer from 'nodemailer';
import { sendEmailBasedOnDomain } from '../utils/sendEmailBasedOnDomain.js';

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

// Create a safer transporter with fallback options
const createTransporter = async domainUrl => {
  try {
    const { HOSTINGER_EMAIL, HOSTINGER_PASSWORD } =
      sendEmailBasedOnDomain(domainUrl);

    if (!HOSTINGER_EMAIL || !HOSTINGER_PASSWORD) {
      throw new Error('Email credentials not found for domain: ' + domainUrl);
    }

    // Test if config is valid by connecting
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: HOSTINGER_EMAIL,
        pass: HOSTINGER_PASSWORD,
      },
      tls: { ciphers: 'TLSv1.2' },
      requireTLS: true,
      debug: true,
      connectionTimeout: 10000,
    });

    // Verify connection configuration
    await transporter.verify();
    console.log('SMTP connection verified successfully for domain:', domainUrl);

    return transporter;
  } catch (error) {
    console.error('Error creating email transporter:', error);

    // Fallback to environment variables if domain-specific credentials fail
    if (process.env.FALLBACK_EMAIL && process.env.FALLBACK_PASSWORD) {
      console.log('Using fallback email credentials');

      const fallbackTransporter = nodemailer.createTransport({
        host: process.env.FALLBACK_SMTP_HOST || process.env.SMTP_HOST,
        port: process.env.FALLBACK_SMTP_PORT || process.env.SMTP_PORT,
        secure: process.env.FALLBACK_SMTP_SECURE === 'true',
        auth: {
          user: process.env.FALLBACK_EMAIL,
          pass: process.env.FALLBACK_PASSWORD,
        },
        tls: {
          ciphers: 'TLSv1.2',
          rejectUnauthorized: false,
        },
        requireTLS: true,
        connectionTimeout: 10000,
      });

      try {
        // Verify fallback connection
        await fallbackTransporter.verify();
        console.log('Fallback SMTP connection verified successfully');
        return fallbackTransporter;
      } catch (fallbackError) {
        console.error(
          'Fallback email configuration also failed:',
          fallbackError
        );
        throw fallbackError;
      }
    }

    throw error;
  }
};

export const sendAdminAlert = async (subject, message, domainUrl) => {
  try {
    const transporter = await createTransporter(domainUrl);
    const adminEmails = process.env.ADMIN_EMAILS || process.env.FALLBACK_EMAIL;

    if (!adminEmails) {
      console.error('No admin email addresses configured');
      return false;
    }

    const mailOptions = {
      from: transporter.options.auth.user,
      to: adminEmails,
      subject: `ALERT: ${subject}`,
      html: `
        <h2>System Alert</h2>
        <p><strong>Type:</strong> ${subject}</p>
        <p><strong>Time:</strong> ${new Date().toISOString()}</p>
        <p><strong>Details:</strong></p>
        <pre>${JSON.stringify(message, null, 2)}</pre>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Alert email sending error:', error);

    // Last resort: log to console if we can't email
    console.error('CRITICAL ALERT (email failed):', subject, message);
    return false;
  }
};

export const sendIndiaVisaPaymentConfirmationEmail = async (
  email,
  id,
  domainUrl
) => {
  return retryOperation(async () => {
    const transporter = await createTransporter(domainUrl);

    const mailOptions = {
      from: transporter.options.auth.user,
      to: email,
      subject: 'India eVisa Payment Confirmation',
      html: `<p>Dear Applicant,</p>
             <p>Thank you for your payment. Your India eVisa application has been received and is now being processed.</p>
             <p>Your Application ID: <strong>${id}</strong></p>
             <p>Please keep this ID for future reference. You will be notified via email about the status of your application.</p>
             <p>Best regards,<br>India eVisa Team</p>`,
    };

    await transporter.sendMail(mailOptions);
    return true;
  }).catch(error => {
    console.error('Email sending error after multiple retries:', error);
    // Send alert to admin about persistent email failure
    try {
      sendAdminAlert(
        'Email Sending Failure',
        {
          error: error.message,
          email,
          applicationId: id,
          domainUrl,
        },
        domainUrl
      );
    } catch (alertError) {
      console.error('Failed to send alert about email failure:', alertError);
    }
    return false;
  });
};
