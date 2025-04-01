import EthiopiaVisaApplication from '../../models/ethiopia/ethiopiaVisaApplicationModel.js';
import EthiopiaPersonalInfo from '../../models/ethiopia/ethiopiaPersonalInfoModel.js';
import EthiopiaPassportInfo from '../../models/ethiopia/ethiopiaPassportInfoModel.js';

const ethiopiaAdditionalApplicantsController = {
  // Add a new additional applicant
  addAdditionalApplicant: async (req, res) => {
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
      const application = await EthiopiaVisaApplication.findById(formId);
      if (!application) {
        return res.status(404).json({
          error: 'Visa application not found',
          statusCode: 404,
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
        return res.status(400).json({
          error: 'Missing required personal information fields',
          statusCode: 400,
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
        return res.status(400).json({
          error: 'Missing required passport information fields',
          statusCode: 400,
        });
      }

      // Create personal info for additional applicant
      const personalInfo = new EthiopiaPersonalInfo({
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
      const passportInfo = new EthiopiaPassportInfo({
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
      const updatedApplication = await EthiopiaVisaApplication.findById(formId)
        .populate('visaDetails')
        .populate('arrivalInfo')
        .populate('personalInfo')
        .populate('passportInfo')
        .populate({
          path: 'additionalApplicants.personalInfo',
          model: 'EthiopiaPersonalInfo',
        })
        .populate({
          path: 'additionalApplicants.passportInfo',
          model: 'EthiopiaPassportInfo',
        });

      res.status(201).json({
        message: 'Additional applicant added successfully',
        data: updatedApplication,
        statusCode: 201,
      });
    } catch (error) {
      console.error('Error adding additional applicant:', error);
      res.status(500).json({
        error: 'Failed to add additional applicant',
        details: error.message,
        statusCode: 500,
      });
    }
  },

  // Update an existing additional applicant
  updateAdditionalApplicant: async (req, res) => {
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
      const application = await EthiopiaVisaApplication.findById(formId);
      if (!application) {
        return res.status(404).json({
          error: 'Visa application not found',
          statusCode: 404,
        });
      }

      // Check if the applicant index is valid
      if (
        !application.additionalApplicants ||
        !application.additionalApplicants[applicantIndex]
      ) {
        return res.status(404).json({
          error: 'Additional applicant not found',
          statusCode: 404,
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

        await EthiopiaPersonalInfo.findByIdAndUpdate(
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

        await EthiopiaPassportInfo.findByIdAndUpdate(
          applicant.passportInfo,
          passportInfoUpdate,
          { new: true }
        );
      }

      // Return the updated application with populated fields
      const updatedApplication = await EthiopiaVisaApplication.findById(formId)
        .populate('visaDetails')
        .populate('arrivalInfo')
        .populate('personalInfo')
        .populate('passportInfo')
        .populate({
          path: 'additionalApplicants.personalInfo',
          model: 'EthiopiaPersonalInfo',
        })
        .populate({
          path: 'additionalApplicants.passportInfo',
          model: 'EthiopiaPassportInfo',
        });

      res.status(200).json({
        message: 'Additional applicant updated successfully',
        data: updatedApplication,
        statusCode: 200,
      });
    } catch (error) {
      console.error('Error updating additional applicant:', error);
      res.status(500).json({
        error: 'Failed to update additional applicant',
        details: error.message,
        statusCode: 500,
      });
    }
  },

  // Remove an additional applicant
  removeAdditionalApplicant: async (req, res) => {
    try {
      const { formId, applicantIndex } = req.params;

      // Find the main application
      const application = await EthiopiaVisaApplication.findById(formId);
      if (!application) {
        return res.status(404).json({
          error: 'Visa application not found',
          statusCode: 404,
        });
      }

      // Check if the applicant index is valid
      if (
        !application.additionalApplicants ||
        !application.additionalApplicants[applicantIndex]
      ) {
        return res.status(404).json({
          error: 'Additional applicant not found',
          statusCode: 404,
        });
      }

      const applicant = application.additionalApplicants[applicantIndex];

      // Delete the personal info and passport info documents
      await EthiopiaPersonalInfo.findByIdAndDelete(applicant.personalInfo);
      await EthiopiaPassportInfo.findByIdAndDelete(applicant.passportInfo);

      // Remove the applicant from the array
      application.additionalApplicants.splice(applicantIndex, 1);

      // Save the updated application (the pre-save hook will update noOfVisa)
      await application.save();

      // Return the updated application with populated fields
      const updatedApplication = await EthiopiaVisaApplication.findById(formId)
        .populate('visaDetails')
        .populate('arrivalInfo')
        .populate('personalInfo')
        .populate('passportInfo')
        .populate({
          path: 'additionalApplicants.personalInfo',
          model: 'EthiopiaPersonalInfo',
        })
        .populate({
          path: 'additionalApplicants.passportInfo',
          model: 'EthiopiaPassportInfo',
        });

      res.status(200).json({
        message: 'Additional applicant removed successfully',
        data: updatedApplication,
        statusCode: 200,
      });
    } catch (error) {
      console.error('Error removing additional applicant:', error);
      res.status(500).json({
        error: 'Failed to remove additional applicant',
        details: error.message,
        statusCode: 500,
      });
    }
  },

  // Get all additional applicants for a visa application
  getAdditionalApplicants: async (req, res) => {
    try {
      const { formId } = req.params;

      const application = await EthiopiaVisaApplication.findById(formId)
        .populate({
          path: 'additionalApplicants.personalInfo',
          model: 'EthiopiaPersonalInfo',
        })
        .populate({
          path: 'additionalApplicants.passportInfo',
          model: 'EthiopiaPassportInfo',
        });

      if (!application) {
        return res.status(404).json({
          error: 'Visa application not found',
          statusCode: 404,
        });
      }

      res.status(200).json({
        message: 'Additional applicants retrieved successfully',
        data: application.additionalApplicants || [],
        statusCode: 200,
      });
    } catch (error) {
      console.error('Error retrieving additional applicants:', error);
      res.status(500).json({
        error: 'Failed to retrieve additional applicants',
        details: error.message,
        statusCode: 500,
      });
    }
  },
};

export default ethiopiaAdditionalApplicantsController;
