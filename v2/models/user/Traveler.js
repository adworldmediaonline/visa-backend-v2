import mongoose from 'mongoose';

const travelerSchema = new mongoose.Schema(
  {
    // Reference to the main application
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
    },

    // Traveler type
    type: {
      type: String,
      enum: ['adult', 'child', 'infant'],
      default: 'adult',
    },

    // Relationship to main applicant
    relationshipToApplicant: {
      type: String,
      enum: [
        'spouse',
        'child',
        'parent',
        'sibling',
        'friend',
        'colleague',
        'other',
      ],
      required: true,
    },

    // Basic information
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    middleName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true,
    },

    // Nationality
    nationality: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Country',
      required: true,
    },

    // Passport information
    passport: {
      passportNumber: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
      },
      issuingCountry: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
        required: true,
      },
      issueDate: {
        type: Date,
        required: true,
      },
      expiryDate: {
        type: Date,
        required: true,
      },
      issuingAuthority: String,
    },

    // Contact information (for adults)
    contact: {
      email: {
        type: String,
        lowercase: true,
        trim: true,
      },
      phone: String,
    },

    // Documentation status
    documentation: {
      personalInfoComplete: {
        type: Boolean,
        default: false,
      },
      passportInfoComplete: {
        type: Boolean,
        default: false,
      },
      documentsUploaded: {
        type: Boolean,
        default: false,
      },
      allComplete: {
        type: Boolean,
        default: false,
      },
    },

    // For minors - guardian information
    guardian: {
      isRequired: {
        type: Boolean,
        default: false,
      },
      isMainApplicant: {
        type: Boolean,
        default: true,
      },
      guardianInfo: {
        name: String,
        relationship: String,
        phone: String,
        email: String,
      },
      consentLetter: {
        isRequired: {
          type: Boolean,
          default: false,
        },
        uploaded: {
          type: Boolean,
          default: false,
        },
        fileUrl: String,
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
travelerSchema.index({ application: 1 });
travelerSchema.index({ type: 1 });
travelerSchema.index({ 'passport.passportNumber': 1 });

// Virtual for full name
travelerSchema.virtual('fullName').get(function () {
  return `${
    this.firstName
  }${this.middleName ? ' ' + this.middleName : ''} ${this.lastName}`;
});

// Virtual for age
travelerSchema.virtual('age').get(function () {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
});

// Virtual for passport validity
travelerSchema.virtual('passportValidity').get(function () {
  if (!this.passport.expiryDate) return null;

  const today = new Date();
  const expiry = new Date(this.passport.expiryDate);
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

export default mongoose.model('Traveler', travelerSchema);
