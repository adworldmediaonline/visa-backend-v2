/**
 * Application Start Email Template
 * Sends welcome email with Application ID when user starts a new visa application
 */

import { emailConfig } from '../config/emailConfig.js';

/**
 * Generates HTML template for application start email
 * @param {object} data - Template data
 * @param {string} data.applicationId - Unique application ID
 * @param {string} data.visaName - Name of the visa being applied for
 * @param {string} data.passportCountry - Passport country name
 * @param {string} data.destinationCountry - Destination country name
 * @param {string} data.userEmail - User's email address
 * @returns {string} HTML email template
 */
export function generateApplicationStartTemplate(data) {
  const {
    applicationId,
    visaName,
    passportCountry,
    destinationCountry,
    userEmail,
  } = data;

  const { branding, templates } = emailConfig;
  const trackingUrl = `${templates.trackingUrl}/${applicationId}`;
  const resumeUrl = `${templates.resumeUrl}/${applicationId}`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Visa Application Started - ${applicationId}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background-color: #2563eb; color: white; padding: 30px 20px; text-align: center; }
        .logo { max-width: 150px; height: auto; margin-bottom: 15px; }
        .header h1 { margin: 0; font-size: 24px; font-weight: bold; }
        .content { padding: 30px 20px; }
        .application-box { background-color: #f8fafc; border: 2px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
        .application-id { font-size: 24px; font-weight: bold; color: #2563eb; margin: 10px 0; letter-spacing: 1px; }
        .status { color: #059669; font-weight: 600; }
        .info-box { background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0; }
        .info-box h3 { margin-top: 0; color: #1e40af; }
        .info-box ul { margin: 10px 0; padding-left: 20px; }
        .info-box li { margin-bottom: 8px; }
        .button { display: inline-block; background-color: #059669; color: white; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: bold; margin: 10px 5px; }
        .button:hover { background-color: #047857; }
        .next-steps { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
        .next-steps h3 { margin-top: 0; color: #92400e; }
        .next-steps ol { margin: 10px 0; padding-left: 20px; }
        .next-steps li { margin-bottom: 8px; color: #92400e; }
        .footer { background-color: #1f2937; color: white; padding: 20px; text-align: center; }
        .footer a { color: #60a5fa; text-decoration: none; }
        .copyright { margin-top: 15px; font-size: 14px; color: #9ca3af; }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <img src="${branding.logoUrl}" alt="${
    branding.companyName
  }" class="logo">
            <h1>Visa Application Started</h1>
            <p>Your ${visaName} application has been created successfully</p>
        </div>

        <!-- Content -->
        <div class="content">
            <h2>Welcome to ${branding.companyName}!</h2>
            <p>Thank you for choosing us for your ${visaName} application from ${passportCountry} to ${destinationCountry}.</p>

            <!-- Application ID Box -->
            <div class="application-box">
                <h3>Your Application Details</h3>
                <div class="application-id">${applicationId}</div>
                <div class="status">Status: Application Started</div>
                <p><strong>Important:</strong> Save this Application ID for tracking and resuming your application.</p>
            </div>

            <!-- Important Information -->
            <div class="info-box">
                <h3>📋 Important Information</h3>
                <ul>
                    <li><strong>Save Your Application ID:</strong> You'll need this to track your application or resume if you exit.</li>
                    <li><strong>Resume Anytime:</strong> Use the "Track Application" feature in our app with your Application ID.</li>
                    <li><strong>Complete Your Application:</strong> Don't forget to complete all steps and make payment to process your visa.</li>
                    <li><strong>Email Notifications:</strong> We'll send you updates as your application progresses.</li>
                </ul>
            </div>

            <!-- Action Buttons -->
            <div style="text-align: center; margin: 30px 0;">
                <a href="${resumeUrl}" class="button">Continue Application</a>
                <a href="${trackingUrl}" class="button" style="background-color: #6366f1;">Track Progress</a>
            </div>

            <!-- Next Steps -->
            <div class="next-steps">
                <h3>🚀 Next Steps</h3>
                <ol>
                    <li>Complete your personal details</li>
                    <li>Upload required documents</li>
                    <li>Review your application information</li>
                    <li>Make payment to process your visa</li>
                </ol>
            </div>

            <p>If you need assistance at any point, please don't hesitate to contact our support team.</p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <h3>Contact Support</h3>
            <p>
                <strong>Email:</strong> <a href="mailto:${
                  branding.supportEmail
                }">${branding.supportEmail}</a><br>
                <strong>Phone:</strong> <a href="tel:${
                  branding.supportPhoneRaw
                }">${branding.supportPhone}</a><br>
                <strong>Website:</strong> <a href="${branding.websiteUrl}">${
    branding.websiteUrl
  }</a>
            </p>
            <div class="copyright">
                © ${new Date().getFullYear()} ${
    branding.companyName
  }. All rights reserved.
            </div>
        </div>
    </div>
</body>
</html>`;
}

/**
 * Generates subject line for application start email
 * @param {object} data - Template data
 * @returns {string} Email subject
 */
export function generateApplicationStartSubject(data) {
  return `${data.visaName} Application Started - ID: ${data.applicationId}`;
}

export default {
  generateApplicationStartTemplate,
  generateApplicationStartSubject,
};
