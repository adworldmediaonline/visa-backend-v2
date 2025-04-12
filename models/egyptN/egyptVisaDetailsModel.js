import mongoose from 'mongoose';
const { Schema } = mongoose;

const EgyptVisaDetailsSchema = new Schema(
  {
    formId: {
      type: String,
      required: true,
      ref: 'EgyptVisaApplicationN'
    },
    visaType: {
      type: String,
      required: false
    },
    visaValidity: {
      type: String,
      required: false
    },
    visaFee: {
      type: Number,
      required: false
    },
    attachments: [{
      type: String
    }],
  },
  { timestamps: true }
);

const EgyptVisaDetails = mongoose.model('EgyptVisaDetails', EgyptVisaDetailsSchema);
export default EgyptVisaDetails;
