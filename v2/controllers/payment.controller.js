import VisaApplication from '../models/visaApplication.model.js';
import { capturePayPalOrder, createPayPalOrder } from '../services/paypal.service.js';

export async function createPayPalOrderForApplication(req, res) {
  try {
    const { id } = req.params;
    const { amount, currency = 'USD', description } = req.body || {};

    let query = { applicationId: id };
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      query = { $or: [{ _id: id }, { applicationId: id }] };
    }

    const application = await VisaApplication.findOne(query);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const result = await createPayPalOrder({
      amount,
      currency,
      applicationId: application.applicationId,
      description: description || `Visa payment for ${application.applicationId}`,
    });

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    return res.status(500).json({ success: false, message: 'Failed to create PayPal order', error: error.message });
  }
}

export async function capturePayPalOrderForApplication(req, res) {
  try {
    const { id } = req.params;
    const { orderId } = req.body || {};

    if (!orderId) {
      return res.status(400).json({ success: false, message: 'orderId required' });
    }

    let query = { applicationId: id };
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      query = { $or: [{ _id: id }, { applicationId: id }] };
    }

    const application = await VisaApplication.findOne(query);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const result = await capturePayPalOrder(orderId);

    const grossAmount = result?.purchase_units?.[0]?.payments?.captures?.[0]?.amount;
    const finalAmount = grossAmount?.value ? Number(grossAmount.value) : undefined;
    const finalCurrency = grossAmount?.currency_code || 'USD';

    application.payment = {
      isPaid: true,
      method: 'paypal',
      amount: finalAmount,
      currency: finalCurrency,
      paymentId: result.id,
      paidAt: new Date(),
    };
    await application.save();

    return res.status(200).json({ success: true, data: { applicationId: application.applicationId, payment: application.payment } });
  } catch (error) {
    console.error('Error capturing PayPal order:', error);
    return res.status(500).json({ success: false, message: 'Failed to capture PayPal order', error: error.message });
  }
}


