import mongoose from 'mongoose';

const visaRuleSchema = new mongoose.Schema(
  {
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
    isVisaAvailable: {
      type: Boolean,
      default: true,
    },
    validity: {
      value: {
        type: Number,
        required: true,
      },
      unit: {
        type: String,
        enum: ['days', 'months', 'years'],
        required: true,
      },
    },
    entryType: {
      type: String,
      enum: ['single', 'multiple', 'double'],
      required: true,
      default: 'single',
    },
    governmentFee: {
      amount: {
        type: Number,
        required: true,
        min: 0,
      },
      currency: {
        type: String,
        required: true,
        length: 3,
        uppercase: true,
      },
    },
    processingTimeRange: {
      min: {
        type: Number,
        required: true,
        min: 1,
      },
      max: {
        type: Number,
        required: true,
        min: 1,
      },
      unit: {
        type: String,
        enum: ['hours', 'days', 'weeks'],
        default: 'days',
      },
    },
    requirements: {
      minimumValidityRequired: {
        type: Number,
        default: 6,
      },
      blankPagesRequired: {
        type: Number,
        default: 2,
      },
      biometricRequired: {
        type: Boolean,
        default: false,
      },
      interviewRequired: {
        type: Boolean,
        default: false,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    metadata: {
      description: String,
      notes: String,
      lastUpdatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound indexes for performance and uniqueness
visaRuleSchema.index(
  { fromCountry: 1, toCountry: 1, visaType: 1 },
  { unique: true }
);
visaRuleSchema.index({ fromCountry: 1 });
visaRuleSchema.index({ toCountry: 1 });
visaRuleSchema.index({ visaType: 1 });
visaRuleSchema.index({ isActive: 1 });
visaRuleSchema.index({ isVisaAvailable: 1 });

// Virtual for displaying validity as string
visaRuleSchema.virtual('validityDisplay').get(function () {
  return `${this.validity.value} ${this.validity.unit}`;
});

// Virtual for displaying government fee as formatted string
visaRuleSchema.virtual('governmentFeeDisplay').get(function () {
  return `${this.governmentFee.currency} ${this.governmentFee.amount}`;
});

export default mongoose.model('VisaRule', visaRuleSchema);
