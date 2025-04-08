import mongoose from 'mongoose';
const { Schema } = mongoose;

const KenyaArrivalInfoSchema = new Schema(
  {
    formId: {
      type: String,
      required: true,
      ref: 'KenyaVisaApplication'
    },
    arrivalDate: {
      type: Date,
      required: true
    },

    // Arrival
    arrivingBy: {
      type: String,
      enum: ["By Air", "By Sea", "By Land"],
      required: true
    },
    // By Air
    arrivalAirline: {
      type: String
    },
    arrivalFlightNumber: {
      type: String
    },
    arrivalAirPort: {
      type: String
    },
    originCountry: {
      type: String,
      required: false
    },
    // By Sea
    arrivalVesselName: {
      type: String,
      required: false
    },
    arrivalSeaPort: {
      type: String,
      required: false
    },
    // By Land
    landBorderCrossing: {
      type: String,
      required: false
    },

    // Departure
    departureBy: {
      type: String,
      enum: ["By Air", "By Sea", "By Land"],
      required: true
    },
    // By Air
    departureAirline: {
      type: String
    },
    departureFlightNumber: {
      type: String
    },
    departureAirPort: {
      type: String
    },
    destinationCountry: {
      type: String,
      required: false
    },
    // By Sea
    departureVesselName: {
      type: String,
      required: false
    },
    departureSeaPort: {
      type: String,
      required: false
    },
    // By Land
    departureLandBorderCrossing: {
      type: String,
      required: false
    },

    // Accommodation
    accommodationName: {
      type: String,
      required: true
    },
    accommodationFromDate: {
      type: Date,
      required: true
    },
    accommodationToDate: {
      type: Date,
      required: true
    },
  },
  { timestamps: true }
);

const KenyaArrivalInfo = mongoose.model('KenyaArrivalInfo', KenyaArrivalInfoSchema);
export default KenyaArrivalInfo;
