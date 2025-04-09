import nodemailer from 'nodemailer';
import { sendEmailBasedOnDomain } from '../utils/sendEmailBasedOnDomain.js';
import VisaRequestForm from '../models/visa.js';

// email config
const indiaVisaEmailConfig = {
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
        </div>
        <div style='margin-top: 10px; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 4px; text-align: center;'>
          <p style='font-size: 14px;'>© ${new Date().getFullYear()} {$company_name}. All rights reserved.</p>
        </div>
      </div>`,
    },

    paymentReminder: {
      subject:
        'Reminder: Pending Payment for {$Countryname} {$visa_name} #{$appid}',
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
  },

  // Default values for template variables
  // defaults: {
  //   company_name: 'Ethiopia Travel Application',
  //   logo_url:
  //     'https://media.istockphoto.com/id/1400103307/vector/flag-of-ethiopia.jpg?s=2048x2048&w=is&k=20&c=lf9slNEFBG_tCtM5w4ZXpM1wcrexWJmBwD-bK2gT2Lc=',
  //   support_email: 'support@ethiopiatravelapplication.com',
  //   support_phone: '+18883693111',
  //   support_phone_display: 'United States +1 888 369 3111',
  //   website_url: 'https://www.ethiopiatravelapplication.com/',
  // },
};

// Create a safer transporter
const createTransporter = async domainUrl => {
  try {
    // Clean up domain URL to ensure proper matching
    const cleanDomain = domainUrl;
    // .replace(/^https?:\/\//, '')
    // .replace(/\/$/, '');
    console.log('cleanDomain', cleanDomain);
    const { HOSTINGER_EMAIL, HOSTINGER_PASSWORD } =
      sendEmailBasedOnDomain(cleanDomain);

    if (!HOSTINGER_EMAIL || !HOSTINGER_PASSWORD) {
      throw new Error(
        `Email credentials not found for domain: ${cleanDomain}. Please check environment variables.`
      );
    }

    // Create transporter with proper configuration
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
    console.log(
      'SMTP connection verified successfully for domain:',
      cleanDomain
    );

    return transporter;
  } catch (error) {
    console.error('Error creating email transporter:', {
      error: error.message,
      domain: domainUrl,
      code: error.code,
      response: error.response,
    });
    throw error;
  }
};

// prepare india visa email
async function prepareIndiaVisaEmailForApplicationCreation({
  applicationId,
  templateKey,
  additionalData = {},
  domain,
  hostingerSupportEmail,
}) {
  try {
    // Validate inputs
    if (!applicationId || !templateKey) {
      throw new Error('Application ID and template key are required');
    }

    // Check if template exists
    if (!indiaVisaEmailConfig.templates[templateKey]) {
      throw new Error(`Email template '${templateKey}' not found`);
    }

    // Fetch application with all related data
    const application = await VisaRequestForm.findById(applicationId);

    if (!application) {
      throw new Error(`Application with ID ${applicationId} not found`);
    }

    // Determine visa type and country information from visa details
    const visaType = application?.visaService || 'Visa';

    const YOUR_DOMAIN = domain || 'Not Found';

    // Prepare document URL for the application
    // const documentUrl = `${YOUR_DOMAIN}docs/${applicationId}`;
    // const statusUrl = `${YOUR_DOMAIN}status`;
    // const paymentUrl = `${YOUR_DOMAIN}payment/${applicationId}`;

    const statusUrl = `${YOUR_DOMAIN}`;

    // Prepare template data
    const templateData = {
      company_name: 'India eVisa Application',
      logo_url:
        'https://media.istockphoto.com/id/472317739/vector/flag-of-india.jpg?s=1024x1024&w=is&k=20&c=s2bakabBV0c1wpyd6Cq4Al7JAo0aSYJ1Jw7DJfJN3GE=',
      support_email: hostingerSupportEmail,
      website_url: YOUR_DOMAIN ?? '',
      firstname: application?.emailId?.split('@')[0] || 'Applicant',
      lastname: application?.emailId?.split('@')[1] || '',
      appid: applicationId,
      Countryname: 'India',
      countryname: 'india',
      visa_name: visaType,
      statusUrl,
      // documentUrl,
      // paymentUrl,
      emailAddress: application.emailId,
      ...additionalData,
    };

    // Get template and subject from config
    let { template, subject } = indiaVisaEmailConfig.templates[templateKey];

    // Replace all placeholders in the template
    Object.keys(templateData).forEach(key => {
      const placeholder = new RegExp(`\\{\\$${key}\\}`, 'g');
      template = template.replace(placeholder, templateData[key]);
      subject = subject.replace(placeholder, templateData[key]);
    });

    // Return prepared email data
    return {
      to: application.emailId,
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

async function sendIndiaEmail({ emailData, domain }) {
  try {
    const transporter = await createTransporter(domain);
    const fromEmail = transporter.options.auth.user;

    const mailOptions = {
      from: fromEmail,
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

async function sendIndiaApplicationConfirmation({
  applicationId,
  domain,
  hostingerSupportEmail,
}) {
  const emailData = await prepareIndiaVisaEmailForApplicationCreation({
    applicationId,
    templateKey: 'formSubmit',
    domain,
    hostingerSupportEmail,
  });
  return await sendIndiaEmail({ emailData, domain });
}

const sendIndiaVisaPaymentConfirmationEmail = async (email, id, domainUrl) => {
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

const sendIndiaVisaEmail = async (email, subject, html, domainUrl) => {
  const transporter = await createTransporter(domainUrl);
  const mailOptions = {
    from: transporter.options.auth.user,
    to: email,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
  return true;
};

// send admin alert
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

const sendAdminAlert = async (subject, message, domainUrl) => {
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

export {
  sendIndiaApplicationConfirmation,
  sendIndiaVisaPaymentConfirmationEmail,
  sendIndiaVisaEmail,
  sendAdminAlert,
  retryOperation,
};
