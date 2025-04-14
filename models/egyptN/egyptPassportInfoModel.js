import mongoose from 'mongoose';
const { Schema } = mongoose;

const egyptPassportInfoSchema = new Schema(
  {
    formId: {
      type: String,
      required: true,
      ref: 'EgyptVisaApplicationN'
    },
    passportType: {
      type: String,
      required: false
    },
    passportNumber: {
      type: String,
      required: true
    },
    passportIssueDate: {
      type: Date,
      required: true
    },
    passportExpiryDate: {
      type: Date,
      required: true
    },
    passportIssuingCountry: {
      type: String,
      required: false
    },
  },
  { timestamps: true }
);

// Validation to ensure passport is not expired
egyptPassportInfoSchema.pre('save', function (next) {
  const currentDate = new Date();
  if (this.passportExpiryDate < currentDate) {
    const error = new Error('Passport is expired');
    return next(error);
  }
  next();
});

const EgyptPassportInfo = mongoose.model('EgyptPassportInfo', egyptPassportInfoSchema);
export default EgyptPassportInfo;
