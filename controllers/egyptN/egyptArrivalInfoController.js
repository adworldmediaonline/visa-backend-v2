import EgyptArrivalInfo from '../../models/egyptN/egyptArrivalInfoModel.js';
import EgyptVisaApplicationN from '../../models/egyptN/egyptVisaApplicationModel.js';
import { StatusCodes } from 'http-status-codes';
import expressAsyncHandler from 'express-async-handler';

const egyptArrivalInfoController = {
  createEgyptArrivalInfo: expressAsyncHandler(async (req, res) => {
    try {
      const {
        formId,
        travellingFrom,
        arrivalDate,
        departureDate
      } = req.body;

      // Validate required fields
      if (
        !formId ||
        !travellingFrom ||
        !arrivalDate ||
        !departureDate
      ) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Missing required fields',
          statusCode: StatusCodes.BAD_REQUEST,
        });
      }

      // Create the arrival info
      const egyptArrivalInfo = new EgyptArrivalInfo({
        formId,
        travellingFrom,
        arrivalDate,
        departureDate
      });

      const egyptArrivalInfoResult = await egyptArrivalInfo.save();

      // Update the main application to reference this arrival info
      const updatedEgyptVisaApplication =
        await EgyptVisaApplicationN.findOneAndUpdate(
          { _id: formId },
          {
            arrivalInfo: egyptArrivalInfoResult._id,
            lastExitUrl: 'personal-info',
          },
          { new: true }
        );

      if (!updatedEgyptVisaApplication) {
        // If the application doesn't exist, delete the arrival info we just created
        await EgyptArrivalInfo.findByIdAndDelete(
          egyptArrivalInfoResult._id
        );
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Egypt visa application not found',
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      return res.status(StatusCodes.CREATED).json({
        success: true,
        data: egyptArrivalInfoResult
      });
    } catch (error) {
      console.error('Error creating Egypt arrival info:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error creating Egypt arrival info',
        error: error.message
      });
    }
  }),

  getEgyptArrivalInfoByFormId: expressAsyncHandler(async (req, res) => {
    try {
      const { formId } = req.params;

      const egyptArrivalInfo = await EgyptArrivalInfo.findOne({ formId });

      if (!egyptArrivalInfo) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Egypt arrival info not found',
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      return res.status(StatusCodes.OK).json({
        success: true,
        data: egyptArrivalInfo
      });
    } catch (error) {
      console.error('Error fetching Egypt arrival info:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error fetching Egypt arrival info',
        error: error.message
      });
    }
  }),

  updateEgyptArrivalInfo: expressAsyncHandler(async (req, res) => {
    try {
      const { formId } = req.params;
      const updateData = req.body;

      const egyptArrivalInfo = await EgyptArrivalInfo.findOneAndUpdate(
        { formId },
        updateData,
        { new: true }
      );

      if (!egyptArrivalInfo) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Egypt arrival info not found',
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      return res.status(StatusCodes.OK).json({
        success: true,
        data: egyptArrivalInfo
      });
    } catch (error) {
      console.error('Error updating Egypt arrival info:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error updating Egypt arrival info',
        error: error.message
      });
    }
  }),
};

export default egyptArrivalInfoController;
