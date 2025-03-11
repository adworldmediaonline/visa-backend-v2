import mongoose from 'mongoose';
import { customAlphabet } from 'nanoid';
const nanoid = customAlphabet('1234567890', 7);

const turkeyVisaApplicationVisaSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: function () {
        return 'turkeyVisa' + nanoid();
      },
    },

    countryCitizenship: {
      type: String,
      required: true,
    },
    arrivalDate: {
      type: String,
      required: true,
    },
    passportDetails: [
      {
        fullName: {
          type: String,
          required: true,
        },
        nationality: {
          type: String,
          required: true,
        },
        passportNumber: {
          type: String,
          required: true,
        },
        dateOfBirth: {
          type: String,
          required: true,
        },
      },
    ],
    contactDetailsFullName: {
      type: String,
      required: true,
    },
    contactDetailsAddress: { type: String, required: true },
    contactDetailsEmail: { type: String, required: true },
    contactDetailsContactNumber: { type: String, required: true },
    numberOfEntries: { type: String, required: true },
    visaDuration: { type: String, required: true },
    yourStayCannotExceed: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const TurkeyVisaApplication = mongoose.model(
  'TurkeyVisaApplication',
  turkeyVisaApplicationVisaSchema
);

export default TurkeyVisaApplication;
