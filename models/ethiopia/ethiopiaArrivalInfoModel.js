import mongoose from 'mongoose';
const { Schema } = mongoose;

const ethiopiaArrivalInfoSchema = new Schema(
  {
    formId: { 
      type: String, 
      required: true,
      ref: 'EthiopiaVisaApplication'
    },
    arrivalDate: { 
      type: Date, 
      required: true 
    },
    departureCountry: { 
      type: String, 
      required: true 
    },
    departureCity: { 
      type: String, 
      required: true 
    },
    airline: { 
      type: String 
    },
    flightNumber: { 
      type: String 
    },
    accommodationType: { 
      type: String, 
      required: true 
    },
    accommodationName: { 
      type: String, 
      required: true 
    },
    accommodationCity: { 
      type: String, 
      required: true 
    },
    accommodationStreetAddress: { 
      type: String, 
      required: true 
    },
    accommodationTelephone: { 
      type: String, 
      required: true 
    },
  },
  { timestamps: true }
);

const EthiopiaArrivalInfo = mongoose.model('EthiopiaArrivalInfo', ethiopiaArrivalInfoSchema);
export default EthiopiaArrivalInfo;
