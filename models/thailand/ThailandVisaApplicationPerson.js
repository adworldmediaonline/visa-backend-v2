import mongoose from 'mongoose';

const thailandVisaApplicationPersonSchema = new mongoose.Schema(
  {
    formId: { type: String, ref: 'ThailandVisaApplication' },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    nationality: { type: String, required: true },
    gender: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    countryOfBirth: { type: String, required: true },
    countryOfResidence: { type: String, required: true },
    passportNumber: { type: String, required: true },
    passportIssueDate: { type: String, required: true },
    passportExpirationDate: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const ThailandVisaApplicationPerson = mongoose.model(
  'ThailandVisaApplicationPerson',
  thailandVisaApplicationPersonSchema
);

export default ThailandVisaApplicationPerson;
