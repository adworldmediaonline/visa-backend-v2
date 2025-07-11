import mongoose from 'mongoose';

const countrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    isoCode: {
      type: String,
      required: true,
      unique: true,
      length: 2,
      uppercase: true,
    },
    iso3Code: {
      type: String,
      required: true,
      unique: true,
      length: 3,
      uppercase: true,
    },
    flagUrl: {
      type: String,
      required: true,
    },
    dialCode: {
      type: String,
      required: true,
    },
    currency: {
      code: {
        type: String,
        required: true,
        length: 3,
        uppercase: true,
      },
      symbol: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    allowAsOrigin: {
      type: Boolean,
      default: true,
    },
    allowAsDestination: {
      type: Boolean,
      default: true,
    },
    metadata: {
      continent: String,
      region: String,
      subregion: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better performance
countrySchema.index({ name: 1 });
countrySchema.index({ isoCode: 1 });
countrySchema.index({ isActive: 1 });
countrySchema.index({ allowAsOrigin: 1 });
countrySchema.index({ allowAsDestination: 1 });

export default mongoose.model('Country', countrySchema);
