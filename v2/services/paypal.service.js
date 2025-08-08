import * as paypal from '@paypal/checkout-server-sdk';

function getEnvironment() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const mode = (
    process.env.PAYPAL_ENV ||
    process.env.PAYPAL_MODE ||
    'sandbox'
  ).toLowerCase();
  if (!clientId || !clientSecret) {
    throw new Error('Missing PayPal credentials');
  }
  return mode === 'live'
    ? new paypal.core.LiveEnvironment(clientId, clientSecret)
    : new paypal.core.SandboxEnvironment(clientId, clientSecret);
}

function getClient() {
  const environment = getEnvironment();
  return new paypal.core.PayPalHttpClient(environment);
}

export async function createPayPalOrder({
  amount,
  currency = 'USD',
  applicationId,
  description,
}) {
  if (!amount) throw new Error('Amount is required');
  const client = getClient();
  const request = new paypal.orders.OrdersCreateRequest();
  request.headers['Prefer'] = 'return=representation';
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [
      {
        reference_id: applicationId || undefined,
        description: description || 'Visa application payment',
        amount: {
          currency_code: currency,
          value:
            typeof amount === 'number' ? amount.toFixed(2) : String(amount),
        },
      },
    ],
    application_context: {
      brand_name: 'Visacollect',
      shipping_preference: 'NO_SHIPPING',
      user_action: 'PAY_NOW',
      return_url: process.env.PAYPAL_RETURN_URL || 'https://example.com/return',
      cancel_url: process.env.PAYPAL_CANCEL_URL || 'https://example.com/cancel',
    },
  });

  const response = await client.execute(request);
  return response.result;
}

export async function capturePayPalOrder(orderId) {
  if (!orderId) throw new Error('orderId is required');
  const client = getClient();
  const request = new paypal.orders.OrdersCaptureRequest(orderId);
  request.requestBody({});
  const response = await client.execute(request);
  return response.result;
}
