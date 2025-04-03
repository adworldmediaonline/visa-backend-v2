import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay with your credentials
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create a Razorpay order
export const createRazorpayOrder = async (amount, receipt, notes = {}) => {
    try {
        const options = {
            amount: amount * 100,
            currency: "USD",
            receipt,
            notes
        };

        const order = await razorpay.orders.create(options);
        return order;
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        throw error;
    }
};

// Verify Razorpay payment signature
export const verifyRazorpayPayment = (orderId, paymentId, signature) => {
    const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

    return generatedSignature === signature;
};
