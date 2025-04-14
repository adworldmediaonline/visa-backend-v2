import mongoose from 'mongoose';
const { Schema } = mongoose;

const egyptVisaDocumentsSchema = new Schema(
  {
    visaApplicationId: {
      type: String,
      required: true,
      ref: 'EgyptVisaApplication',
    },
    applicantType: {
      type: String,
      enum: ['primary', 'additional'],
      default: 'primary',
    },
    additionalApplicantIndex: {
      type: Number,
      default: null,
    },
    documents: {
      passport: {
        secure_url: String,
        public_id: String,
        fileName: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
      photo: {
        secure_url: String,
        public_id: String,
        fileName: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
      applicationLetter: {
        secure_url: String,
        public_id: String,
        fileName: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
      supportLetter: {
        secure_url: String,
        public_id: String,
        fileName: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
      invitationLetter: {
        secure_url: String,
        public_id: String,
        fileName: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
      invitingCompanyInfo: {
        secure_url: String,
        public_id: String,
        fileName: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
      registrationLicense: {
        secure_url: String,
        public_id: String,
        fileName: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
      businessLicense: {
        secure_url: String,
        public_id: String,
        fileName: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
      tinCertificate: {
        secure_url: String,
        public_id: String,
        fileName: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
      foreignInvestorEmployeeVisa: {
        secure_url: String,
        public_id: String,
        fileName: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
      acceptanceLetter: {
        secure_url: String,
        public_id: String,
        fileName: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
      bankStatement: {
        secure_url: String,
        public_id: String,
        fileName: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
      companyProfile: {
        secure_url: String,
        public_id: String,
        fileName: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    },
    isComplete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const EgyptVisaDocuments = mongoose.model(
  'EgyptVisaDocuments',
  egyptVisaDocumentsSchema
);
export default EgyptVisaDocuments;
