import mongoose from 'mongoose';

const appointmentCenterSchema = new mongoose.Schema(
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
    address: {
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
    contact: {
      phone: String,
      email: String,
      website: String,
    },
    operatingHours: {
      monday: {
        isOpen: { type: Boolean, default: true },
        openTime: String,
        closeTime: String,
      },
      tuesday: {
        isOpen: { type: Boolean, default: true },
        openTime: String,
        closeTime: String,
      },
      wednesday: {
        isOpen: { type: Boolean, default: true },
        openTime: String,
        closeTime: String,
      },
      thursday: {
        isOpen: { type: Boolean, default: true },
        openTime: String,
        closeTime: String,
      },
      friday: {
        isOpen: { type: Boolean, default: true },
        openTime: String,
        closeTime: String,
      },
      saturday: {
        isOpen: { type: Boolean, default: false },
        openTime: String,
        closeTime: String,
      },
      sunday: {
        isOpen: { type: Boolean, default: false },
        openTime: String,
        closeTime: String,
      },
    },
    location: {
      coordinates: {
        type: [Number],
        index: '2dsphere',
      },
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    capacity: {
      slotsPerDay: {
        type: Number,
        default: 50,
      },
      slotDuration: {
        type: Number,
        default: 30,
        description: 'Duration in minutes',
      },
    },
    metadata: {
      facilities: [String],
      languages: [String],
      notes: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
appointmentCenterSchema.index({ name: 1 });
appointmentCenterSchema.index({ code: 1 });
appointmentCenterSchema.index({ 'address.country': 1 });
appointmentCenterSchema.index({ 'address.city': 1 });
appointmentCenterSchema.index({ isActive: 1 });
appointmentCenterSchema.index({ location: '2dsphere' });

// Virtual for displaying full address
appointmentCenterSchema.virtual('fullAddress').get(function () {
  return `${this.address.street}, ${this.address.city}, ${this.address.state} ${this.address.postalCode}`;
});

export default mongoose.model('AppointmentCenter', appointmentCenterSchema);
