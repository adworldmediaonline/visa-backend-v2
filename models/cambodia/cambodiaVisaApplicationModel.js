import mongoose from 'mongoose';
import { customAlphabet } from 'nanoid';
const nanoid = customAlphabet('1234567890', 7);

const cambodiaVisaApplicationSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: function () {
        return 'cambodiaVisa' + nanoid();
      },
    },
    dateOfBirth: {
      type: String,
      required: true,
    },
    passportDateOfIssue: { type: String, required: true },
    personalDetails: {
      familyName: {
        type: String,
        required: true,
      },
      firstName: {
        type: String,
        required: true,
      },
      middleName: {
        type: String,
      },

      countryOfBirth: {
        type: String,
        required: true,
      },
      countryOfCitizenship: {
        type: String,
        required: true,
      },
      gender: {
        type: String,
        required: true,
      },
    },

    passportDetails: {
      passportCountry: { type: String },
      passportNumber: { type: String, required: true },

      passportExpiryDate: { type: String, required: true },
    },

    contactDetails: {
      emailAddress: { type: String, required: true },
      confirmEmailAddress: { type: String, required: true },
      phoneNumber: { type: String, required: true },
    },

    travelDetails: {
      portOfEntry: {
        type: String,
        required: true,
      },
      proposedDateOfEntry: {
        type: String,
        required: true,
      },
      touristPurpose: { type: String, required: true },
      purposeOfVisit: { type: String },
    },

    termsAndConditions: { type: Boolean, default: false },
    declareInformation: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const CambodiaVisaApplication = mongoose.model(
  'CambodiaVisaApplication',
  cambodiaVisaApplicationSchema
);

export default CambodiaVisaApplication;
