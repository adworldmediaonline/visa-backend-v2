import mongoose from 'mongoose';
const { Schema } = mongoose;

const ethiopiaVisaDetailsSchema = new Schema(
  {
    formId: {
      type: String,
      required: true,
      ref: 'EthiopiaVisaApplication',
    },
    visaType: {
      type: String,
      required: true,
    },
    visaValidity: {
      type: String,
      required: true,
    },
    companyReferenceNumber: {
      type: String,
    },
    visaFee: {
      type: Number,
      required: true,
    },
    attachments: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const EthiopiaVisaDetails = mongoose.model(
  'EthiopiaVisaDetails',
  ethiopiaVisaDetailsSchema
);
export default EthiopiaVisaDetails;
