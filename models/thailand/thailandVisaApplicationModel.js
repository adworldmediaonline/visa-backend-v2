import mongoose, { Schema } from 'mongoose';
import { customAlphabet } from 'nanoid';
const nanoid = customAlphabet('1234567890', 7);

const thailandVisaApplicationSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: function () {
        return 'thailandvisa' + nanoid();
      },
    },

    emailAddress: {
      type: String,
      required: true,
    },
    whenArriveDestination: {
      type: String,
      required: true,
    },
    whenDepartDestination: {
      type: String,
      required: true,
    },
    destinationCountry: {
      type: String,
      required: true,
    },
    emergencyContactEmail: {
      type: String,
      required: true,
    },
    emergencyContactFullName: {
      type: String,
      required: true,
    },
    emergencyContactCountryCodeAndPhoneNumber: {
      type: String,
      required: true,
    },

    persons: [
      { type: Schema.Types.ObjectId, ref: 'ThailandVisaApplicationPerson' },
    ],
  },
  { timestamps: true }
);

const ThailandVisaApplication = mongoose.model(
  'ThailandVisaApplication',
  thailandVisaApplicationSchema
);
export default ThailandVisaApplication;
