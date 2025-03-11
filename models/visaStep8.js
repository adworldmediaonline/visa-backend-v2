import mongoose from 'mongoose';

const visaStep8 = new mongoose.Schema(
  {
    formId: {
      type: String,
      ref: 'VisaRequestForm',
    },
    termsAndConditions: String,
    termsAndConditionsAgree: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
const VisaRequestForm8 = mongoose.model('VisaRequestForm8', visaStep8);
export default VisaRequestForm8;
