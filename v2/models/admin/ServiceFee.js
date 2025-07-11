import mongoose from 'mongoose';

const serviceFeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['global', 'country_specific', 'visa_type_specific'],
      required: true,
      default: 'global',
    },
    applicableTo: {
      countries: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Country',
        },
      ],
      visaTypes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'VisaType',
        },
      ],
    },
    fee: {
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
      isPercentage: {
        type: Boolean,
        default: false,
      },
      percentageOf: {
        type: String,
        enum: ['government_fee', 'total_amount'],
        required: function () {
          return this.fee.isPercentage;
        },
      },
    },
    tax: {
      isApplicable: {
        type: Boolean,
        default: true,
      },
      type: {
        type: String,
        enum: ['gst', 'vat', 'sales_tax', 'other'],
        default: 'gst',
      },
      rate: {
        type: Number,
        min: 0,
        max: 100,
        default: 18,
      },
      isInclusive: {
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
      terms: String,
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

// Indexes
serviceFeeSchema.index({ name: 1 });
serviceFeeSchema.index({ type: 1 });
serviceFeeSchema.index({ isActive: 1 });
serviceFeeSchema.index({ 'applicableTo.countries': 1 });
serviceFeeSchema.index({ 'applicableTo.visaTypes': 1 });

// Virtual for displaying fee as formatted string
serviceFeeSchema.virtual('feeDisplay').get(function () {
  if (this.fee.isPercentage) {
    return `${this.fee.amount}% of ${this.fee.percentageOf.replace('_', ' ')}`;
  }
  return `${this.fee.currency} ${this.fee.amount}`;
});

// Virtual for displaying tax info
serviceFeeSchema.virtual('taxDisplay').get(function () {
  if (!this.tax.isApplicable) return 'No tax';
  const inclusive = this.tax.isInclusive ? 'inclusive' : 'exclusive';
  return `${this.tax.rate}% ${this.tax.type.toUpperCase()} (${inclusive})`;
});

export default mongoose.model('ServiceFee', serviceFeeSchema);
