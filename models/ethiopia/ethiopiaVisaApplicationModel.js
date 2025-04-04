import mongoose from 'mongoose';
import { customAlphabet } from 'nanoid';
const nanoid = customAlphabet('1234567890', 7);
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
      lowercase: true,
    },
    lastExitUrl: {
      type: String,
      true: true,
      lowercase: true,
    },
    visaDetails: {
      type: Schema.Types.ObjectId,
      ref: 'EthiopiaVisaDetails',
    },
    arrivalInfo: {
      type: Schema.Types.ObjectId,
      ref: 'EthiopiaArrivalInfo',
    },
    personalInfo: {
      type: Schema.Types.ObjectId,
      ref: 'EthiopiaPersonalInfo',
    },
    passportInfo: {
      type: Schema.Types.ObjectId,
      ref: 'EthiopiaPassportInfo',
    },
    documents: {
      type: Schema.Types.ObjectId,
      ref: 'EthiopiaVisaDocuments',
    },
    govRefDetails: {
      type: Schema.Types.ObjectId,
      ref: 'EthiopiaGovRefDetails',
    },
    additionalApplicants: [
      {
        personalInfo: {
          type: Schema.Types.ObjectId,
          ref: 'EthiopiaPersonalInfo',
        },
        passportInfo: {
          type: Schema.Types.ObjectId,
          ref: 'EthiopiaPassportInfo',
        },
        documents: {
          type: Schema.Types.ObjectId,
          ref: 'EthiopiaVisaDocuments',
        },
        govRefDetails: {
          type: Schema.Types.ObjectId,
          ref: 'EthiopiaGovRefDetails',
        },
      },
    ],
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['stripe', 'razorpay'],
      default: 'stripe',
    },
    paymentId: {
      type: String,
    },
    paymentAmount: {
      type: Number,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    applicationStatus: {
      type: String,
      enum: ['incomplete', 'submitted', 'processing', 'approved', 'rejected'],
      default: 'incomplete',
    },
    noOfVisa: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add virtual property to check if application is complete
ethiopiaVisaApplicationSchema.virtual('isComplete').get(function () {
  return !!(
    this.visaDetails &&
    this.arrivalInfo &&
    this.personalInfo &&
    this.passportInfo
  );
});

// Pre-save middleware to update noOfVisa based on additionalApplicants
ethiopiaVisaApplicationSchema.pre('save', function (next) {
  // Primary applicant counts as 1
  let totalApplicants = 1;

  // Add the number of additional applicants
  if (this.additionalApplicants && this.additionalApplicants.length > 0) {
    // Only count additional applicants that have both personalInfo and passportInfo
    const validAdditionalApplicants = this.additionalApplicants.filter(
      applicant => applicant.personalInfo && applicant.passportInfo
    );
    totalApplicants += validAdditionalApplicants.length;
  }

  // Update the noOfVisa field
  this.noOfVisa = totalApplicants;

  next();
});

const EthiopiaVisaApplication = mongoose.model(
  'EthiopiaVisaApplication',
  ethiopiaVisaApplicationSchema
);
export default EthiopiaVisaApplication;
