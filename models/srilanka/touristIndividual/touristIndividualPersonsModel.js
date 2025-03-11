import mongoose, { Schema } from 'mongoose';

const touristIndividualPersonsSchema = new mongoose.Schema(
  {
    formId: {
      type: String,
      ref: 'TouristIndividual',
    },
    typeOfPassport: {
      type: String,
      required: [true, 'type of passport is required'],
    },
    visaType: {
      type: String,
      required: [true, 'visa type is required'],
    },
    familyNameIndividualTourist: {
      type: String,
      required: [true, 'family name is required'],
    },
    givenNameIndividualTourist: String,
    titleIndividualTourist: String,
    dateOfBirthIndividualTourist: String,
    genderIndividualTourist: String,
    nationalityIndividualTourist: String,
    countryOfBirthIndividualTourist: String,
    occupationIndividualTourist: String,
    passportNumberIndividualTourist: String,
    passportPlaceOfIssue: String,
    issueDateIndividualTourist: String,
    expiryDateIndividualTourist: String,

    passportFrontImage: {
      type: String,
      required: [true, 'passport front image cover is required'],
    },
    invitationLetter: {
      type: [String],
      required: [true, 'Invitation letter is required'],
    },
    profilePicture: {
      type: String,
      required: [true, 'profile picture is required'],
    },
    additionalDocuments: {
      type: [String],
      required: [true, 'additional documents is required'],
    },

    attendantArrivalDateIndividualTourist: String,
    purposeOfVisitIndividualTourist: String,
    visaValidPeriodIndividualTourist: String,
    portOfDepartureIndividualTourist: String,
    addressLineOneIndividualTourist: String,
    addressLineTwoIndividualTourist: String,
    cityIndividualTourist: String,
    stateIndividualTourist: String,
    zipCodeIndividualTourist: String,
    countryIndividualTourist: String,
    addressInSrilankaIndividualTourist: String,
    emailIndividualTourist: String,
    alternateEmailIndividualTourist: String,
    telephoneIndividualTourist: String,
    mobileIndividualTourist: String,
    validResidenceIndividualTourist: String,
    validEtaOrExtensionIndividualTourist: String,
    multipleEntryVisaIndividualTourist: String,
  },
  {
    timestamps: true,
  }
);

const TouristIndividualPersons = mongoose.model(
  'TouristIndividualPersons',
  touristIndividualPersonsSchema
);

export default TouristIndividualPersons;
