import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

const { Schema } = mongoose;

const ethiopiaVisaApplicationSchema = new Schema(
  {
    _id: {
      type: String,
      default: function () {
        return 'ETHevisa' + nanoid();
      },
    },
    emailAddress: { 
      type: String, 
      required: true,
      trim: true,
      lowercase: true 
    },
    visaDetails: { 
      type: Schema.Types.ObjectId, 
      ref: 'EthiopiaVisaDetails' 
    },
    arrivalInfo: { 
      type: Schema.Types.ObjectId, 
      ref: 'EthiopiaArrivalInfo' 
    },
    personalInfo: { 
      type: Schema.Types.ObjectId, 
      ref: 'EthiopiaPersonalInfo' 
    },
    passportInfo: { 
      type: Schema.Types.ObjectId, 
      ref: 'EthiopiaPassportInfo' 
    },
    paymentStatus: { 
      type: String, 
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
    },
    applicationStatus: {
      type: String,
      enum: ['incomplete', 'submitted', 'processing', 'approved', 'rejected'],
      default: 'incomplete'
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Add virtual property to check if application is complete
ethiopiaVisaApplicationSchema.virtual('isComplete').get(function() {
  return !!(this.visaDetails && this.arrivalInfo && this.personalInfo && this.passportInfo);
});

const EthiopiaVisaApplication = mongoose.model('EthiopiaVisaApplication', ethiopiaVisaApplicationSchema);
export default EthiopiaVisaApplication;
