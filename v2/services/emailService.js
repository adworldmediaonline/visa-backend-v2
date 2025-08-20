import nodemailer from 'nodemailer';
import VisaApplication from '../models/visaApplication.model.js';

const emailConfig = {
  // Template definitions with subjects and HTML content
  templates: {
    applicationStart: {
      subject: '{$visa_name} Application Started - #{$application_id}',
      template: `<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 10px auto; padding: 15px; line-height: 1.5; color: #333; background-color: #f9f9f9;'>
        <div style='text-align: center; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);'>
          <img src='{$logo_url}' alt='{$company_name} Logo' style='max-width: 120px; height: auto;'>
          <div style='text-align: center; background-color: #F5F5F5; padding: 10px; margin:10px; border-radius: 8px;'>
            <p style='color: #0b5099; margin-top: 12px; font-size:20px; font-weight: bold;'>{$visa_name} Application</p>
          </div>
        </div>
        <div style='background-color: #ffffff; padding: 25px; margin-top: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);'>
          <h4 style='color: #515763; margin-top: 0;'>Dear Applicant,</h4>
          <p style='margin-bottom: 15px;'>Thank you for choosing {$company_name} for your {$visa_name} application.</p>

          <div style='background-color: #f5f5f5; padding: 12px; border-left: 4px solid #515763; margin: 15px 0;'>
            <p style='margin: 5px 0; font-weight: bold;'>Application ID: {$application_id}</p>
            <p style='margin: 5px 0; color: #666;'>Status: Application Started</p>
          </div>

          <div style='background-color: #e8f4f8; padding: 15px; border-radius: 8px; margin: 20px 0;'>
            <h5 style='color: #0b5099; margin-top: 0; margin-bottom: 10px;'>Important Information:</h5>
            <ul style='margin: 0; padding-left: 20px;'>
              <li style='margin-bottom: 8px;'><strong>Save this Application ID:</strong> You'll need it to track your application or resume if you exit.</li>
              <li style='margin-bottom: 8px;'><strong>Resume Application:</strong> Use the "Track Application" feature in our app with your Application ID.</li>
              <li style='margin-bottom: 8px;'><strong>Complete Your Application:</strong> Don't forget to complete all steps and make payment to process your visa.</li>
            </ul>
          </div>

          <div style='margin: 20px 0;'>
            <p style='margin-bottom: 10px;'>You can track your application status or resume where you left off using the button below:</p>
            <a href='{$tracking_url}' style='background-color: #347928; color: white; text-decoration: none; padding: 12px 25px; font-size: 16px; border-radius: 5px; display: inline-block;'>Track Application</a>
          </div>

          <div style='background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;'>
            <h5 style='color: #856404; margin-top: 0; margin-bottom: 10px;'>Next Steps:</h5>
            <p style='margin: 5px 0; color: #856404;'>1. Complete your personal details</p>
            <p style='margin: 5px 0; color: #856404;'>2. Upload required documents</p>
            <p style='margin: 5px 0; color: #856404;'>3. Review and submit your application</p>
            <p style='margin: 5px 0; color: #856404;'>4. Make payment to process your visa</p>
          </div>

          <p style='color: #666; font-style: italic;'>If you need assistance at any point, please contact our support team.</p>
          <p>For assistance, contact our support team at <a href='mailto:{$support_email}' style='color: #515763; text-decoration: none;'>{$support_email}</a></p>
          <p>Best regards,<br> Customer Service Team<br> <a href='{$website_url}' style='color: #515763; text-decoration: none;'>{$website_url}</a></p>
        </div>
        <div style='text-align: center; background-color: #0b5099; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-top: 15px; color: #ffffff; font-size: 14px;'>
          <strong>Contact Us:</strong><br>
          <strong>Email</strong>: <a href='mailto:{$support_email}' style='color:#ffffff;text-decoration:none' target='_blank'>{$support_email}</a><br>
          <strong>Phone</strong>: <a href='tel:{$support_phone}' style='color:#ffffff;text-decoration:none' target='_blank'>{$support_phone_display}</a>
        </div>
        <div style='margin-top: 10px; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 4px; text-align: center;'>
          <p style='font-size: 14px; color: #666;'>© ${new Date().getFullYear()} {$company_name}. All rights reserved.</p>
        </div>
      </div>`,
    },

    saveAndExit: {
      subject: '{$visa_name} Application Saved - #{$application_id}',
      template: `<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 10px auto; padding: 15px; line-height: 1.5; color: #333; background-color: #f9f9f9;'>
        <div style='text-align: center; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);'>
          <img src='{$logo_url}' alt='{$company_name} Logo' style='max-width: 120px; height: auto;'>
          <div style='text-align: center; background-color: #F5F5F5; padding: 10px; margin:10px; border-radius: 8px;'>
            <p style='color: #0b5099; margin-top: 12px; font-size:20px; font-weight: bold;'>{$visa_name} Application</p>
          </div>
        </div>
        <div style='background-color: #ffffff; padding: 25px; margin-top: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);'>
          <h4 style='color: #515763; margin-top: 0;'>Dear Applicant,</h4>
          <p style='margin-bottom: 15px;'>Your {$visa_name} application has been saved successfully.</p>

          <div style='background-color: #f5f5f5; padding: 12px; border-left: 4px solid #515763; margin: 15px 0;'>
            <p style='margin: 5px 0; font-weight: bold;'>Application ID: {$application_id}</p>
            <p style='margin: 5px 0; color: #666;'>Status: In Progress (Step {$step_completed} of 7)</p>
          </div>

          <div style='background-color: #e8f4f8; padding: 15px; border-radius: 8px; margin: 20px 0;'>
            <h5 style='color: #0b5099; margin-top: 0; margin-bottom: 10px;'>Resume Your Application:</h5>
            <p style='margin: 5px 0;'>Your progress has been saved. You can continue your application at any time using your Application ID.</p>
          </div>

          <div style='margin: 20px 0;'>
            <p style='margin-bottom: 10px;'>Click the button below to continue your application:</p>
            <a href='{$resume_url}' style='background-color: #347928; color: white; text-decoration: none; padding: 12px 25px; font-size: 16px; border-radius: 5px; display: inline-block;'>Continue Application</a>
          </div>

          <p style='color: #666; font-style: italic;'>Remember to complete your application soon to avoid any delays in processing.</p>
          <p>For assistance, contact our support team at <a href='mailto:{$support_email}' style='color: #515763; text-decoration: none;'>{$support_email}</a></p>
          <p>Best regards,<br> Customer Service Team<br> <a href='{$website_url}' style='color: #515763; text-decoration: none;'>{$website_url}</a></p>
        </div>
        <div style='text-align: center; background-color: #0b5099; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-top: 15px; color: #ffffff; font-size: 14px;'>
          <strong>Contact Us:</strong><br>
          <strong>Email</strong>: <a href='mailto:{$support_email}' style='color:#ffffff;text-decoration:none' target='_blank'>{$support_email}</a><br>
          <strong>Phone</strong>: <a href='tel:{$support_phone}' style='color:#ffffff;text-decoration:none' target='_blank'>{$support_phone_display}</a>
        </div>
        <div style='margin-top: 10px; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 4px; text-align: center;'>
          <p style='font-size: 14px; color: #666;'>© ${new Date().getFullYear()} {$company_name}. All rights reserved.</p>
        </div>
      </div>`,
    },
  },

  // Default values for template variables
  defaults: {
    company_name: 'VisaCollect',
    logo_url: 'https://visacollect.com/images/logo.png',
    support_email: 'support@visacollect.com',
    support_phone: '+18883693111',
    support_phone_display: '+1 (888) 369-3111',
    website_url: 'https://visacollect.com',
    tracking_url: 'https://visacollect.com/track',
    resume_url: 'https://visacollect.com/resume',
  },
};

