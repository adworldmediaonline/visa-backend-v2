import mongoose from 'mongoose';
import Stripe from 'stripe';
import VisaRequestForm from '../../models/visa.js';
import { sendEmailBasedOnDomain } from '../../utils/sendEmailBasedOnDomain.js';
import nodemailer from 'nodemailer';
import { indianVisaPaymentFinalPrice } from '../../utils/indianVisaPaymentFinalPrice.js';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_LIVE);

const createIndiaVisaCheckoutSession = async (req, res, next) => {
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

    // const indiaVisaModel = await VisaRequestForm.findByIdAndUpdate(
    //   id,
    //   {
    //     termsAndConditionsContent,
    //   },
    //   { new: true }
    // );

    const indiaVisaModel = await VisaRequestForm.findById(id);

    const finalVisaPrice = indianVisaPaymentFinalPrice(
      35,
      indiaVisaModel.nationalityRegion,
      indiaVisaModel.visaService,
      indiaVisaModel.eTouristVisa
    );
    // const finalVisaPrice = 1;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
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
      customer_email: indiaVisaModel.emailId,
      mode: 'payment',
      success_url: `${domainUrl}/thankyou/?success=true&orderId=${id}`,
      cancel_url: `${domainUrl}/cancel/?cancel=true&orderId=${id}`,
      metadata: {
        orderId: id,
        domainUrl,
        termsAndConditions,
        termsAndConditionsContent,
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
          termsAndConditionsContent,
          paymentMethod: 'stripe',
          paymentId: session.id,
          paymentStatus: session.payment_status,
          paymentAmount: session.amount_total / 100,
          paymentDate: new Date(),
        },
        { new: true }
      );

      // console.log('sendConfirmationEmail');
      await sendConfirmationEmail(user.emailId, orderId, domainUrl);
    }

    // console.log('received: true');
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
      subject: 'India eVisa Payment Confirmation',
      html: `<p>Dear Applicant,</p>
             <p>Thank you for your payment. Your India eVisa application has been received and is now being processed.</p>
             <p>Your Application ID: <strong>${id}</strong></p>
             <p>Please keep this ID for future reference. You will be notified via email about the status of your application.</p>
             <p>Best regards,<br>India eVisa Team</p>`,
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

export { createIndiaVisaCheckoutSession, webhookCheckout };
