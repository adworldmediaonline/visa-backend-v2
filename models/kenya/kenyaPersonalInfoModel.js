import mongoose from 'mongoose';
const { Schema } = mongoose;

const KenyaPersonalInfoSchema = new Schema(
  {
    formId: {
      type: String,
      required: true,
      ref: 'KenyaVisaApplication'
    },
    givenName: {
      type: String,
      required: true,
      trim: true
    },
    surname: {
      type: String,
      required: true,
      trim: true
    },
    citizenship: {
      type: String,
      required: false
    },
    gender: {
      type: String,
      required: true,
      enum: ['male', 'female', 'other']
    },
    maritalStatus: {
      type: String,
      required: true,
      enum: ['single', 'married', 'divorced', 'widowed']
    },
    countryOfBirth: {
      type: String,
      required: true
    },
    dateOfBirth: {
      type: Date,
      required: false
    },
    placeOfBirth: {
      type: String,
      required: false
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phoneNumber: {
      type: String,
      required: true
    },
    occupation: {
      type: String,
      required: true
    },
    streetAddress: {
      type: String,
      required: true
    },
    addressCity: {
      type: String,
      required: true
    },
    addressCountry: {
      type: String,
      required: true
    },
    emergencyContactName: {
      type: String,
      required: false
    },
    emergencyContactPhone: {
      type: String,
      required: false
    },
  },
  { timestamps: true }
);

const KenyaPersonalInfo = mongoose.model('KenyaPersonalInfo', KenyaPersonalInfoSchema);
export default KenyaPersonalInfo;
