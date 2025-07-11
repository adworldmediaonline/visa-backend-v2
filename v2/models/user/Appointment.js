import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    // Reference to the main application
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
      unique: true,
    },

    // Reference to appointment center
    appointmentCenter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AppointmentCenter',
      required: true,
    },

    // Appointment details
    scheduledDate: {
      type: Date,
      required: true,
    },
    scheduledTime: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      default: 30,
    },

    // Appointment status
    status: {
      type: String,
      enum: [
        'scheduled',
        'confirmed',
        'rescheduled',
        'cancelled',
        'completed',
        'no_show',
      ],
      default: 'scheduled',
    },

    // Confirmation details
    confirmation: {
      confirmationNumber: {
        type: String,
        unique: true,
      },
      confirmedAt: Date,
      confirmedBy: String,
    },

    // Special requirements
    specialRequirements: {
      accessibilityNeeds: String,
      languageSupport: String,
      interpreterRequired: {
        type: Boolean,
        default: false,
      },
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
appointmentSchema.index({ application: 1 });
appointmentSchema.index({ appointmentCenter: 1 });
appointmentSchema.index({ scheduledDate: 1 });
appointmentSchema.index({ status: 1 });

// Virtual for appointment date/time display
appointmentSchema.virtual('appointmentDateTime').get(function () {
  if (!this.scheduledDate || !this.scheduledTime) return null;
  const date = new Date(this.scheduledDate);
  return `${date.toDateString()} at ${this.scheduledTime}`;
});

export default mongoose.model('Appointment', appointmentSchema);
