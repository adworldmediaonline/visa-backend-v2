import mongoose, { Schema } from 'mongoose';
import { customAlphabet } from 'nanoid';
const nanoid = customAlphabet('1234567890', 7);

const visaRequestFormSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: function () {
        return 'evisa' + nanoid();
      },
    },

    applicationType: {
      type: String,
      required: true,
    },
    nationalityRegion: {
      type: String,
      required: true,
    },
    passportType: {
      type: String,
      required: true,
    },
    portOfArrival: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: String,
      required: true,
    },
    emailId: {
      type: String,
      required: true,
    },
    reEmailId: {
      type: String,
      required: true,
    },
    contactNo: {
      type: String,
      required: true,
    },

    visaService: {
      type: String,
      required: true,
    },
    eEmergencyXMisc: {
      type: String,
    },
    eTouristVisa: {
      type: String,
    },
    eTouristVisa30Days: {
      type: String,
    },
    eTouristVisa1Year: {
      type: String,
    },
    eTouristVisa5Years: {
      type: String,
    },
    eMedicalVisa: {
      type: String,
    },
    eBusinessVisa: {
      type: String,
    },
    eConferenceVisa: {
      type: String,
    },
    eMedicalAttendantVisa: {
      type: String,
    },

    expectedDateOfArrival: {
      type: String,
      required: true,
    },

    lastExitStepUrl: {
      type: String,
      default: '/',
    },

    visaStatus: {
      type: String,
      default: 'incomplete',
    },

    paid: {
      type: Boolean,
      default: false,
    },

    price: {
      type: Number,
      default: 0,
    },

    termsAndConditions: {
      type: Boolean,
      default: false,
    },

    termsAndConditionsContent: {
      type: String,
    },

    step2: { type: Schema.Types.ObjectId, ref: 'VisaRequestForm2' },
    step3: { type: Schema.Types.ObjectId, ref: 'VisaRequestForm3' },
    step4: { type: Schema.Types.ObjectId, ref: 'VisaRequestForm4' },
    step5: { type: Schema.Types.ObjectId, ref: 'VisaRequestForm5' },
    step6: { type: Schema.Types.ObjectId, ref: 'VisaRequestForm6' },
    step8: { type: Schema.Types.ObjectId, ref: 'VisaRequestForm8' },
  },
  {
    timestamps: true,
  }
);

const VisaRequestForm = mongoose.model(
  'VisaRequestForm',
  visaRequestFormSchema
);
//
export default VisaRequestForm;
