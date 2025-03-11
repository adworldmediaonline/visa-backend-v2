import Stripe from 'stripe';
import CambodiaVisaApplication from '../../models/cambodia/cambodiaVisaApplicationModel.js';
// const stripe = new Stripe(process.env.STRIPE_SECRET_LIVE_KEY);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// const YOUR_DOMAIN = 'http://localhost:3000';
// const YOUR_DOMAIN = 'https://visa-main.vercel.app';
const YOUR_DOMAIN = 'https://visacollect.com';
const paymentVisaApplicationController = {
  makePayment: async (req, res) => {
    try {
      // // Use mongoose.model to dynamically fetch the model
      // const visaApplicationModel = mongoose.model('CambodiaVisaApplication');

      // // Now you can use visaApplicationModel to perform operations, for example:
      const visaApplication = await CambodiaVisaApplication.findById(
        req.body.formId
      );

      if (!visaApplication) {
        return res.status(404).json({
          error: 'VisaApplication not found',
          statusCode: 404,
        });
      }

      const evisaFee = 1 * 100;
      // return res.json({ evisaFee });

      // const customer = await stripe.customers.create({
      //   name: 'SUNIL',
      //   address: {
      //     line1: '510 Townsend St',
      //     postal_code: '98140',
      //     city: 'karnal',
      //     state: 'Haryana',
      //     country: 'IN',
      //   },
      // });
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'USD',
              // currency: 'INR',
              unit_amount: evisaFee,
              product_data: {
                name: 'Cambodia Visa Application',
                description: 'Visa Application Description',
              },
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        // customer_email: 'test@example.com', // Replace with the email from your form or use a static value for testing
        // billing_address_collection: 'required',
        // customer: customer.id,

        customer_email: visaApplication.contactDetails.emailAddress,
        success_url: `${YOUR_DOMAIN}/payment-success`,
        cancel_url: `${YOUR_DOMAIN}/payment-error`,
      });
      res.json({ id: session.id });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
};
export default paymentVisaApplicationController;
