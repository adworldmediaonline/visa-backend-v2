import AustraliaVisaApplication from '../../models/australia/australiaTourismVisaApplicationModel.js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_LIVE_KEY);
// const YOUR_DOMAIN = 'http://localhost:3000';
// const YOUR_DOMAIN = 'https://visa-main.vercel.app';
const YOUR_DOMAIN = 'https://visacollect.com';

const australiaVisaApplicationController = {
  createAustraliaVisaApplication: async (req, res) => {
    const passportDocuments = req?.files?.passportDocuments?.map(
      file => file?.location
    )[0];

    const passportSizePhoto =
      req?.files?.passportSizePhoto?.map(file => file?.location) || [];
    const bankStatementPaySlips =
      req?.files?.bankStatementPaySlips?.map(file => file?.location) || [];

    const businessCard =
      req?.files?.businessCard?.map(file => file?.location) || [];

    const invitationLetter =
      req?.files?.images?.map(file => file?.location) || [];

    const travelAndHealthInsurance =
      req?.files?.travelAndHealthInsurance?.map(file => file?.location) || [];

    const policeCertificate =
      req?.files?.policeCertificate?.map(file => file?.location) || [];

    const medicalCertificate =
      req?.files?.medicalCertificate?.map(file => file?.location) || [];

    const additionalDocuments =
      req?.files?.images?.map(file => file?.location) || [];

    const newData = {
      ...req.body,
      documents: {
        passportDocuments,
        passportSizePhoto,
        bankStatementPaySlips,
        businessCard,
        invitationLetter,
        travelAndHealthInsurance,
        policeCertificate,
        medicalCertificate,
        additionalDocuments,
      },
    };

    try {
      const australiaVisaApplication = new AustraliaVisaApplication(newData);

      const australiaVisaApplicationResult =
        await australiaVisaApplication.save();

      return res.status(201).json(australiaVisaApplicationResult);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  createAustraliaVisaApplicationPayment: async (req, res) => {
    try {
      // const evisaFee = 59 * 100;
      const evisaFee = 1 * 100;
      const australiaVisaApplication = await AustraliaVisaApplication.findById(
        req.body.formId
      ).populate('members');
      if (!australiaVisaApplication) {
        return res.status(404).json({
          error: 'AustraliaVisaApplication not found',
          statusCode: 404,
        });
      }

      const insuranceFee = +australiaVisaApplication.travelInsurance
        .insuranceFee
        ? +australiaVisaApplication.travelInsurance.insuranceFee * 100
        : 0;
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              // currency: 'USD',
              currency: 'USD',
              unit_amount: evisaFee + insuranceFee,
              product_data: {
                name: 'Australia Visa Application',
                description: 'Australia Visa Application Description',
              },
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        // success_url: `${YOUR_DOMAIN}/australia/application/success`,
        // cancel_url: `${YOUR_DOMAIN}/australia/application/cancel`,
        success_url: `${YOUR_DOMAIN}/payment-success`,
        cancel_url: `${YOUR_DOMAIN}/payment-error`,
      });

      res.json({ id: session.id });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  getAllAustraliaVisaApplication: async (req, res) => {
    try {
      const australiaVisaApplication =
        await AustraliaVisaApplication.find().populate('members');
      if (!australiaVisaApplication) {
        return res.status(404).json({
          error: 'AustraliaVisaApplication not found',
          statusCode: 404,
        });
      }
      res.json(australiaVisaApplication);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  australiaVisaApplicationById: async (req, res) => {
    try {
      const australiaVisaApplication = await AustraliaVisaApplication.findById(
        req.params.id
      ).populate('members');
      if (!australiaVisaApplication) {
        return res.status(404).json({
          error: 'AustraliaVisaApplication not found',
          statusCode: 404,
        });
      }
      res.json(australiaVisaApplication);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  updateAustraliaVisaApplication: async (req, res) => {
    try {
      const australiaVisaApplication =
        await AustraliaVisaApplication.findByIdAndUpdate(
          req.params.id,
          { ...req.body },
          { new: true }
        );
      if (!australiaVisaApplication) {
        return res.status(404).json({ error: 'Form not found' });
      }
      res.json(australiaVisaApplication);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  deleteAustraliaVisaApplicationById: async (req, res) => {
    try {
      const australiaVisaApplication =
        await AustraliaVisaApplication.findByIdAndDelete(req.params.id);
      if (!australiaVisaApplication) {
        return res
          .status(404)
          .json({ error: 'AustraliaVisaApplication not found' });
      }
      res.json({ message: 'AustraliaVisaApplication deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};
export default australiaVisaApplicationController;
