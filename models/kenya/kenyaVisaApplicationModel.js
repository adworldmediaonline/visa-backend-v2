import mongoose from 'mongoose';
import { customAlphabet } from 'nanoid';
const nanoid = customAlphabet('1234567890', 7);
const { Schema } = mongoose;

const kenyaVisaApplicationSchema = new Schema(
  {
    _id: {
      type: String,
      default: function () {
        return 'KENeTa' + nanoid();
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
      default: 'visa-details',
      lowercase: true,
    },
    visaDetails: {
      type: Schema.Types.ObjectId,
      ref: 'KenyaVisaDetails',
    },
    arrivalInfo: {
      type: Schema.Types.ObjectId,
      ref: 'KenyaArrivalInfo',
    },
    personalInfo: {
      type: Schema.Types.ObjectId,
      ref: 'KenyaPersonalInfo',
    },
    passportInfo: {
      type: Schema.Types.ObjectId,
      ref: 'KenyaPassportInfo',
    },
    documents: {
      type: Schema.Types.ObjectId,
      ref: 'KenyaVisaDocuments',
    },
    govRefDetails: {
      type: Schema.Types.ObjectId,
      ref: 'KenyaGovRefDetails',
    },
    declaration: {
      type: Schema.Types.ObjectId,
      ref: 'KenyaDeclaration',
    },
    additionalApplicants: [
      {
        personalInfo: {
          type: Schema.Types.ObjectId,
          ref: 'KenyaPersonalInfo',
        },
        passportInfo: {
          type: Schema.Types.ObjectId,
          ref: 'KenyaPassportInfo',
        },
        documents: {
          type: Schema.Types.ObjectId,
          ref: 'KenyaVisaDocuments',
        },
        govRefDetails: {
          type: Schema.Types.ObjectId,
          ref: 'KenyaGovRefDetails',
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
kenyaVisaApplicationSchema.virtual('isComplete').get(function () {
  return !!(
    this.visaDetails &&
    this.arrivalInfo &&
    this.personalInfo &&
    this.passportInfo
  );
});

// Pre-save middleware to update noOfVisa based on additionalApplicants
kenyaVisaApplicationSchema.pre('save', function (next) {
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

const KenyaVisaApplication = mongoose.model(
  'KenyaVisaApplication',
  kenyaVisaApplicationSchema
);
export default KenyaVisaApplication;
