import mongoose from 'mongoose';

const temporaryExitSchema = new mongoose.Schema({
  formId: {
    type: String,
    ref: 'VisaRequestForm',
  },
  visaLastTemporaryUrl: {
    type: String,
    default: null,
    // required: true,
  },
});

const TemporaryExit = mongoose.model('TemporaryExit', temporaryExitSchema);
export default TemporaryExit;
