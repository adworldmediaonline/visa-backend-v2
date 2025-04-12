import EgyptPassportInfo from '../../models/egyptN/egyptPassportInfoModel.js';
import EgyptVisaApplicationN from '../../models/egyptN/egyptVisaApplicationModel.js';
import { StatusCodes } from 'http-status-codes';
import expressAsyncHandler from 'express-async-handler';

const egyptPassportInfoController = {
  createEgyptPassportInfo: expressAsyncHandler(async (req, res) => {
    try {
      const {
        formId,
        passportType,
        passportNumber,
        passportIssueDate,
        passportExpiryDate,
        passportIssuingCountry,
      } = req.body;

      // Validate required fields
      if (
        !formId ||
        !passportNumber ||
        !passportIssueDate ||
        !passportExpiryDate
      ) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Missing required fields',
          statusCode: StatusCodes.BAD_REQUEST,
        });
      }

      // Validate passport expiry date
      const currentDate = new Date();
      const expiryDate = new Date(passportExpiryDate);

      if (expiryDate < currentDate) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Passport is expired',
          statusCode: StatusCodes.BAD_REQUEST,
        });
      }

      // Create the passport info
      const egyptPassportInfo = new EgyptPassportInfo({
        formId,
        passportType,
        passportNumber,
        passportIssueDate,
        passportExpiryDate,
        passportIssuingCountry,
      });

      const egyptPassportInfoResult = await egyptPassportInfo.save();

      // Update the main application to reference this passport info
      const updatedEgyptVisaApplication =
        await EgyptVisaApplicationN.findOneAndUpdate(
          { _id: formId },
          {
            passportInfo: egyptPassportInfoResult._id,
            lastExitUrl: 'review',
          },
          { new: true }
        );

      if (!updatedEgyptVisaApplication) {
        // If the application doesn't exist, delete the passport info we just created
        await EgyptPassportInfo.findByIdAndDelete(
          egyptPassportInfoResult._id
        );
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Egypt visa application not found',
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      // Check if all steps are complete and update application status if they are
      const completeApplication = await EgyptVisaApplicationN.findById(formId)
        .populate('visaDetails')
        .populate('arrivalInfo')
        .populate('personalInfo')
        .populate('passportInfo');

      if (completeApplication.isComplete) {
        await EgyptVisaApplicationN.findByIdAndUpdate(
          formId,
          { applicationStatus: 'submitted' },
          { new: true }
        );
      }

      return res.status(StatusCodes.CREATED).json({
        success: true,
        data: egyptPassportInfoResult
      });
    } catch (error) {
      console.error('Error creating Egypt passport info:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error creating Egypt passport info',
        error: error.message
      });
    }
  }),

  getEgyptPassportInfoByFormId: expressAsyncHandler(async (req, res) => {
    try {
      const { formId } = req.params;

      const egyptPassportInfo = await EgyptPassportInfo.findOne({
        formId,
      });

      if (!egyptPassportInfo) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Egypt passport info not found',
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      return res.status(StatusCodes.OK).json({
        success: true,
        data: egyptPassportInfo
      });
    } catch (error) {
      console.error('Error fetching Egypt passport info:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error fetching Egypt passport info',
        error: error.message
      });
    }
  }),

  updateEgyptPassportInfo: expressAsyncHandler(async (req, res) => {
    try {
      const { formId } = req.params;
      const updateData = req.body;

      // If updating expiry date, validate it
      if (updateData.passportExpiryDate) {
        const currentDate = new Date();
        const expiryDate = new Date(updateData.passportExpiryDate);

        if (expiryDate < currentDate) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Passport is expired',
            statusCode: StatusCodes.BAD_REQUEST,
          });
        }
      }

      const egyptPassportInfo = await EgyptPassportInfo.findOneAndUpdate(
        { formId },
        updateData,
        { new: true }
      );

      if (!egyptPassportInfo) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Egypt passport info not found',
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      return res.status(StatusCodes.OK).json({
        success: true,
        data: egyptPassportInfo
      });
    } catch (error) {
      console.error('Error updating Egypt passport info:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error updating Egypt passport info',
        error: error.message
      });
    }
  }),
};

export default egyptPassportInfoController;
