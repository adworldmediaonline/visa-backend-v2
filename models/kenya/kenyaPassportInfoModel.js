import mongoose from 'mongoose';
const { Schema } = mongoose;

const kenyaPassportInfoSchema = new Schema(
  {
    formId: {
      type: String,
      required: true,
      ref: 'KenyaVisaApplication'
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
    passportIssuingAuthority: {
      type: String,
      required: false
    },
  },
  { timestamps: true }
);

// Validation to ensure passport is not expired
kenyaPassportInfoSchema.pre('save', function (next) {
  const currentDate = new Date();
  if (this.passportExpiryDate < currentDate) {
    const error = new Error('Passport is expired');
    return next(error);
  }
  next();
});

const KenyaPassportInfo = mongoose.model('KenyaPassportInfo', kenyaPassportInfoSchema);
export default KenyaPassportInfo;
