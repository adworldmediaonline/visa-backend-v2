import mongoose from 'mongoose';

const japanVisaApplicationPeopleSchema = new mongoose.Schema(
  {
    formId: { type: String, ref: 'JapanVisaApplication' },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    nationality: { type: String, required: true },
    gender: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    countryOfBirth: { type: String, required: true },
    countryOfResidence: { type: String, required: true },
    passportNumber: { type: String, required: true },
    passportIssueDate: { type: Date, required: true },
    passportExpirationDate: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);
const JapanVisaApplicationPeople = mongoose.model(
  'JapanVisaApplicationPeople',
  japanVisaApplicationPeopleSchema
);

export default JapanVisaApplicationPeople;
