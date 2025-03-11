import mongoose from 'mongoose';

const omanVisaApplicationPeopleSchema = new mongoose.Schema(
  {
    formId: { type: String, ref: 'OmanVisaApplication' },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },

    nationality: {
      type: String,
      required: true,
    },
    entryType: {
      type: String,
      required: true,
    },

    gender: {
      type: String,
      required: true,
    },
    passportNumber: { type: String, required: true },
    passportColouredPhoto: { type: String, required: true },
    profilePhoto: { type: String, required: true },
    passportExpiryDate: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
const OmanVisaApplicationPeople = mongoose.model(
  'OmanVisaApplicationPeople',
  omanVisaApplicationPeopleSchema
);

export default OmanVisaApplicationPeople;
