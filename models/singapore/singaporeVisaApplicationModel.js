import mongoose, { Schema } from 'mongoose';
import { customAlphabet } from 'nanoid';
const nanoid = customAlphabet('1234567890', 7);

const singaporeVisaApplicationSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: function () {
        return 'singaporeVisa' + nanoid();
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
        ref: 'SingaporeVisaApplicationPeople',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const SingaporeVisaApplication = mongoose.model(
  'SingaporeVisaApplication',
  singaporeVisaApplicationSchema
);

export default SingaporeVisaApplication;
