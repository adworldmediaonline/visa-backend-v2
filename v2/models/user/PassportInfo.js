import mongoose from 'mongoose';

const passportInfoSchema = new mongoose.Schema(
  {
    // Reference to the main application
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
      unique: true,
    },

    // Passport details
    passportNumber: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    passportType: {
      type: String,
      enum: ['ordinary', 'diplomatic', 'official', 'service', 'other'],
      default: 'ordinary',
    },

    // Issuing information
    issuingAuthority: {
      type: String,
      required: true,
    },
    issuingCountry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Country',
      required: true,
    },

    // Important dates
    issueDate: {
      type: Date,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },

    // Place of issue
    placeOfIssue: {
      city: String,
      country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
      },
    },

    // Passport photo
    photo: {
      originalUrl: String,
      processedUrl: String,
      uploadedAt: Date,
      fileSize: Number,
      mimeType: String,
    },

    // Previous passports
    previousPassports: [
      {
        passportNumber: String,
        issueDate: Date,
        expiryDate: Date,
        issuingCountry: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Country',
        },
        status: {
          type: String,
          enum: ['expired', 'lost', 'stolen', 'damaged', 'cancelled'],
        },
      },
    ],

    // Validation
    validation: {
      isValid: {
        type: Boolean,
        default: false,
      },
      validityMonths: Number,
      meetsRequirements: {
        type: Boolean,
        default: false,
      },
      errors: [String],
      warnings: [String],
      validatedAt: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
passportInfoSchema.index({ application: 1 });
passportInfoSchema.index({ passportNumber: 1 });
passportInfoSchema.index({ issuingCountry: 1 });
passportInfoSchema.index({ expiryDate: 1 });

// Virtual for validity remaining
passportInfoSchema.virtual('validityRemaining').get(function () {
  if (!this.expiryDate) return null;

  const today = new Date();
  const expiry = new Date(this.expiryDate);
  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffMonths = Math.floor(diffDays / 30);

  return {
    days: diffDays,
    months: diffMonths,
    isExpired: diffDays <= 0,
    isExpiringSoon: diffDays <= 180,
  };
});

// Virtual for passport status
passportInfoSchema.virtual('passportStatus').get(function () {
  const validity = this.validityRemaining;
  if (!validity) return 'unknown';

  if (validity.isExpired) return 'expired';
  if (validity.isExpiringSoon) return 'expiring_soon';
  return 'valid';
});

export default mongoose.model('PassportInfo', passportInfoSchema);
