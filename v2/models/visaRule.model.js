import mongoose from 'mongoose';

const formFieldSchema = new mongoose.Schema({
  name: { type: String, required: true },
  label: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: [
      'text',
      'email',
      'tel',
      'date',
      'select',
      'file',
      'textarea',
      'checkbox',
      'radio',
    ],
  },
  required: { type: Boolean, default: false },
  placeholder: { type: String },
  options: [
    {
      label: { type: String },
      value: { type: String },
    },
  ],
  validation: {
    pattern: { type: String },
    min: { type: Number },
    max: { type: Number },
    minLength: { type: Number },
    maxLength: { type: Number },
  },
});

const visaOptionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  visaType: { type: String, required: true },
  entryType: { type: String },
  validity: { type: String },
  stayPerVisit: { type: String },
  processingTime: { type: String },
  fee: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  governmentFeeDisplay: { type: String },
  badges: [
    {
      label: { type: String },
      color: { type: String },
    },
  ],
  requiredDocuments: [{ type: String }],
  description: { type: String },
  eligibility: { type: String },
  whatToKnow: { type: String },
  learnMore: { type: String },
  processingOptions: [
    {
      id: { type: String, required: true },
      name: { type: String, required: true },
      fee: { type: Number, required: true },
      currency: { type: String, default: 'INR' },
      processingTime: { type: String, required: true },
      description: { type: String },
      isDefault: { type: Boolean, default: false },
    },
  ],
  formConfig: {
    fields: [formFieldSchema],
  },
  isActive: { type: Boolean, default: true },
});

const visaRuleSchema = new mongoose.Schema(
  {
    passportCountry: {
      name: { type: String, required: true },
      code: { type: String, required: true, uppercase: true },
      flag: { type: String },
    },

    destinationCountry: {
      name: { type: String, required: true },
      code: { type: String, required: true, uppercase: true },
      flag: { type: String },
    },

    visaRequired: { type: Boolean, required: true },

    visaOptions: [visaOptionSchema],

    generalInfo: {
      description: { type: String },
      tips: [{ type: String }],
      importantNotes: [{ type: String }],
    },

    isActive: { type: Boolean, default: true },

    // For admin management
    createdBy: { type: String },
    lastUpdatedBy: { type: String },
  },
  {
    timestamps: true,
  }
);

// Indexes
visaRuleSchema.index(
  {
    'passportCountry.code': 1,
    'destinationCountry.code': 1,
  },
  { unique: true }
);

visaRuleSchema.index({ isActive: 1 });

// Methods
visaRuleSchema.methods.getActiveVisaOptions = function () {
  return this.visaOptions.filter(option => option.isActive);
};

visaRuleSchema.statics.findByCountries = function (fromCode, toCode) {
  return this.findOne({
    'passportCountry.code': fromCode.toUpperCase(),
    'destinationCountry.code': toCode.toUpperCase(),
    isActive: true,
  });
};

const VisaRule = mongoose.model('VisaRule', visaRuleSchema);

export default VisaRule;
