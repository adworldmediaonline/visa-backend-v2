import mongoose, { Schema } from 'mongoose';
import { customAlphabet } from 'nanoid';
const nanoid = customAlphabet('1234567890', 7);

const omanVisaApplicationSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: function () {
        return 'omanVisa' + nanoid();
      },
    },

    currentAddress: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    whatsappNumber: { type: String, required: true },
    email: { type: String, required: true },
    purposeOfVisit: { type: String, required: true },
    arrivalDate: { type: String, required: true },
    termsAndConditions: { type: Boolean, default: false },
    peoples: [
      {
        type: Schema.Types.ObjectId,
        ref: 'OmanVisaApplicationPeople',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const OmanVisaApplication = mongoose.model(
  'OmanVisaApplication',
  omanVisaApplicationSchema
);

export default OmanVisaApplication;
