import mongoose from 'mongoose';

const tripDetailsSchema = new mongoose.Schema(
  {
    // Reference to the main application
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
      unique: true,
    },

    // Trip dates
    arrivalDate: {
      type: Date,
      required: true,
    },
    departureDate: {
      type: Date,
      required: true,
    },

    // Purpose of travel
    purpose: {
      type: String,
      enum: [
        'tourism',
        'business',
        'medical',
        'education',
        'family_visit',
        'conference',
        'other',
      ],
      required: true,
    },
    purposeDetails: String,

    // Accommodation details
    accommodation: {
      type: {
        type: String,
        enum: ['hotel', 'friend_family', 'rental', 'other'],
      },
      name: String,
      address: {
        street: String,
        city: String,
        state: String,
        postalCode: String,
      },
      phone: String,
      email: String,
    },

    // Travel details
    travel: {
      arrivalFlight: {
        airline: String,
        flightNumber: String,
        arrivalTime: String,
      },
      departureFlight: {
        airline: String,
        flightNumber: String,
        departureTime: String,
      },
    },

    // Financial information
    financials: {
      estimatedExpenses: {
        amount: Number,
        currency: String,
      },
      fundingSource: {
        type: String,
        enum: ['personal', 'employer', 'sponsor', 'other'],
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
tripDetailsSchema.index({ application: 1 });

// Virtual for trip duration
tripDetailsSchema.virtual('tripDuration').get(function () {
  if (!this.arrivalDate || !this.departureDate) return null;
  const diffTime = this.departureDate - this.arrivalDate;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

export default mongoose.model('TripDetails', tripDetailsSchema);
