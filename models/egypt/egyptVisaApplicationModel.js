import mongoose, { Schema } from 'mongoose';
import { customAlphabet } from 'nanoid';
const nanoid = customAlphabet('1234567890', 7);

const egyptVisaApplicationSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: function () {
        return 'egyptVisa' + nanoid();
      },
    },

    typeOfVisa: {
      type: String,
      required: true,
    },
    numberOfVisa: { type: String, required: true },
    processingTime: { type: String, required: true, default: 'normal' },
    covidInsurance: { type: Boolean, default: false },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    communicationChannel: { type: String, required: true },
    communicationChannelNumberOrId: { type: String, required: true },

    visaDetails: {
      type: Schema.Types.ObjectId,
      ref: 'EgyptVisaDetail',
    },
  },
  {
    timestamps: true,
  }
);

const EgyptVisaApplication = mongoose.model(
  'EgyptVisaApplication',
  egyptVisaApplicationSchema
);

export default EgyptVisaApplication;
