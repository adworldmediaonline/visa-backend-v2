import KenyaArrivalInfo from '../../models/kenya/kenyaArrivalInfoModel.js';
import KenyaVisaApplication from '../../models/kenya/kenyaVisaApplicationModel.js';
import { StatusCodes } from 'http-status-codes';
import expressAsyncHandler from 'express-async-handler';

const kenyaArrivalInfoController = {
  createKenyaArrivalInfo: expressAsyncHandler(async (req, res) => {
    try {
      const {
        formId,
        arrivalDate,
        arrivingBy,
        // Air arrival fields
        arrivalAirline,
        arrivalFlightNumber,
        arrivalAirPort,
        originCountry,
        // Sea arrival fields
        arrivalVesselName,
        arrivalSeaPort,
        // Land arrival fields
        landBorderCrossing,
        // Departure fields
        departureBy,
        // Air departure fields
        departureAirline,
        departureFlightNumber,
        departureAirPort,
        destinationCountry,
        // Sea departure fields
        departureVesselName,
        departureSeaPort,
        // Land departure fields
        departureLandBorderCrossing,
        // Accommodation fields
        accommodationName,
        accommodationFromDate,
        accommodationToDate,
      } = req.body;

      // Validate required fields
      if (
        !formId ||
        !arrivalDate ||
        !arrivingBy ||
        !departureBy ||
        !accommodationName ||
        !accommodationFromDate ||
        !accommodationToDate
      ) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Missing required fields',
          statusCode: StatusCodes.BAD_REQUEST,
        });
      }

      // Validate mode-specific required fields
      if (arrivingBy === "By Air" && (!arrivalAirline || !arrivalFlightNumber || !arrivalAirPort || !originCountry)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Missing required air arrival fields',
          statusCode: StatusCodes.BAD_REQUEST,
        });
      }

      if (arrivingBy === "By Sea" && (!arrivalVesselName || !arrivalSeaPort)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Missing required sea arrival fields',
          statusCode: StatusCodes.BAD_REQUEST,
        });
      }

      if (arrivingBy === "By Land" && !landBorderCrossing) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Missing required land arrival fields',
          statusCode: StatusCodes.BAD_REQUEST,
        });
      }

      if (departureBy === "By Air" && (!departureAirline || !departureFlightNumber || !departureAirPort || !destinationCountry)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Missing required air departure fields',
          statusCode: StatusCodes.BAD_REQUEST,
        });
      }

      if (departureBy === "By Sea" && (!departureVesselName || !departureSeaPort)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Missing required sea departure fields',
          statusCode: StatusCodes.BAD_REQUEST,
        });
      }

      if (departureBy === "By Land" && !departureLandBorderCrossing) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Missing required land departure fields',
          statusCode: StatusCodes.BAD_REQUEST,
        });
      }

      // Create the arrival info
      const kenyaArrivalInfo = new KenyaArrivalInfo({
        formId,
        arrivalDate,
        arrivingBy,
        // Air arrival fields
        arrivalAirline,
        arrivalFlightNumber,
        arrivalAirPort,
        originCountry,
        // Sea arrival fields
        arrivalVesselName,
        arrivalSeaPort,
        // Land arrival fields
        landBorderCrossing,
        // Departure fields
        departureBy,
        // Air departure fields
        departureAirline,
        departureFlightNumber,
        departureAirPort,
        destinationCountry,
        // Sea departure fields
        departureVesselName,
        departureSeaPort,
        // Land departure fields
        departureLandBorderCrossing,
        // Accommodation fields
        accommodationName,
        accommodationFromDate,
        accommodationToDate,
      });

      const kenyaArrivalInfoResult = await kenyaArrivalInfo.save();

      // Update the main application to reference this arrival info
      const updatedKenyaVisaApplication =
        await KenyaVisaApplication.findOneAndUpdate(
          { _id: formId },
          {
            arrivalInfo: kenyaArrivalInfoResult._id,
            lastExitUrl: 'personal-info',
          },
          { new: true }
        );

      if (!updatedKenyaVisaApplication) {
        // If the application doesn't exist, delete the arrival info we just created
        await KenyaArrivalInfo.findByIdAndDelete(
          kenyaArrivalInfoResult._id
        );
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Kenya visa application not found',
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      return res.status(StatusCodes.CREATED).json({
        success: true,
        data: kenyaArrivalInfoResult
      });
    } catch (error) {
      console.error('Error creating Kenya arrival info:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error creating Kenya arrival info',
        error: error.message
      });
    }
  }),

  getKenyaArrivalInfoByFormId: expressAsyncHandler(async (req, res) => {
    try {
      const { formId } = req.params;

      const kenyaArrivalInfo = await KenyaArrivalInfo.findOne({ formId });

      if (!kenyaArrivalInfo) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Kenya arrival info not found',
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      return res.status(StatusCodes.OK).json({
        success: true,
        data: kenyaArrivalInfo
      });
    } catch (error) {
      console.error('Error fetching Kenya arrival info:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error fetching Kenya arrival info',
        error: error.message
      });
    }
  }),

  updateKenyaArrivalInfo: expressAsyncHandler(async (req, res) => {
    try {
      const { formId } = req.params;
      const updateData = req.body;

      const kenyaArrivalInfo = await KenyaArrivalInfo.findOneAndUpdate(
        { formId },
        updateData,
        { new: true }
      );

      if (!kenyaArrivalInfo) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Kenya arrival info not found',
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      return res.status(StatusCodes.OK).json({
        success: true,
        data: kenyaArrivalInfo
      });
    } catch (error) {
      console.error('Error updating Kenya arrival info:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error updating Kenya arrival info',
        error: error.message
      });
    }
  }),
};

export default kenyaArrivalInfoController;
