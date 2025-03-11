import mongoose from 'mongoose';
import VisaRequestForm from './visa.js';

const visaStep3 = new mongoose.Schema(
  {
    formId: {
      type: String,
      ref: 'VisaRequestForm',
    },
    houseNoStreet: String,
    villageTownCity: String,
    country: String,
    stateProvinceDistrict: String,
    postalZipCode: String,
    phoneNo: String,
    mobileNo: String,
    emailAddress: String,
    sameAddress: Boolean,
    permanentAddressHouseNoStreet: String,
    permanentAddressVillageTownCity: String,
    permanentAddressStateProvinceDistrict: String,
    fatherFullName: String,
    fatherNationality: String,
    fatherPreviousNationality: String,
    fatherPlaceOfBirth: String,
    fatherCountry: String,
    motherFullName: String,
    motherNationality: String,
    motherPreviousNationality: String,
    motherPlaceOfBirth: String,
    motherCountryOfBirth: String,
    applicantMaritalStatus: String,
    spouseFullName: String,
    spouseNationality: String,
    spousePreviousNationality: String,
    spousePlaceOfBirth: String,
    spouseCountryOfBirth: String,
    parentsPakistanNational: String,
    parentDetails: String,
    presentOccupation: String,
    presentOtherOccupation: String,
    houseWifeOccupationDetails: String,
    employerName: String,
    designation: String,
    address: String,
    applicantPhone: String,
    pastOccupationIfAny: String,
    militaryOrganization: String,
    organization: String,
    militaryDesignation: String,
    militaryRank: String,
    placeOfPosting: String,
  },
  {
    timestamps: true,
  }
);
const VisaRequestForm3 = mongoose.model('VisaRequestForm3', visaStep3);
export default VisaRequestForm3;
