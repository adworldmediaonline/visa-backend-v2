import EgyptVisaApplicationN from '../../models/egyptN/egyptVisaApplicationModel.js';
import EgyptPersonalInfo from '../../models/egyptN/egyptPersonalInfoModel.js';
import EgyptPassportInfo from '../../models/egyptN/egyptPassportInfoModel.js';
import { StatusCodes } from 'http-status-codes';
import expressAsyncHandler from 'express-async-handler';

const egyptAdditionalApplicantsController = {
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
        maritalStatus,
        countryOfBirth,
        dateOfBirth,
        placeOfBirth,
        email,
        phoneNumber,
        occupation,

        // Passport Info fields
        passportType,
        passportNumber,
        passportIssueDate,
        passportExpiryDate,
        passportIssuingCountry,
      } = req.body;

      // Find the main application
      const application = await EgyptVisaApplicationN.findById(formId);
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
        !gender ||
        !maritalStatus ||
        !countryOfBirth ||
        !email ||
        !phoneNumber ||
        !occupation
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
        !passportExpiryDate
      ) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Missing required passport information fields',
          statusCode: StatusCodes.BAD_REQUEST,
        });
      }

      // Create personal info for additional applicant
      const personalInfo = new EgyptPersonalInfo({
        formId,
        givenName,
        surname,
        citizenship,
        gender,
        maritalStatus,
        countryOfBirth,
        dateOfBirth,
        placeOfBirth,
        email,
        phoneNumber,
        occupation
      });

      // Create passport info for additional applicant
      const passportInfo = new EgyptPassportInfo({
        formId,
        passportType,
        passportNumber,
        passportIssueDate,
        passportExpiryDate,
        passportIssuingCountry
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
      const updatedApplication = await EgyptVisaApplicationN.findById(formId)
        .populate('visaDetails')
        .populate('arrivalInfo')
        .populate('personalInfo')
        .populate('passportInfo')
        .populate({
          path: 'additionalApplicants.personalInfo',
          model: 'EgyptPersonalInfo',
        })
        .populate({
          path: 'additionalApplicants.passportInfo',
          model: 'EgyptPassportInfo',
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
        maritalStatus,
        countryOfBirth,
        dateOfBirth,
        placeOfBirth,
        email,
        phoneNumber,
        occupation,

        // Passport Info fields
        passportType,
        passportNumber,
        passportIssueDate,
        passportExpiryDate,
        passportIssuingCountry,
      } = req.body;

      // Find the main application
      const application = await EgyptVisaApplicationN.findById(formId);
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
            'maritalStatus',
            'countryOfBirth',
            'dateOfBirth',
            'placeOfBirth',
            'email',
            'phoneNumber',
            'occupation',
          ].includes(key)
        )
      ) {
        const personalInfoUpdate = {};
        if (givenName) personalInfoUpdate.givenName = givenName;
        if (surname) personalInfoUpdate.surname = surname;
        if (citizenship) personalInfoUpdate.citizenship = citizenship;
        if (gender) personalInfoUpdate.gender = gender;
        if (maritalStatus) personalInfoUpdate.maritalStatus = maritalStatus;
        if (countryOfBirth) personalInfoUpdate.countryOfBirth = countryOfBirth;
        if (dateOfBirth) personalInfoUpdate.dateOfBirth = dateOfBirth;
        if (placeOfBirth) personalInfoUpdate.placeOfBirth = placeOfBirth;
        if (email) personalInfoUpdate.email = email;
        if (phoneNumber) personalInfoUpdate.phoneNumber = phoneNumber;
        if (occupation) personalInfoUpdate.occupation = occupation;

        await EgyptPersonalInfo.findByIdAndUpdate(
          applicant.personalInfo,
          personalInfoUpdate,
          { new: true }
        );
      }

      // Update passport info if provided
      if (
        Object.keys(req.body).some(key =>
          [
            'passportType',
            'passportNumber',
            'passportIssueDate',
            'passportExpiryDate',
            'passportIssuingCountry',
          ].includes(key)
        )
      ) {
        const passportInfoUpdate = {};
        if (passportType) passportInfoUpdate.passportType = passportType;
        if (passportNumber) passportInfoUpdate.passportNumber = passportNumber;
        if (passportIssueDate)
          passportInfoUpdate.passportIssueDate = passportIssueDate;
        if (passportExpiryDate)
          passportInfoUpdate.passportExpiryDate = passportExpiryDate;
        if (passportIssuingCountry)
          passportInfoUpdate.passportIssuingCountry = passportIssuingCountry;

        await EgyptPassportInfo.findByIdAndUpdate(
          applicant.passportInfo,
          passportInfoUpdate,
          { new: true }
        );
      }

      // Return the updated application with populated fields
      const updatedApplication = await EgyptVisaApplicationN.findById(formId)
        .populate('visaDetails')
        .populate('arrivalInfo')
        .populate('personalInfo')
        .populate('passportInfo')
        .populate({
          path: 'additionalApplicants.personalInfo',
          model: 'EgyptPersonalInfo',
        })
        .populate({
          path: 'additionalApplicants.passportInfo',
          model: 'EgyptPassportInfo',
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
      const application = await EgyptVisaApplicationN.findById(formId);
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
      await EgyptPersonalInfo.findByIdAndDelete(applicant.personalInfo);
      await EgyptPassportInfo.findByIdAndDelete(applicant.passportInfo);

      // Remove the applicant from the array
      application.additionalApplicants.splice(applicantIndex, 1);

      // Save the updated application (the pre-save hook will update noOfVisa)
      await application.save();

      // Return the updated application with populated fields
      const updatedApplication = await EgyptVisaApplicationN.findById(formId)
        .populate('visaDetails')
        .populate('arrivalInfo')
        .populate('personalInfo')
        .populate('passportInfo')
        .populate({
          path: 'additionalApplicants.personalInfo',
          model: 'EgyptPersonalInfo',
        })
        .populate({
          path: 'additionalApplicants.passportInfo',
          model: 'EgyptPassportInfo',
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

      const application = await EgyptVisaApplicationN.findById(formId)
        .populate({
          path: 'additionalApplicants.personalInfo',
          model: 'EgyptPersonalInfo',
        })
        .populate({
          path: 'additionalApplicants.passportInfo',
          model: 'EgyptPassportInfo',
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

export default egyptAdditionalApplicantsController;
