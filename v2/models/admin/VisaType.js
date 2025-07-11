import mongoose from 'mongoose';

const visaTypeSchema = new mongoose.Schema(
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
    category: {
      type: String,
      enum: [
        'tourist',
        'business',
        'transit',
        'student',
        'work',
        'medical',
        'other',
      ],
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    metadata: {
      icon: String,
      color: String,
      sortOrder: {
        type: Number,
        default: 0,
      },
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
visaTypeSchema.index({ name: 1 });
visaTypeSchema.index({ code: 1 });
visaTypeSchema.index({ category: 1 });
visaTypeSchema.index({ isActive: 1 });
visaTypeSchema.index({ 'metadata.sortOrder': 1 });

export default mongoose.model('VisaType', visaTypeSchema);
