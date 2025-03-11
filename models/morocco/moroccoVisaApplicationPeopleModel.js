import mongoose from 'mongoose';

const moroccoVisaApplicationPeopleSchema = new mongoose.Schema(
  {
    formId: { type: String, ref: 'MoroccoVisaApplication' },
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
const MoroccoVisaApplicationPeople = mongoose.model(
  'MoroccoVisaApplicationPeople',
  moroccoVisaApplicationPeopleSchema
);

export default MoroccoVisaApplicationPeople;
