import mongoose from 'mongoose';

const personalInfoSchema = new mongoose.Schema(
  {
    // Reference to the main application
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
      unique: true,
    },

    // Basic personal information
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

    // Place of birth
    placeOfBirth: {
      city: String,
      state: String,
      country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
      },
    },

    // Gender and marital status
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer_not_to_say'],
      required: true,
    },
    maritalStatus: {
      type: String,
      enum: ['single', 'married', 'divorced', 'widowed', 'separated'],
      required: true,
    },

    // Nationality
    nationality: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Country',
      required: true,
    },

    // Contact information
    contact: {
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
      alternatePhone: String,
    },

    // Address information
    address: {
      current: {
        street: {
          type: String,
          required: true,
        },
        city: {
          type: String,
          required: true,
        },
        state: {
          type: String,
          required: true,
        },
        postalCode: {
          type: String,
          required: true,
        },
        country: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Country',
          required: true,
        },
      },
    },

    // Employment
    employment: {
      status: {
        type: String,
        enum: [
          'employed',
          'self_employed',
          'unemployed',
          'student',
          'retired',
          'other',
        ],
      },
      employer: {
        name: String,
        address: String,
        phone: String,
      },
      position: String,
      salary: {
        amount: Number,
        currency: String,
      },
    },

    // Emergency contact
    emergencyContact: {
      name: {
        type: String,
        required: true,
      },
      relationship: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      email: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
personalInfoSchema.index({ application: 1 });
personalInfoSchema.index({ 'contact.email': 1 });
personalInfoSchema.index({ nationality: 1 });

// Virtual for full name
personalInfoSchema.virtual('fullName').get(function () {
  return `${
    this.firstName
  }${this.middleName ? ' ' + this.middleName : ''} ${this.lastName}`;
});

// Virtual for age
personalInfoSchema.virtual('age').get(function () {
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

export default mongoose.model('PersonalInfo', personalInfoSchema);
