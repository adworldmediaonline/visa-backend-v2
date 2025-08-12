import VisaApplication from '../models/visaApplication.model.js';
import { computeOrderSummary } from '../services/pricing.service.js';

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

    // Compute the amount directly from saved selections (do not trust client)
    let total = 0;
    let currency = 'USD';
    try {
      const fd = application.getFormData
        ? application.getFormData()
        : application.formData;
      const stage = fd?.processingTime?.selectedProcessingTime
        ? 'processing'
        : 'visa';
      const travelerCount =
        Array.isArray(fd?.applicants) && fd.applicants.length > 0
          ? fd.applicants.length + 1
          : typeof fd?.travelersInfo?.numberOfTravelers === 'number' &&
            fd.travelersInfo.numberOfTravelers > 0
          ? fd.travelersInfo.numberOfTravelers
          : 1;

      const validityFee = Number(
        (application.selectedValidity && application.selectedValidity.fee) !=
          null
          ? application.selectedValidity.fee
          : fd?.validityOption?.fee || 0
      );
      const processingSingleFee = Number(
        fd?.processingTime?.selectedProcessingFee || 0
      );
      const subtotal = Number.isFinite(validityFee)
        ? validityFee * Math.max(1, travelerCount)
        : 0;
      const processingFee = stage === 'processing' ? processingSingleFee : 0;
      currency =
        application.selectedValidity?.currency ||
        fd?.processingTime?.selectedProcessingCurrency ||
        'USD';

      total = subtotal + processingFee;

      // Fallback to rules-based computation only if subtotal missing
      if (!(total > 0)) {
        const summary = await computeOrderSummary({
          passportCountryCode: application.passportCountry?.code,
          destinationCountryCode: application.destinationCountry?.code,
          visaOptionName: application.visaOptionName,
          selectedProcessingTime: fd?.processingTime?.selectedProcessingTime,
          selectedValidity: application.selectedValidity || fd?.validityOption,
          selectedProcessingFee: fd?.processingTime?.selectedProcessingFee,
          numberOfTravelers: travelerCount,
          stage,
        });
        if (
          !summary ||
          typeof summary.total !== 'number' ||
          summary.total <= 0
        ) {
          return res.status(400).json({
            success: false,
            message: 'Unable to compute order amount',
          });
        }
        total = summary.total;
        currency = summary.currency || currency;
      }
    } catch (err) {
      console.error('createOrder: compute amount failed', err);
      return res
        .status(400)
        .json({ success: false, message: 'Unable to compute order amount' });
    }

    const accessToken = await getAccessToken();

    const publicBase =
      process.env.PUBLIC_BASE_URL || 'https://visa-backend-v2.vercel.app';

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
        // Use HTTPS redirector pages that deep-link back to the mobile app
        return_url: `${publicBase}/api/v2/visa/paypal/return`,
        cancel_url: `${publicBase}/api/v2/visa/paypal/cancel`,
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

    // Update application payment status from captured total
    application.payment = {
      isPaid: status === 'COMPLETED',
      method: 'paypal',
      amount:
        Number(
          data?.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value
        ) || undefined,
      currency:
        data?.purchase_units?.[0]?.payments?.captures?.[0]?.amount
          ?.currency_code || 'USD',
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

export async function paypalReturn(req, res) {
  const token = req.query.token || '';
  const appScheme = process.env.APP_SCHEME || 'visacollectmobile';
  const appUrl = `${appScheme}://paypal-return?token=${encodeURIComponent(
    token
  )}`;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(`<!doctype html>
<html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Returning to app…</title>
<meta http-equiv="refresh" content="0;url='${appUrl}'" />
<script>window.location.replace('${appUrl}');</script>
</head><body style="font-family: -apple-system, system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif; padding:20px;">
<p>Thanks! Returning to app… If you are not redirected, <a href="${appUrl}">tap here</a>.</p>
</body></html>`);
}

export async function paypalCancel(req, res) {
  const appScheme = process.env.APP_SCHEME || 'visacollectmobile';
  const appUrl = `${appScheme}://paypal-cancel`;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(`<!doctype html>
<html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Cancelled</title>
<meta http-equiv="refresh" content="0;url='${appUrl}'" />
<script>window.location.replace('${appUrl}');</script>
</head><body style="font-family: -apple-system, system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif; padding:20px;">
<p>Payment cancelled. Returning to app… If you are not redirected, <a href="${appUrl}">tap here</a>.</p>
</body></html>`);
}
