import mongoose from 'mongoose';

const processingTimeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      value: {
        type: Number,
        required: true,
        min: 1,
      },
      unit: {
        type: String,
        enum: ['hours', 'days', 'weeks'],
        required: true,
        default: 'days',
      },
    },
    serviceFee: {
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
    isGlobal: {
      type: Boolean,
      default: true,
      description:
        'If true, applies to all visa rules. If false, link specific visa rules.',
    },
    applicableVisaRules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VisaRule',
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    metadata: {
      priority: {
        type: Number,
        default: 0,
        description: 'Higher number = higher priority in UI',
      },
      color: String,
      icon: String,
      features: [String],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
processingTimeSchema.index({ name: 1 });
processingTimeSchema.index({ code: 1 });
processingTimeSchema.index({ isActive: 1 });
processingTimeSchema.index({ isGlobal: 1 });
processingTimeSchema.index({ 'metadata.priority': -1 });

// Virtual for displaying duration as string
processingTimeSchema.virtual('durationDisplay').get(function () {
  return `${this.duration.value} ${this.duration.unit}`;
});

// Virtual for displaying service fee as formatted string
processingTimeSchema.virtual('serviceFeeDisplay').get(function () {
  return `${this.serviceFee.currency} ${this.serviceFee.amount}`;
});

export default mongoose.model('ProcessingTime', processingTimeSchema);
