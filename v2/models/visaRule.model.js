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
  whatToKnow: { type: String },
  learnMore: { type: String },
  validityOptions: [
    {
      name: { type: String },
      validityTime: { type: String },
      entryType: { type: String },
      fee: { type: Number, required: true },
      isDefault: { type: Boolean, default: false },
    },
  ],

  processingOptions: [
    {
      name: { type: String, required: true },
      fee: { type: Number, required: true },
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

    embassyRegistration: {
      fee: { type: Number, required: true },
      description: { type: String },
      isDefault: { type: Boolean, default: false },
    },

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
