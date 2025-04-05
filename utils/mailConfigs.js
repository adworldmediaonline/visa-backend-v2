import nodemailer from 'nodemailer';
import EthiopiaVisaApplication from '../models/ethiopia/ethiopiaVisaApplicationModel.js';

const emailConfig = {
  // Template definitions with subjects and HTML content
  templates: {
    formSubmit: {
      subject: '{$Countryname} {$visa_name} Application Submitted #{$appid}',
      template: `<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 10px auto; padding: 15px; line-height: 1.5; color: #333; background-color: #f9f9f9;'>
        <div style='text-align: center; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);'>
          <img src='{$logo_url}' alt='{$company_name} Logo' style='max-width: 120px; height: auto;'>
          <div style='text-align: center; background-color: #F5F5F5; padding: 10px; margin:10px; border-radius: 8px;'>
            <p style='color: #0b5099; margin-top: 12px; font-size:20px; font-weight: bold;'>{$Countryname} {$visa_name} Application</p>
          </div>
        </div>
        <div style='background-color: #ffffff; padding: 25px; margin-top: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);'>
          <h4 style='color: #515763; margin-top: 0;'>Dear {$firstname} {$lastname},</h4>
          <p style='margin-bottom: 15px;'>Thank you for choosing {$company_name} for your {$Countryname} {$visa_name} application.</p>
          <div style='background-color: #f5f5f5; padding: 12px; border-left: 4px solid #515763; margin: 15px 0;'>
            <p style='margin: 5px 0;'>Application Reference: {$appid}</p>
          </div>
          <p style='margin-bottom: 15px;'>We have received your application and it is currently being processed.</p>
          <div style='margin: 20px 0;'>
            <p style='margin-bottom: 10px;'>You can check your application status using the link below:</p>
            <a href='{$statusUrl}' style='background-color: #347928; color: white; text-decoration: none; padding: 12px 25px; font-size: 16px; border-radius: 5px; display: inline-block;'>Check Application Status</a>
          </div>
          <p style='color: #666; font-style: italic;'>If you have any questions, please contact our support team.</p>
          <p>For assistance, contact our support team at <a href='mailto:{$support_email}' style='color: #515763; text-decoration: none;'>{$support_email}</a></p>
          <p>Best regards,<br> Customer Service Dept.<br> <a href='{$website_url}' style='color: #515763; text-decoration: none;'>{$website_url}</a></p>
        </div>
        <div style='text-align: center; background-color: #0b5099; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-top: 15px; color: #ffffff; font-size: 14px;'>
          <strong>Contact Us:</strong><br>
          <strong>Email</strong>: <a href='mailto:{$support_email}' style='color:#ffffff;text-decoration:none' target='_blank'>{$support_email}</a><br>
          <strong>Telephone</strong>: <a href='tel:{$support_phone}' style='color:#ffffff;text-decoration:none' target='_blank'>{$support_phone_display}</a>
        </div>
        <div style='margin-top: 10px; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 4px; text-align: center;'>
          <p style='font-size: 14px;'>© ${new Date().getFullYear()} {$company_name}. All rights reserved.</p>
        </div>
      </div>`,
    },

    paymentReminder: {
      subject: 'Reminder: Pending Payment for {$Countryname} {$visa_name} #{$appid}',
      template: `<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 10px auto; padding: 15px; line-height: 1.5; color: #333; background-color: #f9f9f9;'>
        <div style='text-align: center; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);'>
          <img src='{$logo_url}' alt='{$company_name} Logo' style='max-width: 120px; height: auto;'>
          <div style='text-align: center; background-color: #F5F5F5; padding: 10px; margin:10px; border-radius: 8px;'>
            <p style='color: #0b5099; margin-top: 12px; font-size:20px; font-weight: bold;'>{$Countryname} {$visa_name} Application</p>
          </div>
        </div>
        <div style='background-color: #ffffff; padding: 25px; margin-top: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);'>
          <h4 style='color: #515763; margin-top: 0;'>Dear {$firstname} {$lastname},</h4>
          <p style='margin-bottom: 15px;'>Thank you for choosing {$company_name} for your {$Countryname} {$visa_name} application.</p>
          <div style='background-color: #f5f5f5; padding: 12px; border-left: 4px solid #515763; margin: 15px 0;'>
            <p style='margin: 5px 0;'>Application Reference: {$appid}</p>
          </div>
          <p style='margin-bottom: 15px;'>We have received your application; however, the payment for the processing is still pending.</p>
          <div style='margin: 20px 0;'>
            <p style='margin-bottom: 10px;'>Please use the link below to complete your payment and avoid any delays in processing your {$visa_name} application.</p>
            <a href='{$paymentUrl}' style='background-color:rgb(0, 79, 48); color: white; text-decoration: none; padding: 12px 25px; font-size: 16px; border-radius: 5px; display: inline-block;'>Click here to make payment</a>
          </div>
          <p style='color: #666; font-style: italic;'>If you face any issues while making the payment, please contact our support team at <a href='mailto:{$support_email}' style='color: #515763; text-decoration: none;'>{$support_email}</a></p>
          <p>Best regards,<br> Customer Service Dept.<br> <a href='{$website_url}' style='color: #515763; text-decoration: none;'>{$website_url}</a></p>
        </div>
        <div style='text-align: center; background-color: #0b5099; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-top: 15px; color: #ffffff; font-size: 14px;'>
          <strong>Contact Us:</strong><br>
          <strong>Email</strong>: <a href='mailto:{$support_email}' style='color:#ffffff;text-decoration:none' target='_blank'>{$support_email}</a><br>
          <strong>Telephone</strong>: <a href='tel:{$support_phone}' style='color:#ffffff;text-decoration:none' target='_blank'>{$support_phone_display}</a>
        </div>
        <div style='margin-top: 10px; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 4px; text-align: center;'>
          <p style='font-size: 14px;'>© ${new Date().getFullYear()} {$company_name}. All rights reserved.</p>
        </div>
      </div>`,
    },

    docsRemainder: {
      subject:
        'Reminder: Pending Documents for {$Countryname} {$visa_name} #{$appid}',
      template: `<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 10px auto; padding: 15px; line-height: 1.5; color: #333; background-color: #f9f9f9;'>
        <div style='text-align: center; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);'>
          <img src='{$logo_url}' alt='{$company_name} Logo' style='max-width: 120px; height: auto;'>
          <div style='text-align: center; background-color: #F5F5F5; padding: 10px; margin:10px; border-radius: 8px;'>
            <p style='color: #0b5099; margin-top: 12px; font-size:20px; font-weight: bold;'>{$Countryname} {$visa_name} Application</p>
          </div>
        </div>
        <div style='background-color: #ffffff; padding: 25px; margin-top: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);'>
          <h4 style='color: #515763; margin-top: 0;'>Dear {$firstname} {$lastname},</h4>
          <p style='margin-bottom: 15px;'>Thank you for choosing {$company_name} for {$Countryname} {$visa_name} application.</p>
          <div style='background-color: #f5f5f5; padding: 12px; border-left: 4px solid #515763; margin: 15px 0;'>
            <p style='margin: 5px 0;'>Application Reference: {$appid}</p>
          </div>
          <p style='margin-bottom: 15px;'>We have received your application; however, it seems you haven't uploaded all required documents or they were not accepted.</p>
          <div style='margin: 20px 0;'>
            <p style='margin-bottom: 10px;'>Please use the below link to upload all required documents and avoid delay in {$visa_name} approval.</p>
            <a href='{$documentUrl}' style='background-color: #347928; color: white; text-decoration: none; padding: 12px 25px; font-size: 16px; border-radius: 5px; display: inline-block;'>Click here to upload documents</a>
          </div>
          <p style='color: #666; font-style: italic;'>If you encounter issues uploading documents, kindly email them to <a href='mailto:{$support_email}' style='color: #515763; text-decoration: none;'>{$support_email}</a></p>
          <p>For assistance, contact our support team at <a href='mailto:{$support_email}' style='color: #515763; text-decoration: none;'>{$support_email}</a></p>
          <p>Best regards,<br> Customer Service Dept.<br> <a href='{$website_url}' style='color: #515763; text-decoration: none;'>{$website_url}</a></p>
        </div>
        <div style='text-align: center; background-color: #0b5099; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-top: 15px; color: #ffffff; font-size: 14px;'>
          <strong>Contact Us:</strong><br>
          <strong>Email</strong>: <a href='mailto:{$support_email}' style='color:#ffffff;text-decoration:none' target='_blank'>{$support_email}</a><br>
          <strong>Telephone</strong>: <a href='tel:{$support_phone}' style='color:#ffffff;text-decoration:none' target='_blank'>{$support_phone_display}</a>
        </div>
        <div style='margin-top: 10px; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 4px; text-align: center;'>
          <p style='font-size: 14px;'>© ${new Date().getFullYear()} {$company_name}. All rights reserved.</p>
        </div>
      </div>`,
    },

    passportRemainder: {
      subject:
        'Reminder: Pending Passport for {$Countryname} {$visa_name} #{$appid}',
      template: `<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 10px auto; padding: 15px; line-height: 1.5; color: #333; background-color: #f9f9f9;'>
        <div style='text-align: center; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);'>
          <img src='{$logo_url}' alt='{$company_name} Logo' style='max-width: 120px; height: auto;'>
          <div style='text-align: center; background-color: #F5F5F5; padding: 10px; margin:10px; border-radius: 8px;'>
            <p style='color: #0b5099; margin-top: 12px; font-size:20px; font-weight: bold;'>{$Countryname} {$visa_name} Application</p>
          </div>
        </div>
        <div style='background-color: #ffffff; padding: 25px; margin-top: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);'>
          <h4 style='color: #515763; margin-top: 0;'>Dear {$firstname} {$lastname},</h4>
          <p style='margin-bottom: 15px;'>Thank you for choosing {$company_name} for {$Countryname} {$visa_name} application.</p>
          <div style='background-color: #f5f5f5; padding: 12px; border-left: 4px solid #515763; margin: 15px 0;'>
            <p style='margin: 5px 0;'>Application Reference: {$appid}</p>
          </div>
          <p style='margin-bottom: 15px;'>We have received your application; however, we need a clear copy of your passport. Please ensure all corners of your passport are visible in the upload.</p>
          <div style='margin: 20px 0;'>
            <p style='margin-bottom: 10px;'>Please use the below link to upload your passport and avoid delays in {$visa_name} approval.</p>
            <a href='{$documentUrl}' style='background-color: #347928; color: white; text-decoration: none; padding: 12px 25px; font-size: 16px; border-radius: 5px; display: inline-block;'>Click here to upload passport</a>
          </div>
          <p style='color: #666; font-style: italic;'>If you encounter issues uploading your passport, kindly email it to <a href='mailto:{$support_email}' style='color: #515763; text-decoration: none;'>{$support_email}</a></p>
          <p>For assistance, contact our support team at <a href='mailto:{$support_email}' style='color: #515763; text-decoration: none;'>{$support_email}</a></p>
          <p>Best regards,<br> Customer Service Dept.<br> <a href='{$website_url}' style='color: #515763; text-decoration: none;'>{$website_url}</a></p>
        </div>
        <div style='text-align: center; background-color: #0b5099; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-top: 15px; color: #ffffff; font-size: 14px;'>
          <strong>Contact Us:</strong><br>
          <strong>Email</strong>: <a href='mailto:{$support_email}' style='color:#ffffff;text-decoration:none' target='_blank'>{$support_email}</a><br>
          <strong>Telephone</strong>: <a href='tel:{$support_phone}' style='color:#ffffff;text-decoration:none' target='_blank'>{$support_phone_display}</a>
        </div>
        <div style='margin-top: 10px; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 4px; text-align: center;'>
          <p style='font-size: 14px;'>© ${new Date().getFullYear()} {$company_name}. All rights reserved.</p>
        </div>
      </div>`,
    },

    photoRemainder: {
      subject:
        'Reminder: Pending Photo for {$Countryname} {$visa_name} #{$appid}',
      template: `<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 10px auto; padding: 15px; line-height: 1.5; color: #333; background-color: #f9f9f9;'>
        <div style='text-align: center; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);'>
          <img src='{$logo_url}' alt='{$company_name} Logo' style='max-width: 120px; height: auto;'>
          <div style='text-align: center; background-color: #F5F5F5; padding: 10px; margin:10px; border-radius: 8px;'>
            <p style='color: #0b5099; margin-top: 12px; font-size:20px; font-weight: bold;'>{$Countryname} {$visa_name} Application</p>
          </div>
        </div>
        <div style='background-color: #ffffff; padding: 25px; margin-top: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);'>
          <h4 style='color: #515763; margin-top: 0;'>Dear {$firstname} {$lastname},</h4>
          <p style='margin-bottom: 15px;'>Thank you for choosing {$company_name} for {$Countryname} {$visa_name} application.</p>
          <div style='background-color: #f5f5f5; padding: 12px; border-left: 4px solid #515763; margin: 15px 0;'>
            <p style='margin: 5px 0;'>Application Reference: {$appid}</p>
          </div>
          <p style='margin-bottom: 15px;'>We have received your application; however, we need a recent passport-sized photo for your {$visa_name} application. Please upload a clear photo with a plain background.</p>
          <div style='margin: 20px 0;'>
            <p style='margin-bottom: 10px;'>Please use the below link to upload your photo and avoid delays in {$visa_name} approval.</p>
            <a href='{$documentUrl}' style='background-color: #347928; color: white; text-decoration: none; padding: 12px 25px; font-size: 16px; border-radius: 5px; display: inline-block;'>Click here to upload photo</a>
          </div>
          <p style='color: #666; font-style: italic;'>If you encounter issues uploading your photo, kindly email it to <a href='mailto:{$support_email}' style='color: #515763; text-decoration: none;'>{$support_email}</a></p>
          <p>For assistance, contact our support team at <a href='mailto:{$support_email}' style='color: #515763; text-decoration: none;'>{$support_email}</a></p>
          <p>Best regards,<br> Customer Service Dept.<br> <a href='{$website_url}' style='color: #515763; text-decoration: none;'>{$website_url}</a></p>
        </div>
        <div style='text-align: center; background-color: #0b5099; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-top: 15px; color: #ffffff; font-size: 14px;'>
          <strong>Contact Us:</strong><br>
          <strong>Email</strong>: <a href='mailto:{$support_email}' style='color:#ffffff;text-decoration:none' target='_blank'>{$support_email}</a><br>
          <strong>Telephone</strong>: <a href='tel:{$support_phone}' style='color:#ffffff;text-decoration:none' target='_blank'>{$support_phone_display}</a>
        </div>
        <div style='margin-top: 10px; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 4px; text-align: center;'>
          <p style='font-size: 14px;'>© ${new Date().getFullYear()} {$company_name}. All rights reserved.</p>
        </div>
      </div>`,
    },

    selectedDocRemainder: {
      subject:
        'Reminder: Pending Specific Documents for {$Countryname} {$visa_name} #{$appid}',
      template: `<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 10px auto; padding: 15px; line-height: 1.5; color: #333; background-color: #f9f9f9;'>
        <div style='text-align: center; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);'>
          <img src='{$logo_url}' alt='{$company_name} Logo' style='max-width: 120px; height: auto;'>
          <div style='text-align: center; background-color: #F5F5F5; padding: 10px; margin:10px; border-radius: 8px;'>
            <p style='color: #0b5099; margin-top: 12px; font-size:20px; font-weight: bold;'>{$Countryname} {$visa_name} Application</p>
          </div>
        </div>
        <div style='background-color: #ffffff; padding: 25px; margin-top: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);'>
          <h4 style='color: #515763; margin-top: 0;'>Dear {$firstname} {$lastname},</h4>
          <p style='margin-bottom: 15px;'>Thank you for choosing {$company_name} for {$Countryname} {$visa_name} application.</p>
          <div style='background-color: #f5f5f5; padding: 12px; border-left: 4px solid #515763; margin: 15px 0;'>
            <p style='margin: 5px 0;'>Application Reference: {$appid}</p>
          </div>
          <p style='margin-bottom: 15px;'>We have reviewed your application and require the following specific document(s):</p>
          <div style='background-color: #f5f5f5; padding: 12px; border-left: 4px solid #0b5099; margin: 15px 0;'>
            <p style='margin: 5px 0;'>{$required_document_list}</p>
          </div>
          <div style='margin: 20px 0;'>
            <p style='margin-bottom: 10px;'>Please use the below link to upload the requested document(s) to avoid delays in {$visa_name} approval.</p>
            <a href='{$documentUrl}' style='background-color: #347928; color: white; text-decoration: none; padding: 12px 25px; font-size: 16px; border-radius: 5px; display: inline-block;'>Click here to upload documents</a>
          </div>
          <p style='color: #666; font-style: italic;'>If you encounter issues uploading documents, kindly email them to <a href='mailto:{$support_email}' style='color: #515763; text-decoration: none;'>{$support_email}</a></p>
          <p>For assistance, contact our support team at <a href='mailto:{$support_email}' style='color: #515763; text-decoration: none;'>{$support_email}</a></p>
          <p>Best regards,<br> Customer Service Dept.<br> <a href='{$website_url}' style='color: #515763; text-decoration: none;'>{$website_url}</a></p>
        </div>
        <div style='text-align: center; background-color: #0b5099; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-top: 15px; color: #ffffff; font-size: 14px;'>
          <strong>Contact Us:</strong><br>
          <strong>Email</strong>: <a href='mailto:{$support_email}' style='color:#ffffff;text-decoration:none' target='_blank'>{$support_email}</a><br>
          <strong>Telephone</strong>: <a href='tel:{$support_phone}' style='color:#ffffff;text-decoration:none' target='_blank'>{$support_phone_display}</a>
        </div>
        <div style='margin-top: 10px; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 4px; text-align: center;'>
          <p style='font-size: 14px;'>© ${new Date().getFullYear()} {$company_name}. All rights reserved.</p>
        </div>
      </div>`,
    },
  },

  // Default values for template variables
  defaults: {
    company_name: 'Ethiopia Travel Application',
    logo_url:
      'https://media.istockphoto.com/id/1400103307/vector/flag-of-ethiopia.jpg?s=2048x2048&w=is&k=20&c=lf9slNEFBG_tCtM5w4ZXpM1wcrexWJmBwD-bK2gT2Lc=',
    support_email: 'support@ethiopiatravelapplication.com',
    support_phone: '+18883693111',
    support_phone_display: 'United States +1 888 369 3111',
    website_url: 'https://www.ethiopiatravelapplication.com/',
  },
};
/**
 * Creates a nodemailer transporter based on environment configuration
 * @returns {object} - Configured nodemailer transporter
 */