/**
 * Creates a nodemailer transporter based on environment configuration
 * Uses Ethereal for testing/development and real SMTP for production
 * @returns {object} - Configured nodemailer transporter
 */
async function createTransporter() {
  // Use Ethereal for testing/development
  if (
    process.env.NODE_ENV !== 'production' ||
    process.env.USE_ETHEREAL === 'true'
  ) {
    try {
      // Create Ethereal test account
      const testAccount = await nodemailer.createTestAccount();

      console.log('📧 Using Ethereal Email for testing');
      console.log('📧 Ethereal credentials:', {
        user: testAccount.user,
        pass: testAccount.pass,
        web: testAccount.web,
      });

      return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
        tls: { ciphers: 'TLSv1.2' },
        debug: true,
      });
    } catch (error) {
      console.error(
        '❌ Failed to create Ethereal account, falling back to production SMTP:',
        error
      );
      // Fall back to production SMTP if Ethereal fails
    }
  }

  // Production SMTP configuration
  console.log('📧 Using production SMTP configuration');
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.HOSTINGER_EMAIL || 'support@visacollect.com',
      pass: process.env.HOSTINGER_PASSWORD || 'your-password',
    },
    tls: { ciphers: 'TLSv1.2' },
    requireTLS: true,
    debug: process.env.NODE_ENV !== 'production',
    connectionTimeout: 10000,
  });
}

