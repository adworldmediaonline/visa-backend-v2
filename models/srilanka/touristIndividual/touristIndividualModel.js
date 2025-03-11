import mongoose, { Schema } from 'mongoose';
import { customAlphabet } from 'nanoid';
const nanoid = customAlphabet('1234567890', 7);

const touristIndividualSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: function () {
        return 'slvisa' + nanoid();
      },
    },

    typeOfPassport: {
      type: String,
      required: [true, 'type of passport is required'],
    },
    visaType: {
      type: String,
      required: [true, 'visa type is required'],
    },
    visaValidPeriodIndividualTourist: {
      type: String,
      required: [true, 'visa valid period is required'],
    },
    familyNameIndividualTourist: {
      type: String,
      required: [true, 'family name is required'],
    },
    givenNameIndividualTourist: String,
    titleIndividualTourist: String,
    genderIndividualTourist: {
      type: String,
      required: [true, 'gender is required'],
    },
    martialStatus: {
      type: String,
      required: [true, 'martial status is required'],
    },
    nationalityIndividualTourist: {
      type: String,
      required: [true, 'nationality is required'],
    },
    dateOfBirthIndividualTourist: String,
    countryOfBirthIndividualTourist: String,
    placeOfBirth: {
      type: String,
      required: [true, 'place of birth is required'],
    },
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
    persons: [{ type: Schema.Types.ObjectId, ref: 'Person' }],
  },
  {
    timestamps: true,
  }
);

const TouristIndividual = mongoose.model(
  'TouristIndividual',
  touristIndividualSchema
);

export default TouristIndividual;
