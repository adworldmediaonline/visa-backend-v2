import mongoose from 'mongoose';
const { Schema } = mongoose;

const KenyaVisaDetailsSchema = new Schema(
  {
    formId: {
      type: String,
      required: true,
      ref: 'KenyaVisaApplication'
    },
    visaType: {
      type: String,
      required: false
    },
    visaValidity: {
      type: String,
      required: false
    },
    companyReferenceNumber: {
      type: String
    },
    visaFee: {
      type: Number,
      required: false
    },
    attachments: [{
      type: String
    }],
    reasonForTravel: {
      type: String,
      enum: [
        'Seaman (Fishing Vessel)',
        'Work',
        'Business',
        'Conference / Meetings / Seminars / Training',
        'Crew (planes or ships)',
        'Crew (Positioning)',
        'Tourism',
        'Friends & Family',
        'Medical Care',
        'Religious Visit',
        'Study / Education',
        'Transit'
      ],
      required: true
    }
  },
  { timestamps: true }
);

const KenyaVisaDetails = mongoose.model('KenyaVisaDetails', KenyaVisaDetailsSchema);
export default KenyaVisaDetails;
