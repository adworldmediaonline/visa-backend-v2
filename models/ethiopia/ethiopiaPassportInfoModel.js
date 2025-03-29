import mongoose from 'mongoose';
const { Schema } = mongoose;

const ethiopiaPassportInfoSchema = new Schema(
  {
    formId: { 
      type: String, 
      required: true,
      ref: 'EthiopiaVisaApplication'
    },
    passportType: { 
      type: String, 
      required: true 
    },
    passportNumber: { 
      type: String, 
      required: true 
    },
    passportIssueDate: { 
      type: Date, 
      required: true 
    },
    passportExpiryDate: { 
      type: Date, 
      required: true 
    },
    passportIssuingCountry: { 
      type: String, 
      required: true 
    },
    passportIssuingAuthority: { 
      type: String, 
      required: true 
    },
  },
  { timestamps: true }
);

// Validation to ensure passport is not expired
ethiopiaPassportInfoSchema.pre('save', function(next) {
  const currentDate = new Date();
  if (this.passportExpiryDate < currentDate) {
    const error = new Error('Passport is expired');
    return next(error);
  }
  next();
});

const EthiopiaPassportInfo = mongoose.model('EthiopiaPassportInfo', ethiopiaPassportInfoSchema);
export default EthiopiaPassportInfo;
