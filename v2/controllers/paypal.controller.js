import VisaApplication from '../models/visaApplication.model.js';

const PAYPAL_BASE_URL =
  process.env.PAYPAL_ENV === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

async function getAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials not configured');
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`PayPal token error: ${response.status} ${err}`);
  }

  const data = await response.json();
  return data.access_token;
}

export async function createOrder(req, res) {
  try {
    const { id: applicationId } = req.params;
    if (!applicationId) {
      return res
        .status(400)
        .json({ success: false, message: 'Application ID is required' });
    }

    const application = await VisaApplication.findOne({ applicationId });
    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: 'Application not found' });
    }

    // Determine amount
    const currency = application.orderSummary?.currency || 'USD';
    const total = application.orderSummary?.total;
    if (typeof total !== 'number' || total <= 0) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid order amount' });
    }

    const accessToken = await getAccessToken();

    const orderBody = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: { currency_code: currency, value: total.toFixed(2) },
          description: `Visa application ${application.applicationId}`,
        },
      ],
      application_context: {
        brand_name: 'VisaCollect',
        user_action: 'PAY_NOW',
        return_url: req.body.returnUrl || 'visacollect://paypal-return',
        cancel_url: req.body.cancelUrl || 'visacollect://paypal-cancel',
      },
    };

    const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderBody),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: 'Failed to create order',
        error: data,
      });
    }

    const approveLink = Array.isArray(data.links)
      ? data.links.find(l => l.rel === 'approve')?.href
      : undefined;

    return res
      .status(200)
      .json({ success: true, data: { id: data.id, approveLink } });
  } catch (error) {
    console.error('❌ PayPal createOrder error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create PayPal order',
      error: error.message,
    });
  }
}

export async function captureOrder(req, res) {
  try {
    const { id: applicationId } = req.params;
    const { orderId } = req.body;

    if (!applicationId || !orderId) {
      return res.status(400).json({
        success: false,
        message: 'Application ID and orderId are required',
      });
    }

    const application = await VisaApplication.findOne({ applicationId });
    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: 'Application not found' });
    }

    const accessToken = await getAccessToken();
    const response = await fetch(
      `${PAYPAL_BASE_URL}/v2/checkout/orders/${encodeURIComponent(
        orderId
      )}/capture`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: 'Failed to capture PayPal order',
        error: data,
      });
    }

    const captureId = data?.purchase_units?.[0]?.payments?.captures?.[0]?.id;
    const status = data?.status;

    // Update application payment status
    application.payment = {
      isPaid: status === 'COMPLETED',
      method: 'paypal',
      amount: application.orderSummary?.total,
      currency: application.orderSummary?.currency || 'USD',
      paymentId: captureId || orderId,
      paidAt: new Date(),
    };
    await application.save();

    return res
      .status(200)
      .json({ success: true, data: { status, captureId, orderId } });
  } catch (error) {
    console.error('❌ PayPal captureOrder error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to capture PayPal order',
      error: error.message,
    });
  }
}
