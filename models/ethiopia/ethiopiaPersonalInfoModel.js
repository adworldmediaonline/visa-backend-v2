import mongoose from 'mongoose';
const { Schema } = mongoose;

const ethiopiaPersonalInfoSchema = new Schema(
  {
    formId: { 
      type: String, 
      required: true,
      ref: 'EthiopiaVisaApplication'
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
      required: true 
    },
    gender: { 
      type: String, 
      required: true,
      enum: ['male', 'female', 'other']
    },
    countryOfBirth: { 
      type: String, 
      required: true 
    },
    dateOfBirth: { 
      type: Date, 
      required: true 
    },
    placeOfBirth: { 
      type: String, 
      required: true 
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
  },
  { timestamps: true }
);

const EthiopiaPersonalInfo = mongoose.model('EthiopiaPersonalInfo', ethiopiaPersonalInfoSchema);
export default EthiopiaPersonalInfo;