/**
 * Prepares email data for a V2 visa application
 * @param {string} applicationId - Application ID
 * @param {string} templateKey - Email template key
 * @param {object} additionalData - Additional template data
 * @returns {Promise<object>} - Prepared email data
 */
async function prepareVisaApplicationEmail(
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
    // Check if applicationId is a valid ObjectId format (24 char hex string)
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

    // Check if email address is available
    if (!application.emailAddress) {
      throw new Error('No email address found for this application');
    }

    // Prepare visa name
    const visaName =
      application.visaOptionName ||
      `${application.destinationCountry.name} Visa` ||
      'Visa Application';

    // Prepare template data
    const templateData = {
      ...emailConfig.defaults,
      application_id: application.applicationId,
      visa_name: visaName,
      passport_country: application.passportCountry.name,
      destination_country: application.destinationCountry.name,
      step_completed: application.stepCompleted || 0,
      status: application.status,
      tracking_url: `${emailConfig.defaults.tracking_url}/${application.applicationId}`,
      resume_url: `${emailConfig.defaults.resume_url}/${application.applicationId}`,
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
      applicationId: application.applicationId,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error preparing visa application email:', error);
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
    const transporter = await createTransporter();

    const mailOptions = {
      from: process.env.HOSTINGER_EMAIL || emailConfig.defaults.support_email,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
    };

    const info = await transporter.sendMail(mailOptions);

    // Log Ethereal preview URL if using Ethereal
    if (
      process.env.NODE_ENV !== 'production' ||
      process.env.USE_ETHEREAL === 'true'
    ) {
      const previewURL = nodemailer.getTestMessageUrl(info);
      if (previewURL) {
        console.log('📧 Ethereal Email Preview URL:', previewURL);
      }
    }

    return {
      success: true,
      messageId: info.messageId,
      previewURL: nodemailer.getTestMessageUrl(info),
      ...emailData,
    };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

/**
 * Sends application start confirmation email
 * @param {string} applicationId - Application ID
 * @returns {Promise<object>} - Email sending result
 */
export async function sendApplicationStartEmail(applicationId) {
  const emailData = await prepareVisaApplicationEmail(
    applicationId,
    'applicationStart'
  );
  return await sendEmail(emailData);
}

/**
 * Sends save and exit confirmation email
 * @param {string} applicationId - Application ID
 * @returns {Promise<object>} - Email sending result
 */
export async function sendSaveAndExitEmail(applicationId) {
  const emailData = await prepareVisaApplicationEmail(
    applicationId,
    'saveAndExit'
  );
  return await sendEmail(emailData);
}

export { emailConfig, prepareVisaApplicationEmail, sendEmail };
