import KenyaVisaApplication from '../../models/kenya/kenyaVisaApplicationModel.js';
import KenyaPersonalInfo from '../../models/kenya/kenyaPersonalInfoModel.js';
import KenyaPassportInfo from '../../models/kenya/kenyaPassportInfoModel.js';
import { StatusCodes } from 'http-status-codes';
import expressAsyncHandler from 'express-async-handler';

const kenyaAdditionalApplicantsController = {
  // Add a new additional applicant
  addAdditionalApplicant: expressAsyncHandler(async (req, res) => {
    try {
      const { formId } = req.params;
      const {
        // Personal Info fields
        givenName,
        surname,
        citizenship,
        gender,
        countryOfBirth,
        dateOfBirth,
        placeOfBirth,
        email,
        phoneNumber,
        occupation,
        streetAddress,
        addressCity,
        addressCountry,

        // Passport Info fields
        passportType,
        passportNumber,
        passportIssueDate,
        passportExpiryDate,
        passportIssuingCountry,
        passportIssuingAuthority,
      } = req.body;

      // Find the main application
      const application = await KenyaVisaApplication.findById(formId);
      if (!application) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Visa application not found',
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      // Validate required personal info fields
      if (
        !givenName ||
        !surname ||
        !citizenship ||
        !gender ||
        !countryOfBirth ||
        !dateOfBirth ||
        !placeOfBirth ||
        !email ||
        !phoneNumber ||
        !occupation ||
        !streetAddress ||
        !addressCity ||
        !addressCountry
      ) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Missing required personal information fields',
          statusCode: StatusCodes.BAD_REQUEST,
        });
      }

      // Validate required passport info fields
      if (
        !passportNumber ||
        !passportIssueDate ||
        !passportExpiryDate ||
        !passportIssuingCountry ||
        !passportIssuingAuthority
      ) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Missing required passport information fields',
          statusCode: StatusCodes.BAD_REQUEST,
        });
      }

      // Create personal info for additional applicant
      const personalInfo = new KenyaPersonalInfo({
        formId,
        givenName,
        surname,
        citizenship,
        gender,
        countryOfBirth,
        dateOfBirth,
        placeOfBirth,
        email,
        phoneNumber,
        occupation,
        streetAddress,
        addressCity,
        addressCountry,
        isAdditionalApplicant: true,
      });

      // Create passport info for additional applicant
      const passportInfo = new KenyaPassportInfo({
        formId,
        passportType,
        passportNumber,
        passportIssueDate,
        passportExpiryDate,
        passportIssuingCountry,
        passportIssuingAuthority,
        isAdditionalApplicant: true,
      });

      // Save both documents
      const savedPersonalInfo = await personalInfo.save();
      const savedPassportInfo = await passportInfo.save();

      // Add to additionalApplicants array
      if (!application.additionalApplicants) {
        application.additionalApplicants = [];
      }

      application.additionalApplicants.push({
        personalInfo: savedPersonalInfo._id,
        passportInfo: savedPassportInfo._id,
      });

      // Save the updated application (the pre-save hook will update noOfVisa)
      await application.save();

      // Return the updated application with populated fields
      const updatedApplication = await KenyaVisaApplication.findById(formId)
        .populate('visaDetails')
        .populate('arrivalInfo')
        .populate('personalInfo')
        .populate('passportInfo')
        .populate({
          path: 'additionalApplicants.personalInfo',
          model: 'KenyaPersonalInfo',
        })
        .populate({
          path: 'additionalApplicants.passportInfo',
          model: 'KenyaPassportInfo',
        });

      res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'Additional applicant added successfully',
        data: updatedApplication,
      });
    } catch (error) {
      console.error('Error adding additional applicant:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to add additional applicant',
        error: error.message,
      });
    }
  }),

  // Update an existing additional applicant
  updateAdditionalApplicant: expressAsyncHandler(async (req, res) => {
    try {
      const { formId, applicantIndex } = req.params;
      const {
        // Personal Info fields
        givenName,
        surname,
        citizenship,
        gender,
        countryOfBirth,
        dateOfBirth,
        placeOfBirth,
        email,
        phoneNumber,
        occupation,
        streetAddress,
        addressCity,
        addressCountry,

        // Passport Info fields
        passportNumber,
        passportIssueDate,
        passportExpiryDate,
        passportIssuingCountry,
        passportIssuingAuthority,
      } = req.body;

      // Find the main application
      const application = await KenyaVisaApplication.findById(formId);
      if (!application) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Visa application not found',
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      // Check if the applicant index is valid
      if (
        !application.additionalApplicants ||
        !application.additionalApplicants[applicantIndex]
      ) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Additional applicant not found',
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      const applicant = application.additionalApplicants[applicantIndex];

      // Update personal info if provided
      if (
        Object.keys(req.body).some(key =>
          [
            'givenName',
            'surname',
            'citizenship',
            'gender',
            'countryOfBirth',
            'dateOfBirth',
            'placeOfBirth',
            'email',
            'phoneNumber',
            'occupation',
            'streetAddress',
            'addressCity',
            'addressCountry',
          ].includes(key)
        )
      ) {
        const personalInfoUpdate = {};
        if (givenName) personalInfoUpdate.givenName = givenName;
        if (surname) personalInfoUpdate.surname = surname;
        if (citizenship) personalInfoUpdate.citizenship = citizenship;
        if (gender) personalInfoUpdate.gender = gender;
        if (countryOfBirth) personalInfoUpdate.countryOfBirth = countryOfBirth;
        if (dateOfBirth) personalInfoUpdate.dateOfBirth = dateOfBirth;
        if (placeOfBirth) personalInfoUpdate.placeOfBirth = placeOfBirth;
        if (email) personalInfoUpdate.email = email;
        if (phoneNumber) personalInfoUpdate.phoneNumber = phoneNumber;
        if (occupation) personalInfoUpdate.occupation = occupation;
        if (streetAddress) personalInfoUpdate.streetAddress = streetAddress;
        if (addressCity) personalInfoUpdate.addressCity = addressCity;
        if (addressCountry) personalInfoUpdate.addressCountry = addressCountry;

        await KenyaPersonalInfo.findByIdAndUpdate(
          applicant.personalInfo,
          personalInfoUpdate,
          { new: true }
        );
      }

      // Update passport info if provided
      if (
        Object.keys(req.body).some(key =>
          [
            'passportNumber',
            'passportIssueDate',
            'passportExpiryDate',
            'passportIssuingCountry',
            'passportIssuingAuthority',
          ].includes(key)
        )
      ) {
        const passportInfoUpdate = {};
        if (passportNumber) passportInfoUpdate.passportNumber = passportNumber;
        if (passportIssueDate)
          passportInfoUpdate.passportIssueDate = passportIssueDate;
        if (passportExpiryDate)
          passportInfoUpdate.passportExpiryDate = passportExpiryDate;
        if (passportIssuingCountry)
          passportInfoUpdate.passportIssuingCountry = passportIssuingCountry;
        if (passportIssuingAuthority)
          passportInfoUpdate.passportIssuingAuthority =
            passportIssuingAuthority;

        await KenyaPassportInfo.findByIdAndUpdate(
          applicant.passportInfo,
          passportInfoUpdate,
          { new: true }
        );
      }

      // Return the updated application with populated fields
      const updatedApplication = await KenyaVisaApplication.findById(formId)
        .populate('visaDetails')
        .populate('arrivalInfo')
        .populate('personalInfo')
        .populate('passportInfo')
        .populate({
          path: 'additionalApplicants.personalInfo',
          model: 'KenyaPersonalInfo',
        })
        .populate({
          path: 'additionalApplicants.passportInfo',
          model: 'KenyaPassportInfo',
        });

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Additional applicant updated successfully',
        data: updatedApplication,
      });
    } catch (error) {
      console.error('Error updating additional applicant:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to update additional applicant',
        error: error.message,
      });
    }
  }),

  // Remove an additional applicant
  removeAdditionalApplicant: expressAsyncHandler(async (req, res) => {
    try {
      const { formId, applicantIndex } = req.params;

      // Find the main application
      const application = await KenyaVisaApplication.findById(formId);
      if (!application) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Visa application not found',
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      // Check if the applicant index is valid
      if (
        !application.additionalApplicants ||
        !application.additionalApplicants[applicantIndex]
      ) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Additional applicant not found',
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      const applicant = application.additionalApplicants[applicantIndex];

      // Delete the personal info and passport info documents
      await KenyaPersonalInfo.findByIdAndDelete(applicant.personalInfo);
      await KenyaPassportInfo.findByIdAndDelete(applicant.passportInfo);

      // Remove the applicant from the array
      application.additionalApplicants.splice(applicantIndex, 1);

      // Save the updated application (the pre-save hook will update noOfVisa)
      await application.save();

      // Return the updated application with populated fields
      const updatedApplication = await KenyaVisaApplication.findById(formId)
        .populate('visaDetails')
        .populate('arrivalInfo')
        .populate('personalInfo')
        .populate('passportInfo')
        .populate({
          path: 'additionalApplicants.personalInfo',
          model: 'KenyaPersonalInfo',
        })
        .populate({
          path: 'additionalApplicants.passportInfo',
          model: 'KenyaPassportInfo',
        });

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Additional applicant removed successfully',
        data: updatedApplication,
      });
    } catch (error) {
      console.error('Error removing additional applicant:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to remove additional applicant',
        error: error.message,
      });
    }
  }),

  // Get all additional applicants for a visa application
  getAdditionalApplicants: expressAsyncHandler(async (req, res) => {
    try {
      const { formId } = req.params;

      const application = await KenyaVisaApplication.findById(formId)
        .populate({
          path: 'additionalApplicants.personalInfo',
          model: 'KenyaPersonalInfo',
        })
        .populate({
          path: 'additionalApplicants.passportInfo',
          model: 'KenyaPassportInfo',
        });

      if (!application) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Visa application not found',
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Additional applicants retrieved successfully',
        data: application.additionalApplicants || [],
      });
    } catch (error) {
      console.error('Error retrieving additional applicants:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to retrieve additional applicants',
        error: error.message,
      });
    }
  }),
};

export default kenyaAdditionalApplicantsController;
