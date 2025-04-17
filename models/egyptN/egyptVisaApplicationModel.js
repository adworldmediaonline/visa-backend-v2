import mongoose from 'mongoose';
import { customAlphabet } from 'nanoid';
const nanoid = customAlphabet('1234567890', 7);
const { Schema } = mongoose;

const egyptVisaApplicationSchema = new Schema(
  {
    _id: {
      type: String,
      default: function () {
        return 'EGYeVisa' + nanoid();
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
      ref: 'EgyptVisaDetails',
    },
    arrivalInfo: {
      type: Schema.Types.ObjectId,
      ref: 'EgyptArrivalInfo',
    },
    personalInfo: {
      type: Schema.Types.ObjectId,
      ref: 'EgyptPersonalInfo',
    },
    passportInfo: {
      type: Schema.Types.ObjectId,
      ref: 'EgyptPassportInfo',
    },
    documents: {
      type: Schema.Types.ObjectId,
      ref: 'EgyptVisaDocuments',
    },
    govRefDetails: {
      type: Schema.Types.ObjectId,
      ref: 'EgyptGovRefDetails',
    },
    declaration: {
      type: Schema.Types.ObjectId,
      ref: 'EgyptDeclaration',
    },
    additionalApplicants: [
      {
        personalInfo: {
          type: Schema.Types.ObjectId,
          ref: 'EgyptPersonalInfo',
        },
        passportInfo: {
          type: Schema.Types.ObjectId,
          ref: 'EgyptPassportInfo',
        },
        documents: {
          type: Schema.Types.ObjectId,
          ref: 'EgyptVisaDocuments',
        },
        govRefDetails: {
          type: Schema.Types.ObjectId,
          ref: 'EgyptGovRefDetails',
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
      enum: [
        "incomplete",
        "submitted",
        "pending document",
        "on hold",
        "pending",
        "form filled",
        "processed",
        "future processing",
        "visa granted",
        "visa email sent",
        "escalated",
        "visa declined",
        "refund pending",
        "refund completed",
        "payment disputed",
        "miscellaneous",
        "not interested",
        "chargeback",
      ],
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
egyptVisaApplicationSchema.virtual('isComplete').get(function () {
  return !!(
    this.visaDetails &&
    this.arrivalInfo &&
    this.personalInfo &&
    this.passportInfo
  );
});

// Pre-save middleware to update noOfVisa based on additionalApplicants
egyptVisaApplicationSchema.pre('save', function (next) {
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

const EgyptVisaApplicationN = mongoose.model(
  'EgyptVisaApplicationN',
  egyptVisaApplicationSchema
);
export default EgyptVisaApplicationN;
