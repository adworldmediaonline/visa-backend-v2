import mongoose from 'mongoose';
import VisaRequestForm from './visa.js';

const visaStep5 = new mongoose.Schema(
  {
    formId: {
      type: String,
      ref: 'VisaRequestForm',
    },
    haveYouBeenArrested: {
      type: String,
      default: '',
    },
    haveYouBeenRefusedEntry: {
      type: String,
      default: '',
    },
    haveYouBeenEngagedInTrafficking: {
      type: String,
      default: '',
    },
    haveYouBeenEngagedInCrime: {
      type: String,
      default: '',
    },
    haveYouExpressedViews: {
      type: String,
      default: '',
    },
    haveYouSoughtAsylum: {
      type: String,
      default: '',
    },
    declaration: {
      type: Boolean,
      default: false,
    },
    haveYouBeenArrestedInput: {
      type: String,
      default: '',
    },
    haveYouBeenRefusedEntryInput: {
      type: String,
      default: '',
    },
    haveYouBeenEngagedInTraffickingInput: {
      type: String,
      default: '',
    },
    haveYouBeenEngagedInCrimeInput: {
      type: String,
      default: '',
    },
    haveYouExpressedViewsInput: {
      type: String,
      default: '',
    },
    haveYouSoughtAsylumInput: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);
const VisaRequestForm5 = mongoose.model('VisaRequestForm5', visaStep5);
export default VisaRequestForm5;
