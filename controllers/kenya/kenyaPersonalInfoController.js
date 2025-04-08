import KenyaPersonalInfo from '../../models/kenya/kenyaPersonalInfoModel.js';
import KenyaVisaApplication from '../../models/kenya/kenyaVisaApplicationModel.js';
import { StatusCodes } from 'http-status-codes';
import expressAsyncHandler from 'express-async-handler';

const kenyaPersonalInfoController = {
  createKenyaPersonalInfo: expressAsyncHandler(async (req, res) => {
    try {
      const {
        formId,
        givenName,
        surname,
        citizenship,
        gender,
        maritalStatus, // Added this field from the model
        countryOfBirth,
        dateOfBirth,
        placeOfBirth,
        email,
        phoneNumber,
        occupation,
        streetAddress,
        addressCity,
        addressCountry,
        emergencyContactName, // Added this field from the model
        emergencyContactPhone, // Added this field from the model
      } = req.body;

      // Validate required fields according to the model
      if (
        !formId ||
        !givenName ||
        !surname ||
        !gender ||
        !maritalStatus || // Added validation for this field
        !countryOfBirth ||
        !email ||
        !phoneNumber ||
        !occupation ||
        !streetAddress ||
        !addressCity ||
        !addressCountry ||
        !emergencyContactName || // Added validation for this field
        !emergencyContactPhone // Added validation for this field
      ) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Missing required fields',
          statusCode: StatusCodes.BAD_REQUEST,
        });
      }

      // Create the personal info with all fields from the model
      const kenyaPersonalInfo = new KenyaPersonalInfo({
        formId,
        givenName,
        surname,
        citizenship,
        gender,
        maritalStatus, // Added this field
        countryOfBirth,
        dateOfBirth,
        placeOfBirth,
        email,
        phoneNumber,
        occupation,
        streetAddress,
        addressCity,
        addressCountry,
        emergencyContactName, // Added this field
        emergencyContactPhone, // Added this field
      });

      const kenyaPersonalInfoResult = await kenyaPersonalInfo.save();

      // Update the main application to reference this personal info
      const updatedKenyaVisaApplication =
        await KenyaVisaApplication.findOneAndUpdate(
          { _id: formId },
          {
            personalInfo: kenyaPersonalInfoResult._id,
            lastExitUrl: 'passport-info',
            emailAddress: email, // Store email in the main application for easier access
          },
          { new: true }
        );

      if (!updatedKenyaVisaApplication) {
        // If the application doesn't exist, delete the personal info we just created
        await KenyaPersonalInfo.findByIdAndDelete(
          kenyaPersonalInfoResult._id
        );
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Kenya visa application not found',
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      return res.status(StatusCodes.CREATED).json({
        success: true,
        data: kenyaPersonalInfoResult
      });
    } catch (error) {
      console.error('Error creating Kenya personal info:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error creating Kenya personal info',
        error: error.message
      });
    }
  }),

  getKenyaPersonalInfoByFormId: expressAsyncHandler(async (req, res) => {
    try {
      const { formId } = req.params;

      const kenyaPersonalInfo = await KenyaPersonalInfo.findOne({
        formId,
      });

      if (!kenyaPersonalInfo) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Kenya personal info not found',
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      return res.status(StatusCodes.OK).json({
        success: true,
        data: kenyaPersonalInfo
      });
    } catch (error) {
      console.error('Error fetching Kenya personal info:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error fetching Kenya personal info',
        error: error.message
      });
    }
  }),

  updateKenyaPersonalInfo: expressAsyncHandler(async (req, res) => {
    try {
      const { formId } = req.params;
      const updateData = req.body;

      const kenyaPersonalInfo = await KenyaPersonalInfo.findOneAndUpdate(
        { formId },
        updateData,
        { new: true }
      );

      if (!kenyaPersonalInfo) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Kenya personal info not found',
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      // If email is updated, update it in the main application as well
      if (updateData.email) {
        await KenyaVisaApplication.findOneAndUpdate(
          { _id: formId },
          { emailAddress: updateData.email }
        );
      }

      return res.status(StatusCodes.OK).json({
        success: true,
        data: kenyaPersonalInfo
      });
    } catch (error) {
      console.error('Error updating Kenya personal info:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error updating Kenya personal info',
        error: error.message
      });
    }
  }),
};

export default kenyaPersonalInfoController;
