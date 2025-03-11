import VisaRequestForm from '../models/visa.js';
import VisaRequestForm6 from '../models/visaStep6.js';
import nodemailer from 'nodemailer';
import schedule from 'node-schedule';
const visaRequestFormController6 = {
  createStep6: async (req, res) => {
    try {
      const { HOSTINGER_EMAIL, HOSTINGER_PASSWORD } = req.mailAuth;
      const profilePicture = req?.files['profilePicture']?.map(
        file => file?.location
      )[0];

      const passport = req?.files['passport']?.map(file => file.location);

      const businessCard = req?.files['businessCard']?.map(
        file => file.location
      );

      const eMedicalCard = req.files['eMedicalCard']?.map(
        file => file?.location
      );

      const visaRequestForm6 = await VisaRequestForm6.create({
        profilePicture,
        passport,
        businessCard,
        eMedicalCard,
        formId: req.body.formId,
      });

      const updatedVisaRequestForm = await VisaRequestForm.findOneAndUpdate(
        {
          _id: req.body.formId,
        },
        {
          step6: visaRequestForm6._id,
          lastExitStepUrl: '/visa/step-seven',
        },
        {
          new: true,
        }
      );

      // cron schedule after 1 hour
      // Schedule a job to run once after 1 hour
      let date = new Date();
      date.setHours(date.getHours() + 1);

      // let date = new Date();
      // date.setSeconds(date.getSeconds() + 10);

      let job = schedule.scheduleJob(date, async function () {
        // Fetch the updated payment status
        const updatedForm = await VisaRequestForm.findById(req.body.formId);
        const visaStatus = updatedForm.visaStatus;

        // Check if visaStatus is pendingPayment

        if (visaStatus === 'pending payment') {
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
            text: `Dear Sir/Madam,\n\nYou uploaded document almost hour ago and not completed your payment. Please note down the Temporary Application ID: ${updatedForm._id}\n\n(Application ID required)`,
          };

          try {
            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent:', info.response);
          } catch (error) {
            console.error('Error sending email:', error);
            return res.status(400).json({ message: 'error' });
          }
        }
        console.log('run once');
        this.cancel();
      });
      // cron schedule after 1 hour code end here

      return res
        .status(201)
        .json({ message: 'Step 6 done successfully', data: visaRequestForm6 });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error uploading file');
    }
  },
};

export default visaRequestFormController6;
