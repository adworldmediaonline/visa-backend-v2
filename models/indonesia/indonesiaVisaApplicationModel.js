import mongoose from 'mongoose';
import { customAlphabet } from 'nanoid';
const nanoid = customAlphabet('1234567890', 7);

const indonesiaVisaApplicationSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: function () {
        return 'indonesiaVisa' + nanoid();
      },
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    passportDateOfIssue: { type: String, required: true },
    countryOfCitizenship: {
      type: String,
      required: true,
    },
    passportCountry: { type: String, required: true },

    personalDetails: {
      surname: {
        type: String,
        required: true,
      },
      givenName: {
        type: String,
        required: true,
      },
      motherGivenName: {
        type: String,
      },
      gender: {
        type: String,
        required: true,
      },
      countryOfBirth: {
        type: String,
        required: true,
      },
      placeOfBirth: {
        type: String,
        required: true,
      },
    },

    passportDetails: {
      passportNumber: { type: String, required: true },
      passportExpiryDate: { type: String, required: true },
    },

    contactDetails: {
      emailAddress: { type: String, required: true },
      confirmEmailAddress: { type: String, required: true },
      phoneNumber: { type: String, required: true },
    },

    travelDetails: {
      intendedDateOfEntry: {
        type: Date,
        required: true,
      },
      intendedDateOfExit: {
        type: Date,
        required: true,
      },
      accommodationType: { type: String, required: true },
      accommodationAddress: { type: String, required: true },
      accommodationProvince: { type: String, required: true },
      travelingWithMinor: { type: String, default: 'no', required: true },
      numberOfMinor: { type: String, require: true },
      minorInformation: [
        {
          minorPassportNumber: { type: String, required: true },
        },
      ],
    },

    termsAndConditions: { type: Boolean, default: false },
    declareInformation: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const IndonesiaVisaApplication = mongoose.model(
  'IndonesiaVisaApplication',
  indonesiaVisaApplicationSchema
);

export default IndonesiaVisaApplication;
