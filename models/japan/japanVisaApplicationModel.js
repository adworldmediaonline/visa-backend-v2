import mongoose, { Schema } from 'mongoose';
import { customAlphabet } from 'nanoid';
const nanoid = customAlphabet('1234567890', 7);

const japanVisaApplicationSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: function () {
        return 'japanVisa' + nanoid();
      },
    },
    email: { type: String, required: true },
    arriveDestination: { type: Date, required: true },
    departDestination: { type: Date, required: true },
    destinationCountry: { type: String, required: true },
    emergencyContactEmail: { type: String, required: true },
    emergencyContactFullName: { type: String, required: true },
    emergencyContactPhoneNumber: { type: String, required: true },
    passportExpirationDate: { type: Date, required: true },
    peoples: [
      {
        type: Schema.Types.ObjectId,
        ref: 'JapanVisaApplicationPeople',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const JapanVisaApplication = mongoose.model(
  'JapanVisaApplication',
  japanVisaApplicationSchema
);

export default JapanVisaApplication;
