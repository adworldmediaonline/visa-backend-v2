/**
 * Main Email Service for V2 Visa Application System
 * Handles all email functionality including application start notifications
 */

import VisaApplication from '../../models/visaApplication.model.js';
import { sendEmail } from './transporter.js';
import {
  generateApplicationStartTemplate,
  generateApplicationStartSubject,
} from '../templates/applicationStartTemplate.js';
import {
  generatePaymentConfirmationTemplate,
  generatePaymentConfirmationSubject,
} from '../templates/paymentConfirmationTemplate.js';

/**
 * Sends application start email to user
 * @param {string} applicationId - The application ID
 * @returns {Promise<object>} Email sending result
 */
export async function sendApplicationStartEmail(applicationId) {
  try {
    console.log(`📧 Preparing application start email for: ${applicationId}`);

    // Fetch application data
    const application = await getApplicationData(applicationId);

    if (!application.emailAddress) {
      throw new Error('No email address found for this application');
    }

    // Prepare template data
    const templateData = {
      applicationId: application.applicationId,
      visaName: getVisaName(application),
      passportCountry: application.passportCountry?.name || 'Unknown',
      destinationCountry: application.destinationCountry?.name || 'Unknown',
      userEmail: application.emailAddress,
    };

    // Generate email content
    const htmlContent = generateApplicationStartTemplate(templateData);
    const subject = generateApplicationStartSubject(templateData);

    // Send email
    const emailData = {
      to: application.emailAddress,
      subject: subject,
      html: htmlContent,
    };

    console.log(
      `📤 Sending application start email to: ${application.emailAddress}`
    );
    const result = await sendEmail(emailData);

    console.log(
      `✅ Application start email sent successfully for: ${applicationId}`
    );
    return {
      ...result,
      applicationId,
      emailType: 'application_start',
    };
  } catch (error) {
    console.error(
      `❌ Failed to send application start email for ${applicationId}:`,
      error
    );
    throw error;
  }
}

/**
 * Fetches application data by ID
 * @param {string} applicationId - Application ID
 * @returns {Promise<object>} Application data
 */
async function getApplicationData(applicationId) {
  try {
    // Build query - support both ObjectId and applicationId
    let query = { applicationId: applicationId };
    if (applicationId.match(/^[0-9a-fA-F]{24}$/)) {
      query = {
        $or: [{ _id: applicationId }, { applicationId: applicationId }],
      };
    }

    const application = await VisaApplication.findOne(query);

    if (!application) {
      throw new Error(`Application with ID ${applicationId} not found`);
    }

    return application;
  } catch (error) {
    console.error('Error fetching application data:', error);
    throw error;
  }
}

/**
 * Generates visa name from application data
 * @param {object} application - Application object
 * @returns {string} Formatted visa name
 */
function getVisaName(application) {
  if (application.visaOptionName) {
    return application.visaOptionName;
  }

  if (application.destinationCountry?.name) {
    return `${application.destinationCountry.name} Visa`;
  }

  return 'Visa Application';
}

/**
 * Validates email address format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid email format
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sends payment confirmation email to user
 * @param {string} applicationId - The application ID
 * @param {object} paymentData - Payment details
 * @returns {Promise<object>} Email sending result
 */
export async function sendPaymentConfirmationEmail(applicationId, paymentData) {
  try {
    console.log(
      `📧 Preparing payment confirmation email for: ${applicationId}`
    );

    // Fetch application data
    const application = await getApplicationData(applicationId);

    if (!application.emailAddress) {
      throw new Error('No email address found for this application');
    }

    // Prepare template data
    const templateData = {
      applicationId: application.applicationId,
      visaName: getVisaName(application),
      passportCountry: application.passportCountry?.name || 'Unknown',
      destinationCountry: application.destinationCountry?.name || 'Unknown',
      userEmail: application.emailAddress,
      payment: paymentData,
    };

    // Generate email content
    const htmlContent = generatePaymentConfirmationTemplate(templateData);
    const subject = generatePaymentConfirmationSubject(templateData);

    // Send email
    const emailData = {
      to: application.emailAddress,
      subject: subject,
      html: htmlContent,
    };

    console.log(
      `📤 Sending payment confirmation email to: ${application.emailAddress}`
    );
    const result = await sendEmail(emailData);

    console.log(
      `✅ Payment confirmation email sent successfully for: ${applicationId}`
    );
    return {
      ...result,
      applicationId,
      emailType: 'payment_confirmation',
    };
  } catch (error) {
    console.error(
      `❌ Failed to send payment confirmation email for ${applicationId}:`,
      error
    );
    throw error;
  }
}

/**
 * Sends save and exit email (placeholder for future implementation)
 * @param {string} applicationId - Application ID
 * @returns {Promise<object>} Email sending result
 */
export async function sendSaveAndExitEmail(applicationId) {
  console.log(
    `📧 Save and exit email functionality not yet implemented for: ${applicationId}`
  );
  return {
    success: true,
    message: 'Save and exit email functionality coming soon',
    applicationId,
    emailType: 'save_and_exit',
  };
}

export default {
  sendApplicationStartEmail,
  sendPaymentConfirmationEmail,
  sendSaveAndExitEmail,
  isValidEmail,
};
