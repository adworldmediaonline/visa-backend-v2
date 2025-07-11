import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    // Reference to the main application
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
    },

    // Payment identification
    paymentId: {
      type: String,
      unique: true,
      required: true,
    },
    transactionId: String,
    orderId: String,

    // Payment gateway information
    gateway: {
      provider: {
        type: String,
        enum: ['stripe', 'razorpay', 'paypal', 'paytm', 'other'],
        required: true,
      },
      paymentIntentId: String,
      chargeId: String,
      customerId: String,
    },

    // Payment amounts
    amounts: {
      governmentFee: {
        amount: {
          type: Number,
          required: true,
        },
        currency: {
          type: String,
          required: true,
          length: 3,
        },
      },
      serviceFee: {
        amount: {
          type: Number,
          required: true,
        },
        currency: {
          type: String,
          required: true,
          length: 3,
        },
      },
      processingFee: {
        amount: Number,
        currency: String,
      },
      tax: {
        amount: Number,
        rate: Number,
        type: String,
      },
      totalAmount: {
        amount: {
          type: Number,
          required: true,
        },
        currency: {
          type: String,
          required: true,
          length: 3,
        },
      },
    },

    // Payment status
    status: {
      type: String,
      enum: [
        'pending',
        'processing',
        'completed',
        'failed',
        'cancelled',
        'refunded',
        'partially_refunded',
      ],
      default: 'pending',
    },

    // Payment method
    paymentMethod: {
      type: {
        type: String,
        enum: ['card', 'bank_transfer', 'wallet', 'upi', 'netbanking', 'other'],
      },
      details: {
        cardLast4: String,
        cardBrand: String,
        bankName: String,
        walletProvider: String,
        upiId: String,
      },
    },

    // Payment dates
    dates: {
      initiatedAt: {
        type: Date,
        default: Date.now,
      },
      processedAt: Date,
      completedAt: Date,
      failedAt: Date,
      cancelledAt: Date,
    },

    // Customer information
    customer: {
      name: String,
      email: String,
      phone: String,
    },

    // Receipt and invoice
    receipt: {
      receiptNumber: String,
      receiptUrl: String,
      invoiceNumber: String,
      invoiceUrl: String,
      generatedAt: Date,
    },

    // Gateway response data
    gatewayResponse: {
      rawResponse: mongoose.Schema.Types.Mixed,
      webhookData: mongoose.Schema.Types.Mixed,
      verificationStatus: {
        type: String,
        enum: ['pending', 'verified', 'failed'],
        default: 'pending',
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
paymentSchema.index({ application: 1 });
paymentSchema.index({ paymentId: 1 });
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ 'gateway.provider': 1 });

// Virtual for formatted total amount
paymentSchema.virtual('formattedTotal').get(function () {
  const { amount, currency } = this.amounts.totalAmount;
  return `${currency} ${amount.toFixed(2)}`;
});

// Virtual for payment age
paymentSchema.virtual('paymentAge').get(function () {
  return Math.floor(
    (Date.now() - this.dates.initiatedAt) / (1000 * 60 * 60 * 24)
  );
});

export default mongoose.model('Payment', paymentSchema);
