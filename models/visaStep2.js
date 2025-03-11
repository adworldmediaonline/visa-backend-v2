import mongoose from 'mongoose';

const visaStep2 = new mongoose.Schema(
  {
    formId: {
      type: String,
      ref: 'VisaRequestForm',
    },
    firstName: String,
    lastName: String,
    changedName: Boolean,
    previousName: String,
    previousLastName: String,
    gender: String,
    dateOfBirth: String,
    townCityOfBirth: String,
    countryRegionOfBirth: String,
    citizenshipNationalID: String,
    religion: String,
    religionOther: String,
    visibleIdentificationMarks: String,
    educationalQualification: String,
    nationalityRegion: String,
    acquireNationality: String,
    previousNationality: String,
    haveLivedInApplyingCountry: String,
    passportNumber: String,
    placeOfIssue: String,
    dateOfIssue: String,
    dateOfExpiry: String,
    countryOfIssue: String,
    anyOtherPassport: String,
    passportICNumber: String,
    dateOfIssuePassportIC: String,
    placeOfIssuePassportIC: String,
    passportNationalityMentionedTherein: String,
  },
  {
    timestamps: true,
  }
);
const VisaRequestForm2 = mongoose.model('VisaRequestForm2', visaStep2);
export default VisaRequestForm2;
