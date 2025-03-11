import mongoose from 'mongoose';

const egyptVisaDetailSchema = new mongoose.Schema(
  {
    formId: { type: String, ref: 'EgyptVisaApplication' },
    passportDetails: [
      {
        idFullName: { type: String, required: true },
        gender: { type: String, required: true },
        dateOfBirth: { type: String, required: true },
        nationality: { type: String, required: true },
        passportNumber: { type: String, required: true },
      },
    ],
    orderDetails: {
      dateOfArrival: { type: String, required: true },
      dateOfDeparture: { type: String, required: true },
      specialRequest: { type: String, required: true },
    },
    termsAndConditions: { type: Boolean, required: true },
    confirmation: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  }
);

const EgyptVisaDetail = mongoose.model(
  'EgyptVisaDetail',
  egyptVisaDetailSchema
);

export default EgyptVisaDetail;