function createTransporter() {
  return nodemailer.createTransport({
    // host: process.env.SMTP_HOST || 'smtp.gmail.com',
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER || 'worksbydeepak@gmail.com',
      pass: process.env.SMTP_PASSWORD || 'wokogxdruqhhlrhx',
    },
    tls: { ciphers: 'TLSv1.2' },
    requireTLS: true,
    debug: process.env.NODE_ENV !== 'production',
    connectionTimeout: 10000,
  });
}

/**
 * Fetches application data from Ethiopia visa application model and prepares email data
 * @param {string} applicationId - Ethiopia visa application ID
 * @param {string} templateKey - Email template key
 * @param {object} additionalData - Any additional data to include in the template
 * @returns {Promise<object>} - Prepared email data with application information
 */
async function prepareEthiopiaVisaEmail(
  applicationId,
  templateKey,
  additionalData = {}
) {
  try {
    // Validate inputs
    if (!applicationId || !templateKey) {
      throw new Error('Application ID and template key are required');
    }

    // Check if template exists
    if (!emailConfig.templates[templateKey]) {
      throw new Error(`Email template '${templateKey}' not found`);
    }

    // Fetch application with all related data
    const application = await EthiopiaVisaApplication.findById(applicationId)
      .populate('visaDetails')
      // .populate('arrivalInfo')
      .populate('personalInfo');
    // .populate('passportInfo')
    // .populate('documents');

    if (!application) {
      throw new Error(`Application with ID ${applicationId} not found`);
    }

    // Extract personal information
    const personalInfo = application.personalInfo || {};

    // Determine visa type and country information from visa details
    const visaDetails = application.visaDetails || {};
    const visaType = visaDetails.visaType || 'Visa';

    const YOUR_DOMAIN = 'https://www.ethiopiatravelapplication.com/';

    // Prepare document URL for the application
    const documentUrl = `${YOUR_DOMAIN}docs/${applicationId}`;
    const statusUrl = `${YOUR_DOMAIN}status`;
    const paymentUrl = `${YOUR_DOMAIN}payment/${applicationId}`;

    // Prepare template data
    const templateData = {
      ...emailConfig.defaults,
      firstname: personalInfo.givenName || 'Applicant',
      lastname: personalInfo.surname || '',
      appid: applicationId,
      Countryname: 'Ethiopia',
      countryname: 'ethiopia',
      visa_name: visaType,
      statusUrl,
      documentUrl,
      paymentUrl,
      emailAddress: application.emailAddress,
      ...additionalData,
    };

    // Get template and subject from config
    let { template, subject } = emailConfig.templates[templateKey];

    // Replace all placeholders in the template
    Object.keys(templateData).forEach(key => {
      const placeholder = new RegExp(`\\{\\$${key}\\}`, 'g');
      template = template.replace(placeholder, templateData[key]);
      subject = subject.replace(placeholder, templateData[key]);
    });

    // Return prepared email data
    return {
      to: application.emailAddress,
      subject: subject,
      html: template,
      templateKey: templateKey,
      applicationId: applicationId,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error preparing Ethiopia visa email:', error);
    throw error;
  }
}

/**
 * Sends an email using nodemailer
 * @param {object} emailData - Prepared email data
 * @returns {Promise<object>} - Email sending result
 */
async function sendEmail(emailData) {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.SMTP_FROM_EMAIL || emailConfig.defaults.support_email,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
    };

    const info = await transporter.sendMail(mailOptions);

    return {
      success: true,
      messageId: info.messageId,
      ...emailData,
    };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

/**
 * Sends document reminder email for Ethiopia visa application
 * @param {string} applicationId - Ethiopia visa application ID
 * @returns {Promise<object>} - Email sending result
 */
async function sendEthiopiaDocumentReminder(applicationId) {
  const emailData = await prepareEthiopiaVisaEmail(
    applicationId,
    'docsRemainder'
  );
  return await sendEmail(emailData);
}

async function sendEthiopiaPaymentReminder(applicationId) {
  const emailData = await prepareEthiopiaVisaEmail(
    applicationId,
    'paymentReminder'
  );
  return await sendEmail(emailData);
}

/**
 * Sends passport reminder email for Ethiopia visa application
 * @param {string} applicationId - Ethiopia visa application ID
 * @returns {Promise<object>} - Email sending result
 */
async function sendEthiopiaPassportReminder(applicationId) {
  const emailData = await prepareEthiopiaVisaEmail(
    applicationId,
    'passportRemainder'
  );
  return await sendEmail(emailData);
}

/**
 * Sends photo reminder email for Ethiopia visa application
 * @param {string} applicationId - Ethiopia visa application ID
 * @returns {Promise<object>} - Email sending result
 */
async function sendEthiopiaPhotoReminder(applicationId) {
  const emailData = await prepareEthiopiaVisaEmail(
    applicationId,
    'photoRemainder'
  );
  return await sendEmail(emailData);
}

/**
 * Sends application submission confirmation email for Ethiopia visa application
 * @param {string} applicationId - Ethiopia visa application ID
 * @returns {Promise<object>} - Email sending result
 */
async function sendEthiopiaApplicationConfirmation(applicationId) {
  const emailData = await prepareEthiopiaVisaEmail(applicationId, 'formSubmit');
  return await sendEmail(emailData);
}

/**
 * Sends specific document reminder email for Ethiopia visa application
 * @param {string} applicationId - Ethiopia visa application ID
 * @param {string} requiredDocuments - List of required documents
 * @returns {Promise<object>} - Email sending result
 */
async function sendEthiopiaSpecificDocumentReminder(
  applicationId,
  requiredDocuments
) {
  const emailData = await prepareEthiopiaVisaEmail(
    applicationId,
    'selectedDocRemainder',
    {
      required_document_list: requiredDocuments,
    }
  );
  return await sendEmail(emailData);
}

// await sendEthiopiaApplicationConfirmation('ETHevisa0609915');

export {
  prepareEthiopiaVisaEmail,
  sendEmail,
  sendEthiopiaDocumentReminder,
  sendEthiopiaPaymentReminder,
  sendEthiopiaPassportReminder,
  sendEthiopiaPhotoReminder,
  sendEthiopiaApplicationConfirmation,
  sendEthiopiaSpecificDocumentReminder,
};
