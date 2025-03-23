import paypal from '@paypal/checkout-server-sdk';
import nodemailer from 'nodemailer';
import VisaRequestForm from '../models/visa.js';
const YOUR_DOMAIN = 'https://visacollect.com';

const visaRequestFormController = {
  loginEvisaUser: async (req, res) => {
    try {
      const evisaUser = await VisaRequestForm.findById(req.body.formId);

      if (!evisaUser) {
        return res.status(404).json({ error: 'User form id not found' });
      }

      return res
        .status(201)
        .json({ message: 'User Form Id  Found successfully', data: evisaUser });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error uploading file');
    }
  },
  createVisaRequestForm: async (req, res) => {
    try {
      const { HOSTINGER_EMAIL, HOSTINGER_PASSWORD } = req.mailAuth;

      const visaRequestForms = new VisaRequestForm({
        ...req.body,
        lastExitStepUrl: '/visa/step-two',
      });

      let data = await visaRequestForms.save();

      // NODEMAILER

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

      const mailOptions = {
        from: HOSTINGER_EMAIL,
        to: data.emailId,
        subject: 'temporary ID.',
        text: `Dear Sir/Madam,\n\nYour partially filled data has been saved successfully. Please note down the Temporary Application ID: ${data._id}\n\n(Application ID required)`,
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        return res.status(200).json(data);
      } catch (error) {
        console.error('Error sending email:', error);
        return res.status(400).json({ message: 'error' });
      }

      // NODEMAILER CODE END HERE
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },

  viewVisaRequestFormById: async (req, res) => {
    try {
      const form = await VisaRequestForm.findById(req.params.id)
        .populate('step2')
        .populate('step3')
        .populate('step4')
        .populate('step5')
        .populate('step6');

      if (!form) {
        return res
          .status(404)
          .json({ error: 'Form not found', statusCode: 404 });
      }
      res.json(form);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },

  sendPendingMailVisaRequestForm: async (req, res) => {
    try {
      const { HOSTINGER_EMAIL, HOSTINGER_PASSWORD } = req.mailAuth;
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
      console.log(forms);
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
          user: HOSTINGER_EMAIL,
          pass: HOSTINGER_PASSWORD,
        },
        tls: { ciphers: 'TLSv1.2' },
        requireTLS: true,
        debug: true,
        connectionTimeout: 10000,
      });

      // Define the common email options
      const commonMailOptions = {
        from: HOSTINGER_EMAIL,
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
            text: `Dear Sir/Madam,\n\nYour payment is pending. Please complete the payment to proceed.. Please note down the Temporary Application ID: ${form._id}\n\n(Application ID required)`,
            html: `
          <p>Dear Sir/Madam,</p>
          <p>Your payment is pending. Please complete the payment to proceed.</p>
          <p>Please note down the Temporary Application ID: ${form._id}</p>
          <p>(Application ID required)</p>
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

      res.json({
        message: 'Pending mail send successfully',
        statusCode: 201,
      });
    } catch (error) {
      console.error(error);

      res.json({ error: error, statusCode: 500 });
    }
  },
  viewAllVisaRequestForm: async (req, res) => {
    try {
      const form = await VisaRequestForm.find()
        .sort({ createdAt: -1 })
        .populate('step2')
        .populate('step3')
        .populate('step4')
        .populate('step5')
        .populate('step6');

      if (!form) {
        return res.status(404).json({ error: 'Form not found' });
      }

      res.json({ data: form, message: 'view all visa' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },

  updateVisaRequestForm: async (req, res) => {
    try {
      const updatedForm = await VisaRequestForm.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedForm) {
        return res.status(404).json({ error: 'Form not found' });
      }
      res.json(updatedForm);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  updateVisaRequestFormPatch: async (req, res) => {
    try {
      const updatedForm = await VisaRequestForm.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedForm) {
        return res.status(404).json({ error: 'Form not found or not paid' });
      }
      res.json(updatedForm);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  updateVisaRequestFormLastExitStepUrl: async (req, res) => {
    try {
      const { HOSTINGER_EMAIL, HOSTINGER_PASSWORD } = req.mailAuth;
      if (!req.body.lastExitStepUrl) {
        return res.status(400).json({
          message: 'last exit step and payment status required',
          status: 400,
        });
      }

      if (req.body.lastExitStepUrl && !req.body.paymentStatus) {
        const updatedForm = await VisaRequestForm.findOneAndUpdate(
          { _id: req.params.id },
          { lastExitStepUrl: req.body.lastExitStepUrl },
          {
            new: true,
          }
        );

        if (!updatedForm) {
          return res.status(404).json({ error: 'Form not found' });
        }

        // NODEMAILER
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

        const mailOptions = {
          from: HOSTINGER_EMAIL,
          to: updatedForm.emailId,
          subject: 'temporary ID.',
          text: `Dear Sir/Madam,\n\nYour form is incomplete. Please note down the Temporary Application ID: ${updatedForm._id}\n\n(Application ID required) and completed the form`,
        };

        try {
          const info = await transporter.sendMail(mailOptions);
          console.log('Email sent:', info.response);
          return res.status(200).json(updatedForm);
        } catch (error) {
          console.error('Error sending email:', error);
          return res.status(400).json({ message: 'error' });
        }

        // NODEMAILER CODE END HERE
      }
      if (req.body.paymentStatus && req.body.lastExitStepUrl) {
        const updatedForm = await VisaRequestForm.findOneAndUpdate(
          { _id: req.params.id },
          {
            lastExitStepUrl: req.body.lastExitStepUrl,
            paymentStatus: req.body.paymentStatus,
          },
          {
            new: true,
          }
        );

        if (!updatedForm) {
          return res.status(404).json({ error: 'Form not found' });
        }

        // NODEMAILER
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

        const mailOptions = {
          from: HOSTINGER_EMAIL,
          to: updatedForm.emailId,
          subject: 'temporary ID.',
          text: `Dear Sir/Madam,\n\nYour form is incomplete. Please note down the Temporary Application ID: ${updatedForm._id}\n\n(Application ID required) and completed the form`,
        };

        try {
          const info = await transporter.sendMail(mailOptions);
          console.log('Email sent:', info.response);
          return res.status(200).json(updatedForm);
        } catch (error) {
          console.error('Error sending email:', error);
          return res.status(400).json({ message: 'error' });
        }

        // NODEMAILER CODE END HERE
      }
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  updateVisaRequestFormPayment: async (req, res) => {
    try {
      const { HOSTINGER_EMAIL, HOSTINGER_PASSWORD } = req.mailAuth;
      if (!req.body.termsAndConditions) {
        return res
          .status(400)
          .json({ message: 'terms and conditions required', status: 400 });
      }
      const data = await VisaRequestForm.findOneAndUpdate(
        { _id: req.params.id },
        {
          lastExitStepUrl: req.body.lastExitStepUrl,
          paymentStatus: req.body.paymentStatus,
          termsAndConditionsContent: req.body.termsAndConditionsContent,
          termsAndConditions: req.body.termsAndConditions,
        },
        {
          new: true,
        }
      );

      if (!data) {
        return res.status(404).json({ error: 'Form not found' });
      }

      // NODEMAILER
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

      const mailOptions = {
        from: HOSTINGER_EMAIL,
        to: data.emailId,
        subject: 'temporary ID.',
        text: `Dear Sir/Madam,\n\nYour payment completed successfully. Please note down the Temporary Application ID: ${data._id}\n\n(Application ID required)`,
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        return res.status(200).json(data);
      } catch (error) {
        console.error('Error sending email:', error);
        return res.status(400).json({ message: 'error' });
      }

      // NODEMAILER CODE END HERE
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  updateVisaRequestFormPaymentStatus: async (req, res) => {
    try {
      const { HOSTINGER_EMAIL, HOSTINGER_PASSWORD } = req.mailAuth;
      if (!req.body.paymentStatus) {
        return res
          .status(400)
          .json({ message: 'payment status is required', status: 400 });
      }

      const updatedVisaRequestForm = await VisaRequestForm.findOneAndUpdate(
        { _id: req.params.id },
        {
          paymentStatus: req.body.paymentStatus,
        },
        {
          new: true,
        }
      );

      if (!updatedVisaRequestForm) {
        return res.status(404).json({ error: 'Form not found' });
      }

      return res
        .status(200)
        .json({ message: 'Payment status updated successfully' });

      // NODEMAILER
      // const transporter = nodemailer.createTransport({
      //   host: 'smtp.gmail.com',
      //   port: 465,
      //   secure: true,
      //   auth: {
      //     user: HOSTINGER_EMAIL,
      //     pass: process.env.GMAIL_PASSWORD,
      //   },
      // });

      // const mailOptions = {
      //   from: HOSTINGER_EMAIL,
      //   to: data.emailId,
      //   subject: 'temporary ID.',
      //   text: `Dear Sir/Madam,\n\nYour payment completed successfully. Please note down the Temporary Application ID: ${data._id}\n\n(Application ID required)`,
      // };

      // try {
      //   const info = await transporter.sendMail(mailOptions);
      //   console.log('Email sent:', info.response);
      //   return res.status(200).json(data);
      // } catch (error) {
      //   console.error('Error sending email:', error);
      //   return res.status(400).json({ message: 'error' });
      // }

      // NODEMAILER CODE END HERE
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  deleteVisaRequestForm: async (req, res) => {
    try {
      const form = await VisaRequestForm.findByIdAndRemove(req.params.id);
      if (!form) {
        return res.status(404).json({ error: 'Form not found' });
      }
      res.json({ message: 'Form deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  // india visa payments
  makeIndiaVisaPayment: async (req, res) => {
    try {
      const { HOSTINGER_EMAIL, HOSTINGER_PASSWORD } = req.mailAuth;
      const request = new paypal.orders.OrdersCreateRequest();
      request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: '1.00',
              breakdown: {
                item_total: {
                  currency_code: 'USD',
                  value: '1.00',
                },
              },
            },
            items: [
              {
                name: 'Evisa testing',
                description: 'Evisa testing description',
                quantity: '1',
                unit_amount: {
                  currency_code: 'USD',
                  value: '1.00',
                },
              },
            ],
          },
        ],
      });

      const response = await client.execute(request);
      console.log(response);
      return res.status(200).json({
        id: response.result.id,
      });
      // need to uncomment this below code after payment gateway completes
      // if (!req.body.termsAndConditions) {
      //   return res
      //     .status(400)
      //     .json({ message: 'terms and conditions required', status: 400 });
      // }
      // const visaRequestForm = await VisaRequestForm.findById(req.params.id);
      // const data = await VisaRequestForm.findOneAndUpdate(
      //   { _id: req.params.id },
      //   {
      //     lastExitStepUrl: req.body.lastExitStepUrl,
      //     paymentStatus: req.body.paymentStatus,
      //     termsAndConditionsContent: req.body.termsAndConditionsContent,
      //     termsAndConditions: req.body.termsAndConditions,
      //   },
      //   {
      //     new: true,
      //   }
      // );
      // if (!data) {
      //   return res.status(404).json({ error: 'Form not found' });
      // }
      // // NODEMAILER
      // const transporter = nodemailer.createTransport({
      //   host: 'smtp.gmail.com',
      //   port: 465,
      //   secure: true,
      //   auth: {
      //     user: HOSTINGER_EMAIL,
      //     pass: process.env.GMAIL_PASSWORD,
      //   },
      // });
      // const mailOptions = {
      //   from: 'digitalcappuccinoggn@gmail.com',
      //   to: data.emailId,
      //   subject: 'temporary ID.',
      //   text: `Dear Sir/Madam,\n\nYour payment completed successfully. Please note down the Temporary Application ID: ${data._id}\n\n(Application ID required)`,
      // };
      // try {
      //   const info = await transporter.sendMail(mailOptions);
      //   console.log('Email sent:', info.response);
      //   return res.status(200).json({ data, id: session.id });
      // } catch (error) {
      //   console.error('Error sending email:', error);
      //   return res.status(400).json({ message: 'error' });
      // }
      // res.json({ id: session.id });
    } catch (error) {
      console.log(error);
      const data = await VisaRequestForm.findOneAndUpdate(
        { _id: req.params.id },
        {
          lastExitStepUrl: req.body.lastExitStepUrl,
          paymentStatus: 'pendingPayment',
          termsAndConditionsContent: '',
          termsAndConditions: false,
        },
        {
          new: true,
        }
      );

      if (!data) {
        return res.status(404).json({ error: 'Form not found' });
      }
      return res.status(500).json({ error: error });
    }
  },
};

export default visaRequestFormController;
