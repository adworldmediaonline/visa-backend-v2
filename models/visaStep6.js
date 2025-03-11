import mongoose from 'mongoose';

const visaStep6 = new mongoose.Schema(
  {
    formId: {
      type: String,
      ref: 'VisaRequestForm',
    },
    profilePicture: {
      type: String,
    },
    passport: {
      type: [String],
      required: true,
    },
    businessCard: {
      type: [String],
      required: true,
    },
    eMedicalCard: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const VisaRequestForm6 = mongoose.model('VisaRequestForm6', visaStep6);
export default VisaRequestForm6;
