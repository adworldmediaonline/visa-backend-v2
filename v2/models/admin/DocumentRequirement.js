import mongoose from 'mongoose';

const documentRequirementSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
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
        'identity',
        'financial',
        'travel',
        'employment',
        'education',
        'medical',
        'other',
      ],
      required: true,
    },
    type: {
      type: String,
      enum: ['mandatory', 'optional', 'conditional'],
      required: true,
      default: 'mandatory',
    },
    applicableTo: {
      visaRules: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'VisaRule',
        },
      ],
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
    conditions: {
      age: {
        min: Number,
        max: Number,
      },
      travelPurpose: [String],
      nationality: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Country',
        },
      ],
      customConditions: [String],
    },
    specifications: {
      fileFormats: {
        type: [String],
        default: ['pdf', 'jpg', 'jpeg', 'png'],
      },
      maxFileSize: {
        type: Number,
        default: 5242880,
      },
      dimensions: {
        width: Number,
        height: Number,
        unit: {
          type: String,
          enum: ['px', 'mm', 'inch'],
          default: 'px',
        },
      },
      quality: String,
      colorRequirement: {
        type: String,
        enum: ['color', 'black_white', 'any'],
        default: 'any',
      },
    },
    validityRequirements: {
      minimumValidity: {
        value: Number,
        unit: {
          type: String,
          enum: ['days', 'months', 'years'],
          default: 'months',
        },
      },
      issuedWithin: {
        value: Number,
        unit: {
          type: String,
          enum: ['days', 'months', 'years'],
          default: 'months',
        },
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    metadata: {
      sampleUrl: String,
      helpText: String,
      sortOrder: {
        type: Number,
        default: 0,
      },
      icon: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
documentRequirementSchema.index({ name: 1 });
documentRequirementSchema.index({ code: 1 });
documentRequirementSchema.index({ category: 1 });
documentRequirementSchema.index({ type: 1 });
documentRequirementSchema.index({ isActive: 1 });
documentRequirementSchema.index({ 'applicableTo.visaRules': 1 });
documentRequirementSchema.index({ 'applicableTo.countries': 1 });
documentRequirementSchema.index({ 'applicableTo.visaTypes': 1 });
documentRequirementSchema.index({ 'metadata.sortOrder': 1 });

// Virtual for displaying file size in human readable format
documentRequirementSchema.virtual('maxFileSizeDisplay').get(function () {
  const bytes = this.specifications.maxFileSize;
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
});

export default mongoose.model('DocumentRequirement', documentRequirementSchema);
