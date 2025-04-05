import mongoose from 'mongoose';
import Stripe from 'stripe';
import VisaRequestForm from '../models/visa.js';
import { sendEmailBasedOnDomain } from '../utils/sendEmailBasedOnDomain.js';
import nodemailer from 'nodemailer';
import { indianVisaPaymentFinalPrice } from '../utils/indianVisaPaymentFinalPrice.js';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_LIVE);

const createVisaCheckoutSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { termsAndConditions, termsAndConditionsContent, domainUrl } =
      req.body;

    if (
      !id ||
      !domainUrl ||
      !termsAndConditions ||
      !termsAndConditionsContent
    ) {
      res
        .status(400)
        .json({ message: 'domain url, id, termsAndConditions is required' });
    }

    const ModelName = mongoose.model('VisaRequestForm');

    if (!ModelName) {
      return res.status(404).json({ error: 'Model not found' });
    }

    const visaBookingModel = await ModelName.findByIdAndUpdate(
      id,
      {
        termsAndConditionsContent,
      },
      { new: true }
    );

    const finalVisaPrice = indianVisaPaymentFinalPrice(
      35,
      visaBookingModel.nationalityRegion,
      visaBookingModel.visaService,
      visaBookingModel.eTouristVisa
    );
    // const finalVisaPrice = 1;

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'India E-Visa',
            },
            unit_amount: finalVisaPrice * 100,
            // unit_amount: 35 * 100,
          },
          quantity: 1,
        },
      ],
      client_reference_id: id,
      customer_email: visaBookingModel.emailId,
      mode: 'payment',
      success_url: `${domainUrl}/thankyou/?success=true&orderId=${id}`,
      cancel_url: `${domainUrl}/cancel/?cancel=true&orderId=${id}`,
      metadata: {
        orderId: id,
        domainUrl,
        termsAndConditions,
      },
    });

    // res.redirect(303, session.url);
    res.status(201).json({ message: 'success', session });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const webhookCheckout = async (req, res) => {
  try {
    console.log('webhookCheckout');
    const signature = req.headers['stripe-signature'];
    if (!signature) {
      return res.status(400).json({ error: 'No signature found' });
    }
    let event;
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET_LIVE
    );

    if (event.type === 'checkout.session.completed') {
      console.log('checkout.session.completed');
      const session = event.data.object;
      const indianVisaBookingId = session.client_reference_id;

      const price = session.amount_total / 100;
      const { termsAndConditions, orderId, domainUrl } = session.metadata;

      const user = await VisaRequestForm.findByIdAndUpdate(
        indianVisaBookingId,
        {
          visaStatus: 'pending',
          price,
          paid: true,
          termsAndConditions,
        },
        { new: true }
      );

      console.log('sendConfirmationEmail');
      await sendConfirmationEmail(user.emailId, orderId, domainUrl);
    }

    console.log('received: true');
    res.status(200).json({ received: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Webhook Error', message: err.message });
  }
};

const sendConfirmationEmail = async (email, id, domainUrl) => {
  try {
    const { HOSTINGER_EMAIL, HOSTINGER_PASSWORD } =
      sendEmailBasedOnDomain(domainUrl);

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
      to: email,
      subject: 'Payment Confirmation',
      html: `<p>Dear ${email},</p>
             <p>Thank you for your payment. Your payment has been received.</p> Please note down the  Application ID: ${id}`,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  } catch (err) {
    console.error(err);
  }
};

export { createVisaCheckoutSession, webhookCheckout };
