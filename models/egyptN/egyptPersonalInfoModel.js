import mongoose from 'mongoose';
const { Schema } = mongoose;

const EgyptPersonalInfoSchema = new Schema(
  {
    formId: {
      type: String,
      required: true,
      ref: 'EgyptVisaApplicationN'
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
    }
  },
  { timestamps: true }
);

const EgyptPersonalInfo = mongoose.model('EgyptPersonalInfo', EgyptPersonalInfoSchema);
export default EgyptPersonalInfo;
