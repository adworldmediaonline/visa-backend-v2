import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

const applicationSchema = new mongoose.Schema(
  {
    // Unique application reference number
    referenceNumber: {
      type: String,
      unique: true,
      default: () => `VA${nanoid(8).toUpperCase()}`,
    },

    // Application status tracking
    status: {
      type: String,
      enum: [
        'draft', // Application started but not submitted
        'in_progress', // Application in progress
        'submitted', // Application submitted, pending review
        'under_review', // Under admin review
        'approved', // Application approved
        'rejected', // Application rejected
        'cancelled', // Application cancelled by user
        'expired', // Application expired
      ],
      default: 'draft',
    },

    // Current step in the application process
    currentStep: {
      type: String,
      enum: [
        'eligibility', // Checking visa eligibility
        'trip_details', // Enter trip information
        'passport_upload', // Upload passport photo
        'personal_info', // Enter personal information
        'passport_details', // Enter passport details
        'additional_info', // Additional information
        'appointment', // Select appointment
        'travelers', // Add additional travelers
        'processing_time', // Select processing time
        'documents', // Upload required documents
        'review', // Review application
        'payment', // Payment process
        'submitted', // Application submitted
      ],
      default: 'eligibility',
    },

    // Progress tracking
    completedSteps: [
      {
        step: String,
        completedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Country and visa information (references to admin models)
    fromCountry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Country',
      required: true,
    },
    toCountry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Country',
      required: true,
    },
    visaType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VisaType',
      required: true,
    },
    visaRule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VisaRule',
      required: true,
    },

    // Selected processing time
    processingTime: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProcessingTime',
    },

    // Selected appointment center
    appointmentCenter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AppointmentCenter',
    },

    // Main applicant information
    applicant: {
      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
      },
      phone: {
        type: String,
        required: true,
      },
      firstName: String,
      lastName: String,
      dateOfBirth: Date,
    },

    // Application metadata
    metadata: {
      source: {
        type: String,
        enum: ['mobile_app', 'web', 'admin'],
        default: 'mobile_app',
      },
      deviceInfo: {
        platform: String,
        version: String,
        userAgent: String,
      },
      ipAddress: String,
      location: {
        country: String,
        city: String,
        coordinates: [Number], // [longitude, latitude]
      },
    },

    // Pricing calculation
    pricing: {
      governmentFee: {
        amount: Number,
        currency: String,
      },
      serviceFee: {
        amount: Number,
        currency: String,
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
        amount: Number,
        currency: String,
      },
      calculatedAt: Date,
    },

    // Payment information
    payment: {
      status: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending',
      },
      method: String,
      transactionId: String,
      paidAt: Date,
      paymentGateway: String,
    },

    // Submission tracking
    submission: {
      submittedAt: Date,
      submittedBy: String,
      notes: String,
    },

    // Admin review
    review: {
      reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      reviewedAt: Date,
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
      },
      notes: String,
      rejectionReason: String,
    },

    // Important dates
    dates: {
      arrivalDate: Date,
      departureDate: Date,
      expectedProcessingDate: Date,
      expiryDate: Date,
    },

    // Flags for tracking
    flags: {
      isUrgent: {
        type: Boolean,
        default: false,
      },
      requiresInterview: {
        type: Boolean,
        default: false,
      },
      requiresBiometrics: {
        type: Boolean,
        default: false,
      },
      hasAdditionalTravelers: {
        type: Boolean,
        default: false,
      },
      documentsComplete: {
        type: Boolean,
        default: false,
      },
      paymentComplete: {
        type: Boolean,
        default: false,
      },
    },

    // Communication preferences
    notifications: {
      email: {
        type: Boolean,
        default: true,
      },
      sms: {
        type: Boolean,
        default: true,
      },
      push: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for performance
applicationSchema.index({ referenceNumber: 1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ currentStep: 1 });
applicationSchema.index({ 'applicant.email': 1 });
applicationSchema.index({ 'applicant.phone': 1 });
applicationSchema.index({ fromCountry: 1, toCountry: 1 });
applicationSchema.index({ visaType: 1 });
applicationSchema.index({ createdAt: -1 });
applicationSchema.index({ 'submission.submittedAt': -1 });
applicationSchema.index({ 'payment.status': 1 });

// Compound indexes
applicationSchema.index({ status: 1, currentStep: 1 });
applicationSchema.index({ fromCountry: 1, toCountry: 1, visaType: 1 });

// Virtual for application age
applicationSchema.virtual('applicationAge').get(function () {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24)); // days
});

// Virtual for completion percentage
applicationSchema.virtual('completionPercentage').get(function () {
  const totalSteps = [
    'eligibility',
    'trip_details',
    'passport_upload',
    'personal_info',
    'passport_details',
    'additional_info',
    'appointment',
    'travelers',
    'processing_time',
    'documents',
    'review',
    'payment',
  ];
  return Math.round((this.completedSteps.length / totalSteps.length) * 100);
});

// Virtual for days since submission
applicationSchema.virtual('daysSinceSubmission').get(function () {
  if (!this.submission.submittedAt) return null;
  return Math.floor(
    (Date.now() - this.submission.submittedAt) / (1000 * 60 * 60 * 24)
  );
});

// Method to mark step as completed
applicationSchema.methods.markStepCompleted = function (step) {
  const existingStep = this.completedSteps.find(s => s.step === step);
  if (!existingStep) {
    this.completedSteps.push({ step, completedAt: new Date() });
  }
  return this.save();
};

// Method to move to next step
applicationSchema.methods.moveToNextStep = function (nextStep) {
  this.currentStep = nextStep;
  return this.save();
};

// Method to calculate pricing
applicationSchema.methods.calculatePricing = async function () {
  await this.populate(['visaRule', 'processingTime']);

  const governmentFee = this.visaRule.governmentFee;
  const processingFee = this.processingTime?.serviceFee || {
    amount: 0,
    currency: governmentFee.currency,
  };

  // Calculate service fee (this could be from ServiceFee model)
  const serviceFee = { amount: 1000, currency: governmentFee.currency };

  // Calculate tax (18% GST example)
  const subtotal =
    governmentFee.amount + processingFee.amount + serviceFee.amount;
  const taxRate = 18; // 18%
  const taxAmount = (subtotal * taxRate) / 100;

  const totalAmount = subtotal + taxAmount;

  this.pricing = {
    governmentFee: governmentFee,
    serviceFee: serviceFee,
    processingFee: processingFee,
    tax: {
      amount: taxAmount,
      rate: taxRate,
      type: 'GST',
    },
    totalAmount: {
      amount: totalAmount,
      currency: governmentFee.currency,
    },
    calculatedAt: new Date(),
  };

  return this.save();
};

export default mongoose.model('Application', applicationSchema);
