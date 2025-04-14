import mongoose from 'mongoose';
const { Schema } = mongoose;

const EgyptArrivalInfoSchema = new Schema(
  {
    formId: {
      type: String,
      required: true,
      ref: 'EgyptVisaApplicationN'
    },
    travellingFrom: {
      type: String,
      required: true
    },
    arrivalDate: {
      type: Date,
      required: true
    },
    departureDate: {
      type: Date,
      required: true
    },
  },
  { timestamps: true }
);

const EgyptArrivalInfo = mongoose.model('EgyptArrivalInfo', EgyptArrivalInfoSchema);
export default EgyptArrivalInfo;
