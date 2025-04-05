import VisaRequestForm from './models/visa.js';
import nodemailer from 'nodemailer';
import cron from 'node-cron';

const sendMailAfterDocumentUploadPendingPayment = () => {
  try {
    cron.schedule('0 * * * *', async () => {
      const forms = await VisaRequestForm.find({
        lastExitStepUrl: '/visa/step-eight',
      });

      if (forms.length > 0) {
        console.log(forms);

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
          subject: 'Upload Document Payment Reminder',
        };

        // Send emails to users with pending payment status upload document status
        for (const form of forms) {
          const mailOptions = {
            ...commonMailOptions,
            to: form.emailId,
            text: `Dear Sir/Madam,\n\nYour payment is pending you uploaded the document. Please complete the payment to proceed.. Please note down the Temporary Application ID: ${form._id}`,
            html: `
          <p>Dear Sir/Madam,</p>
          <p>You uploaded document but payment is pending. Please complete the payment to proceed.</p>
          <p>Please note down the Temporary Application ID: ${form._id}</p>
          <p>Before completing the payment, you can visit our <a href="https://e-visa-delta.vercel.app">home page</a> to fill out the partially completed form using your Application ID.</p>
          <p>Click <a href="https://e-visa-delta.vercel.app">here</a> to complete the payment after filling out the form.</p>`,
          };

          try {
            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent:', info.response);
          } catch (error) {
            console.error('Error sending email:', error);
          }
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const sendMailEveryDayForPendingPayment = () => {
  try {
    cron.schedule('0 9 * * *', async () => {
      console.log('cron job running');
      const forms = await VisaRequestForm.find({
        $or: [
          { paymentStatus: 'pendingPayment' },
          { paymentStatus: 'incomplete' },
        ],
      })
        .populate('step2')
        .populate('step3')
        .populate('step4')
        .populate('step5')
        .populate('step6')
        .select('emailId paymentStatus expectedDateOfArrival');

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
        if (
          (currentDate < expectedDate &&
            form.paymentStatus === 'pendingPayment') ||
          form.paymentStatus === 'incomplete'
        ) {
          console.log(
            `Sending email for ${form.emailId} because expectedDateOfArrival is a future date`
          );

          const mailOptions = {
            ...commonMailOptions,
            to: form.emailId,
            text: `Dear Sir/Madam,\n\nYour payment is pending. Please complete the payment to proceed.. Please note down the Temporary Application ID: ${form._id}`,
            html: `
          <p>Dear Sir/Madam,</p>
          <p>Your payment is pending. Please complete the payment to proceed.</p>
          <p>Please note down the Temporary Application ID: ${form._id}</p>
          <p>Before completing the payment, you can visit our <a href="https://e-visa-delta.vercel.app">home page</a> to fill out the partially completed form using your Application ID.</p>
          <p>Click <a href="https://e-visa-delta.vercel.app">here</a> to complete the payment after filling out the form.</p>`,
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
    });
  } catch (error) {
    console.log(error);
  }
};

export {
  sendMailAfterDocumentUploadPendingPayment,
  sendMailEveryDayForPendingPayment,
};
