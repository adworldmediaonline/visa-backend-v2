import EgyptPersonalInfo from '../../models/egyptN/egyptPersonalInfoModel.js';
import EgyptVisaApplicationN from '../../models/egyptN/egyptVisaApplicationModel.js';
import { StatusCodes } from 'http-status-codes';
import expressAsyncHandler from 'express-async-handler';

const egyptPersonalInfoController = {
  createEgyptPersonalInfo: expressAsyncHandler(async (req, res) => {
    try {
      const {
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
        occupation,
      } = req.body;

      // Validate required fields according to the model
      if (
        !formId ||
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
          message: 'Missing required fields',
          statusCode: StatusCodes.BAD_REQUEST,
        });
      }

      // Create the personal info with all fields from the model
      const egyptPersonalInfo = new EgyptPersonalInfo({
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
        occupation,
      });

      const egyptPersonalInfoResult = await egyptPersonalInfo.save();

      // Update the main application to reference this personal info
      const updatedEgyptVisaApplication =
        await EgyptVisaApplicationN.findOneAndUpdate(
          { _id: formId },
          {
            personalInfo: egyptPersonalInfoResult._id,
            lastExitUrl: 'passport-info',
            emailAddress: email, // Store email in the main application for easier access
          },
          { new: true }
        );

      if (!updatedEgyptVisaApplication) {
        // If the application doesn't exist, delete the personal info we just created
        await EgyptPersonalInfo.findByIdAndDelete(
          egyptPersonalInfoResult._id
        );
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Egypt visa application not found',
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      return res.status(StatusCodes.CREATED).json({
        success: true,
        data: egyptPersonalInfoResult
      });
    } catch (error) {
      console.error('Error creating Egypt personal info:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error creating Egypt personal info',
        error: error.message
      });
    }
  }),

  getEgyptPersonalInfoByFormId: expressAsyncHandler(async (req, res) => {
    try {
      const { formId } = req.params;

      const egyptPersonalInfo = await EgyptPersonalInfo.findOne({
        formId,
      });

      if (!egyptPersonalInfo) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Egypt personal info not found',
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      return res.status(StatusCodes.OK).json({
        success: true,
        data: egyptPersonalInfo
      });
    } catch (error) {
      console.error('Error fetching Egypt personal info:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error fetching Egypt personal info',
        error: error.message
      });
    }
  }),

  updateEgyptPersonalInfo: expressAsyncHandler(async (req, res) => {
    try {
      const { formId } = req.params;
      const updateData = req.body;

      const egyptPersonalInfo = await EgyptPersonalInfo.findOneAndUpdate(
        { formId },
        updateData,
        { new: true }
      );

      if (!egyptPersonalInfo) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Egypt personal info not found',
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      // If email is updated, update it in the main application as well
      if (updateData.email) {
        await EgyptVisaApplicationN.findOneAndUpdate(
          { _id: formId },
          { emailAddress: updateData.email }
        );
      }

      return res.status(StatusCodes.OK).json({
        success: true,
        data: egyptPersonalInfo
      });
    } catch (error) {
      console.error('Error updating Egypt personal info:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error updating Egypt personal info',
        error: error.message
      });
    }
  }),
};

export default egyptPersonalInfoController;
