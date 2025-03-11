import mongoose from 'mongoose';
import { customAlphabet } from 'nanoid';
const nanoid = customAlphabet('1234567890', 7);

const australiaVisaApplicationSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: function () {
        return 'australiaVisa' + nanoid();
      },
    },

    travelDetails: {
      purposeOfStay: {
        type: String,
        required: true,
      },
      plannedDate: {
        type: String,
        required: true,
      },
      passengerNationality: {
        type: String,
        required: true,
      },
      portOfArrival: {
        type: String,
        required: true,
      },
    },
    personalDetails: {
      givenName: {
        type: String,
        required: true,
      },
      surnameFamilyName: {
        type: String,
        required: true,
      },
      emailAddress: {
        type: String,
        required: true,
      },

      confirmEmailAddress: {
        type: String,
        required: true,
      },
      dateOfBirth: {
        type: String,
        required: true,
      },
      countryTerritoryOfBirth: {
        type: String,
        required: true,
      },
      cityOfBirth: {
        type: String,
        required: true,
      },
      maritalStatus: {
        type: String,
        required: true,
      },
      gender: {
        type: String,
        required: true,
      },
    },
    passportDetails: {
      passportNumber: { type: String, required: true },
      issuingAuthority: { type: String, required: true },
      dateOfIssue: { type: String, required: true },
      dateOfExpiry: { type: String, required: true },
      citizen: { type: Boolean, default: false },
      additionalCitizenship: { type: String },
      obtainedVisa: { type: String },
      visaGrantNumber: { type: String },
    },

    nationalIdentityCard: {
      hasNationalIdentityCard: { type: String, required: true },
      familyName: { type: String },
      givenName: { type: String },
      countryOfIssue: { type: String },
      identificationNumber: { type: String },
    },

    contactDetails: {
      address: { type: String, required: true },
      houseNumber: { type: String, required: true },
      apartmentNumber: { type: String, required: true },
      zipPostalCode: { type: String, required: true },
      cityTown: { type: String, required: true },
      provinceState: { type: String, required: true },
      countryTerritory: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      isPostalAddressSameAsResidentialAddress: { type: String, required: true },
      addressPostal: { type: String },
      houseNumberPostal: { type: String },
      apartmentNumberPostal: { type: String },
      zipPostalCodePostal: { type: String },
      cityTownPostal: { type: String },
      provinceStatePostal: { type: String },
      countryTerritoryPostal: { type: String },
      phoneNumberPostal: { type: String },
    },

    backgroundQuestions: {
      criminalOffence: { type: String },
      criminalOffenceDetails: { type: String },
      offenceCharge: { type: String },
      offenceChargeDetails: { type: String },
    },
    vatInvoice: {
      needVatInvoice: { type: Boolean, default: false },
      taxIdentificationNumber: { type: String },
      companyName: { type: String },
      companyCountry: { type: String },
      companyCity: { type: String },
      companyPostal: { type: String },
      companyStreet: { type: String },
    },

    travelInsurance: {
      isTravelInsurance: { type: String },
      startDate: { type: String },
      returnDate: { type: String },
      insuranceFee: { type: String },
      travelInsuranceTermsAndConditions: { type: Boolean, default: false },
    },

    documents: {
      passportDocuments: {
        type: String,
        required: [true, 'passport is required'],
      },
      passportSizePhoto: {
        type: [String],
        required: [true, 'passport size photo is required'],
      },
      bankStatementPaySlips: {
        type: [String],
        required: [true, 'bank statement pay slips is required'],
      },
      businessCard: {
        type: [String],
        required: [true, 'business card is required'],
      },
      invitationLetter: {
        type: [String],
        required: [true, 'invitation letter is required'],
      },
      travelAndHealthInsurance: {
        type: [String],
        required: [true, 'travel and health insurance is required'],
      },
      policeCertificate: {
        type: [String],
        required: [true, 'police certificate is required'],
      },
      medicalCertificate: {
        type: [String],
        required: [true, 'medical certificate is required'],
      },
      additionalDocuments: {
        type: [String],
        required: [true, 'additional documents is required'],
      },
    },

    termsAndConditions: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const AustraliaVisaApplication = mongoose.model(
  'AustraliaVisaApplication',
  australiaVisaApplicationSchema
);

export default AustraliaVisaApplication;
