import mongoose from 'mongoose';

const singaporeVisaApplicationPeopleSchema = new mongoose.Schema(
  {
    formId: { type: String, ref: 'SingaporeVisaApplication' },
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
const SingaporeVisaApplicationPeople = mongoose.model(
  'SingaporeVisaApplicationPeople',
  singaporeVisaApplicationPeopleSchema
);

export default SingaporeVisaApplicationPeople;
