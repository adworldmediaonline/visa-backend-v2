import mongoose from 'mongoose';
import VisaRequestForm from './visa.js';

const visaStep4 = new mongoose.Schema(
  {
    formId: {
      type: String,
      ref: 'VisaRequestForm',
    },
    visaType: {
      type: String,
      default: 'evisa',
    },
    visaService: String,
    contactNo: String,
    placesToVisit: String,
    placesToVisit2: String,
    bookedHotel: {
      type: String,
      default: 'no',
    },
    bookedHotelTourOperatorName: String,
    bookedHotelTourOperatorAddress: String,
    bookedHotelName: String,
    bookedHotelPlace: String,
    durationOfVisa: String,
    numberOfEntries: String,
    portOfArrival: String,
    expectedPortOfExit: String,
    visitedIndiaBefore: {
      type: String,
      default: 'no',
    },
    visitedIndiaBeforeVisaAddress: String,
    visitedIndiaBeforeCitiesVisitedInIndia: String,
    visitedIndiaBeforeLastIndianVisaNo: String,
    visitedIndiaBeforeTypeOfVisa: String,
    visitedIndiaBeforePlaceOfIssue: String,
    visitedIndiaBeforeDateOfIssue: String,
    permissionRefused: {
      type: String,
      default: 'no',
    },
    refusalDetails: String,

    // feild according visa type
    visaServiceSelectedValueValidation: String,
    //for visa type eMEDICAL VISA
    eMedicalNameOfHospital: String,
    eMedicalAddressOfHospital: String,
    eMedicalPhoneOfHospital: String,
    eMedicalStateOfHospital: String,
    eMedicalDistrictOfHospital: String,
    eMedicalTypeOfMedicalTreatment: String,
    //for visa type eBusiness VISA
    eBusinessCompanyName: String,
    eBusinessCompanyAddress: String,
    eBusinessCompanyPhone: String,
    eBusinessCompanyWebsite: String,
    eBusinessCompanyNatures: String,

    eBusinessAttendTechMeetingName: String,
    eBusinessAttendTechMeetingAddress: String,
    eBusinessAttendTechMeetingPhone: String,

    eBusinessRecruitManpowerNamecontactCompanyRepresentative: String,
    eBusinessRecruitManpowerNatureOfJob: String,
    eBusinessRecruitManpowerPlacesRecruitmentConducted: String,

    eBusinessParticipationInExhibitionsNameAndAddress: String,
    eBusinessConductingToursNameAndAddress: String,
    eBusinessConductingToursCities: String,
    eBusinessConductingToursTravelAgencyName: String,
    eBusinessConductingToursTravelAgencyPhone: String,
    eBusinessConductingToursTravelAgencyAddress: String,
    //for visa type eMEDICAL ATTENDANT VISA
    eMedicalAttendantNameVisaHolder: String,
    eMedicalAttendantAppOrVisa: String,
    eMedicalAttendantVisaNumberOfVisaHolder: String,
    eMedicalAttendantApplicationIdOfVisaHolder: String,
    eMedicalAttendantPassportNumberOfVisaHolder: String,
    eMedicalAttendantDobOfVisaHolder: String,
    eMedicalAttendantNationalityOfVisaHolder: String,
    //for visa type eCONFERENCE VISA
    eConferenceNameOfConference: String,
    eConferenceStartDate: String,
    eConferenceEndDate: String,
    eConferenceAddress: String,

    eConferenceState: String,
    eConferenceDistrict: String,
    eConferencePincode: String,
    eConferenceNameOfOrganizer: String,
    eConferenceAddressOfOrganizer: String,
    eConferencePhoneOfOrganizer: String,
    eConferenceEmailOfOrganizer: String,

    countryVisitedInLast10Years: [String],
    visitedSAARCCountries: {
      type: String,
      default: 'no',
    },
    visitedSAARCCountriesLists: [
      {
        saarcCountryName: String,
        selectYear: String,
        numberOfVisits: String,
      },
    ],
    referenceNameInIndia: String,
    referenceAddress: String,
    referenceState: String,
    referenceDistrict: String,
    referencePhone: String,
    referenceNameInHomeCountry: String,
    referenceAddressInHomeCountry: String,
    referencePhoneInHomeCountry: String,
  },
  {
    timestamps: true,
  }
);
const VisaRequestForm4 = mongoose.model('VisaRequestForm4', visaStep4);
export default VisaRequestForm4;
