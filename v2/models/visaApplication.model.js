import mongoose from 'mongoose';

const visaApplicationSchema = new mongoose.Schema(
  {
    applicationId: {
      type: String,
      required: true,
      unique: true,
      default: function () {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        return `VISA-${timestamp}-${random}`.toUpperCase();
      },
    },

    passportCountry: {
      name: { type: String, required: true },
      code: { type: String, required: true },
      flag: { type: String },
    },

    destinationCountry: {
      name: { type: String, required: true },
      code: { type: String, required: true },
      flag: { type: String },
    },

    visaType: {
      type: String,
      required: false, // Set when user selects visa option
    },

    visaOptionName: {
      type: String,
      required: false, // E.g., "United Kingdom ETA"
    },

    formData: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },

    stepCompleted: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },

    status: {
      type: String,
      enum: ['in_progress', 'pending', 'approved', 'rejected', 'cancelled'],
      default: 'in_progress',
    },

    payment: {
      isPaid: { type: Boolean, default: false },
      method: { type: String }, // 'razorpay', 'stripe', 'paypal'
      amount: { type: Number },
      currency: { type: String, default: 'INR' },
      paymentId: { type: String }, // External payment ID
      paidAt: { type: Date },
    },

    documents: [
      {
        name: { type: String, required: true },
        url: { type: String, required: true },
        type: { type: String, required: true }, // 'passport', 'photo', 'document'
        uploadedAt: { type: Date, default: Date.now },
      },
    ],

    submittedAt: { type: Date },
    lastUpdatedAt: { type: Date, default: Date.now },

    // For admin tracking
    adminNotes: { type: String },
    processedBy: { type: String },

    // Email and communication
    emailAddress: { type: String },
    phoneNumber: { type: String },

    // Metadata for analytics
    source: { type: String, default: 'mobile' }, // 'web', 'mobile', 'api'
    userAgent: { type: String },
    ipAddress: { type: String },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
visaApplicationSchema.index({ applicationId: 1 });
visaApplicationSchema.index({ status: 1 });
visaApplicationSchema.index({ passportCountry: 1, destinationCountry: 1 });
visaApplicationSchema.index({ createdAt: -1 });

// Update lastUpdatedAt on save
visaApplicationSchema.pre('save', function (next) {
  this.lastUpdatedAt = new Date();
  next();
});

// Methods
visaApplicationSchema.methods.updateFormData = function (newData) {
  if (!this.formData) {
    this.formData = new Map();
  }

  Object.entries(newData).forEach(([key, value]) => {
    this.formData.set(key, value);
  });

  this.markModified('formData');
  return this;
};

visaApplicationSchema.methods.getFormData = function () {
  const data = {};
  if (this.formData) {
    this.formData.forEach((value, key) => {
      data[key] = value;
    });
  }
  return data;
};

visaApplicationSchema.methods.markSubmitted = function () {
  this.status = 'pending';
  this.submittedAt = new Date();
  return this;
};

const VisaApplication = mongoose.model(
  'VisaApplication',
  visaApplicationSchema
);

export default VisaApplication;
