/**
 * Payment Confirmation Email Template
 * Sends confirmation email when payment is successfully processed
 */

import { emailConfig } from '../config/emailConfig.js';

/**
 * Generates HTML template for payment confirmation email
 * @param {object} data - Template data
 * @param {string} data.applicationId - Unique application ID
 * @param {string} data.visaName - Name of the visa being applied for
 * @param {string} data.passportCountry - Passport country name
 * @param {string} data.destinationCountry - Destination country name
 * @param {string} data.userEmail - User's email address
 * @param {object} data.payment - Payment details
 * @param {string} data.payment.paymentId - Payment transaction ID
 * @param {number} data.payment.amount - Payment amount
 * @param {string} data.payment.currency - Payment currency
 * @param {string} data.payment.method - Payment method
 * @param {string} data.payment.paidAt - Payment date
 * @returns {string} HTML email template
 */
export function generatePaymentConfirmationTemplate(data) {
  const {
    applicationId,
    visaName,
    passportCountry,
    destinationCountry,
    userEmail,
    payment,
  } = data;

  const { branding } = emailConfig;
  const paymentDate = new Date(payment.paidAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Confirmed - ${applicationId}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background-color: #059669; color: white; padding: 30px 20px; text-align: center; }
        .logo { max-width: 150px; height: auto; margin-bottom: 15px; }
        .header h1 { margin: 0; font-size: 24px; font-weight: bold; }
        .content { padding: 30px 20px; }
        .success-icon { text-align: center; margin: 20px 0; }
        .success-icon span { font-size: 48px; color: #059669; }
        .application-box { background-color: #f8fafc; border: 2px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
        .application-id { font-size: 20px; font-weight: bold; color: #2563eb; margin: 10px 0; letter-spacing: 1px; }
        .status { color: #059669; font-weight: 600; font-size: 16px; }
        .payment-details { background-color: #ecfdf5; border: 2px solid #059669; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .payment-details h3 { margin-top: 0; color: #059669; }
        .payment-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #d1fae5; }
        .payment-row:last-child { border-bottom: none; }
        .payment-label { font-weight: bold; color: #374151; }
        .payment-value { color: #059669; font-weight: 600; }
        .info-box { background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0; }
        .info-box h3 { margin-top: 0; color: #1e40af; }
        .info-box ul { margin: 10px 0; padding-left: 20px; }
        .info-box li { margin-bottom: 8px; }
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
            <h1>Payment Confirmed!</h1>
            <p>Your ${visaName} application payment has been processed successfully</p>
        </div>

        <!-- Content -->
        <div class="content">
            <!-- Success Icon -->
            <div class="success-icon">
                <span>✅</span>
            </div>

            <h2>Thank you for your payment!</h2>
            <p>Your payment has been successfully processed and your ${visaName} application from ${passportCountry} to ${destinationCountry} is now being reviewed.</p>

            <!-- Application ID Box -->
            <div class="application-box">
                <h3>Application Details</h3>
                <div class="application-id">${applicationId}</div>
                <div class="status">Status: Payment Confirmed - Under Review</div>
            </div>

            <!-- Payment Details -->
            <div class="payment-details">
                <h3>💳 Payment Details</h3>
                <div class="payment-row">
                    <span class="payment-label">Transaction ID:</span>
                    <span class="payment-value">${payment.paymentId}</span>
                </div>
                <div class="payment-row">
                    <span class="payment-label">Amount Paid:</span>
                    <span class="payment-value">${payment.currency} ${
    payment.amount
  }</span>
                </div>
                <div class="payment-row">
                    <span class="payment-label">Payment Method:</span>
                    <span class="payment-value">${payment.method}</span>
                </div>
                <div class="payment-row">
                    <span class="payment-label">Payment Date:</span>
                    <span class="payment-value">${paymentDate}</span>
                </div>
            </div>

            <!-- Important Information -->
            <div class="info-box">
                <h3>📋 What Happens Next?</h3>
                <ul>
                    <li><strong>Application Review:</strong> Our team will review your application and documents.</li>
                    <li><strong>Processing Time:</strong> You'll receive updates via email as your application progresses.</li>
                    <li><strong>Document Verification:</strong> We may contact you if additional documents are needed.</li>
                    <li><strong>Final Decision:</strong> You'll be notified once your visa application is approved or if any issues arise.</li>
                </ul>
            </div>

            <!-- Next Steps -->
            <div class="next-steps">
                <h3>📱 Track Your Application</h3>
                <ol>
                    <li>Open the VisaCollect mobile app</li>
                    <li>Go to the "Track" tab</li>
                    <li>Enter your Application ID: <strong>${applicationId}</strong></li>
                    <li>View real-time status updates</li>
                </ol>
            </div>

            <p><strong>Important:</strong> Keep this email and your Application ID safe for future reference.</p>
            <p>If you have any questions about your application, please don't hesitate to contact our support team.</p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <h3>Contact Support</h3>
            <p>
                <strong>Email:</strong> <a href="mailto:${
                  branding.supportEmail
                }">${branding.supportEmail}</a>
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
 * Generates subject line for payment confirmation email
 * @param {object} data - Template data
 * @returns {string} Email subject
 */
export function generatePaymentConfirmationSubject(data) {
  return `Payment Confirmed - ${data.visaName} Application ${data.applicationId}`;
}

export default {
  generatePaymentConfirmationTemplate,
  generatePaymentConfirmationSubject,
};
