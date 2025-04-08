import KenyaPassportInfo from '../../models/kenya/kenyaPassportInfoModel.js';
import KenyaVisaApplication from '../../models/kenya/kenyaVisaApplicationModel.js';
import { StatusCodes } from 'http-status-codes';
import expressAsyncHandler from 'express-async-handler';

const kenyaPassportInfoController = {
  createKenyaPassportInfo: expressAsyncHandler(async (req, res) => {
    try {
      const {
        formId,
        passportType,
        passportNumber,
        passportIssueDate,
        passportExpiryDate,
        passportIssuingCountry,
        passportIssuingAuthority,
      } = req.body;

      // Validate required fields
      if (
        !formId ||
        !passportType ||
        !passportNumber ||
        !passportIssueDate ||
        !passportExpiryDate ||
        !passportIssuingCountry ||
        !passportIssuingAuthority
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
      const kenyaPassportInfo = new KenyaPassportInfo({
        formId,
        passportType,
        passportNumber,
        passportIssueDate,
        passportExpiryDate,
        passportIssuingCountry,
        passportIssuingAuthority,
      });

      const kenyaPassportInfoResult = await kenyaPassportInfo.save();

      // Update the main application to reference this passport info
      const updatedKenyaVisaApplication =
        await KenyaVisaApplication.findOneAndUpdate(
          { _id: formId },
          {
            passportInfo: kenyaPassportInfoResult._id,
            lastExitUrl: 'review',
          },
          { new: true }
        );

      if (!updatedKenyaVisaApplication) {
        // If the application doesn't exist, delete the passport info we just created
        await KenyaPassportInfo.findByIdAndDelete(
          kenyaPassportInfoResult._id
        );
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Kenya visa application not found',
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      // Check if all steps are complete and update application status if they are
      const completeApplication = await KenyaVisaApplication.findById(formId)
        .populate('visaDetails')
        .populate('arrivalInfo')
        .populate('personalInfo')
        .populate('passportInfo');

      if (completeApplication.isComplete) {
        await KenyaVisaApplication.findByIdAndUpdate(
          formId,
          { applicationStatus: 'submitted' },
          { new: true }
        );
      }

      return res.status(StatusCodes.CREATED).json({
        success: true,
        data: kenyaPassportInfoResult
      });
    } catch (error) {
      console.error('Error creating Kenya passport info:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error creating Kenya passport info',
        error: error.message
      });
    }
  }),

  getKenyaPassportInfoByFormId: expressAsyncHandler(async (req, res) => {
    try {
      const { formId } = req.params;

      const kenyaPassportInfo = await KenyaPassportInfo.findOne({
        formId,
      });

      if (!kenyaPassportInfo) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Kenya passport info not found',
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      return res.status(StatusCodes.OK).json({
        success: true,
        data: kenyaPassportInfo
      });
    } catch (error) {
      console.error('Error fetching Kenya passport info:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error fetching Kenya passport info',
        error: error.message
      });
    }
  }),

  updateKenyaPassportInfo: expressAsyncHandler(async (req, res) => {
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

      const kenyaPassportInfo = await KenyaPassportInfo.findOneAndUpdate(
        { formId },
        updateData,
        { new: true }
      );

      if (!kenyaPassportInfo) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Kenya passport info not found',
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      return res.status(StatusCodes.OK).json({
        success: true,
        data: kenyaPassportInfo
      });
    } catch (error) {
      console.error('Error updating Kenya passport info:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error updating Kenya passport info',
        error: error.message
      });
    }
  }),
};

export default kenyaPassportInfoController;
