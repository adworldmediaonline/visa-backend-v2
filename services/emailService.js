// services/emailService.js

import nodemailer from 'nodemailer';
import VisaRequestForm from '../models/visa.js';

// Function to send emails
const sendEmail = async (email, applicationId) => {
  // ... (as before)
};

// Function to fetch and send emails with pending payment status
const sendPendingPaymentEmails = async res => {
  try {
    const forms = await VisaRequestForm.find({ paymentStatus: 'pending' })
      .populate('step2')
      .populate('step3')
      .populate('step4')
      .populate('step5')
      .populate('step6')
      .select('emailId expectedDateOfArrival'); // Select only the email field

    if (!forms || forms.length === 0) {
      return res
        .status(404)
        .json({ error: 'No forms with pending payment status found' });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.HOSTINGER_EMAIL,
        pass: process.env.HOSTINGER_PASSWORD,
      },
      tls: { ciphers: 'TLSv1.2' },
      requireTLS: true,
      debug: true,
      connectionTimeout: 10000,
    });

    // Define the common email options
    const commonMailOptions = {
      from: process.env.HOSTINGER_EMAIL,
      subject: 'Payment Reminder',
    };

    // Send emails to users with pending payment status
    for (const form of forms) {
      const currentDate = new Date();
      const expectedDate = new Date(form.expectedDateOfArrival);

      // Compare the dates to check if expectedDateOfArrival is a future date
      if (currentDate < expectedDate) {
        console.log(
          `Sending email for ${form.emailId} because expectedDateOfArrival is a future date`
        );
        // TODO: Add the below detail with proper domain
        {
          /* <p>Before completing the payment, you can visit our <a href="https://e-visa-delta.vercel.app">home page</a> to fill out the partially completed form using your Application ID.</p>
          <p>Click <a href="https://e-visa-delta.vercel.app">here</a> to complete the payment after filling out the form.</p> */
        }
        const mailOptions = {
          ...commonMailOptions,
          to: form.emailId,
          text: `Dear Sir/Madam,\n\nYour payment is pending. Please complete the payment to proceed.. Please note down the Temporary Application ID: ${form._id}`,
          html: `
          <p>Dear Sir/Madam,</p>
          <p>Your payment is pending. Please complete the payment to proceed.</p>
          <p>Please note down the Temporary Application ID: ${form._id}</p>
          `,
        };

        try {
          const info = await transporter.sendMail(mailOptions);
          console.log('Email sent:', info.response);
        } catch (error) {
          console.error('Error sending email:', error);
        }
      } else {
        console.log(
          `Skipping email for ${form.emailId} due to expectedDateOfArrival being the same day or a past date`
        );
        continue;
      }
    }

    res.json({
      message: 'Pending mail send successfully',
      statusCode: 201,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
};

export { sendPendingPaymentEmails };
