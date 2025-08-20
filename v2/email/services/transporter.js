/**
 * Email Transporter Service
 * Handles Nodemailer transporter creation for both Ethereal and Production SMTP
 */

import nodemailer from 'nodemailer';
import { emailConfig } from '../config/emailConfig.js';

/**
 * Creates and returns a nodemailer transporter
 * Uses Ethereal for testing/development, production SMTP for live environment
 * @returns {Promise<object>} Configured nodemailer transporter
 */
export async function createEmailTransporter() {
  try {
    // Use Ethereal for testing/development
    if (emailConfig.environment.useEthereal) {
      console.log('📧 Creating Ethereal Email transporter for testing...');

      // Use fixed Ethereal credentials
      const etherealCredentials = {
        user: 'anna.yost80@ethereal.email',
        pass: 'h8br5jQFGMAaH1VHPv',
      };

      console.log('✅ Using Ethereal credentials:', {
        user: etherealCredentials.user,
        web: 'https://ethereal.email',
      });

      return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: etherealCredentials.user,
          pass: etherealCredentials.pass,
        },
      });
    }

    // Production SMTP configuration
    console.log('📧 Creating production SMTP transporter...');
    return nodemailer.createTransport(emailConfig.smtp.production);
  } catch (error) {
    console.error('❌ Failed to create email transporter:', error);

    // Fallback to production SMTP if Ethereal fails
    if (emailConfig.environment.useEthereal) {
      console.log('🔄 Falling back to production SMTP...');
      return nodemailer.createTransport(emailConfig.smtp.production);
    }

    throw error;
  }
}

/**
 * Sends an email using the configured transporter
 * @param {object} emailData - Email data object
 * @param {string} emailData.to - Recipient email address
 * @param {string} emailData.subject - Email subject
 * @param {string} emailData.html - HTML email content
 * @param {string} [emailData.text] - Plain text email content
 * @returns {Promise<object>} Email sending result
 */
export async function sendEmail(emailData) {
  try {
    const transporter = await createEmailTransporter();

    const mailOptions = {
      from: emailConfig.templates.defaultFrom,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text || undefined,
    };

    console.log(`📤 Sending email to: ${emailData.to}`);
    console.log(`📧 Subject: ${emailData.subject}`);

    const info = await transporter.sendMail(mailOptions);

    // Generate preview URL for Ethereal emails
    const previewURL = emailConfig.environment.useEthereal
      ? nodemailer.getTestMessageUrl(info)
      : null;

    if (previewURL) {
      console.log('🔗 Ethereal Email Preview URL:', previewURL);
    }

    console.log('✅ Email sent successfully:', info.messageId);

    return {
      success: true,
      messageId: info.messageId,
      previewURL,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    throw error;
  }
}

export default { createEmailTransporter, sendEmail };
