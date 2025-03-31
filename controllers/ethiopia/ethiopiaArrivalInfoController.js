import EthiopiaArrivalInfo from '../../models/ethiopia/ethiopiaArrivalInfoModel.js';
import EthiopiaVisaApplication from '../../models/ethiopia/ethiopiaVisaApplicationModel.js';

const ethiopiaArrivalInfoController = {
  createEthiopiaArrivalInfo: async (req, res) => {
    try {
      const {
        formId,
        arrivalDate,
        departureCountry,
        departureCity,
        airline,
        flightNumber,
        accommodationType,
        accommodationName,
        accommodationCity,
        accommodationStreetAddress,
        accommodationTelephone,
      } = req.body;

      // Validate required fields
      if (
        !formId ||
        !arrivalDate ||
        !departureCountry ||
        !departureCity ||
        !accommodationType ||
        !accommodationName ||
        !accommodationCity ||
        !accommodationStreetAddress ||
        !accommodationTelephone
      ) {
        return res.status(400).json({
          error: 'Missing required fields',
          statusCode: 400,
        });
      }

      // Create the arrival info
      const ethiopiaArrivalInfo = new EthiopiaArrivalInfo({
        formId,
        arrivalDate,
        departureCountry,
        departureCity,
        airline,
        flightNumber,
        accommodationType,
        accommodationName,
        accommodationCity,
        accommodationStreetAddress,
        accommodationTelephone,
      });

      const ethiopiaArrivalInfoResult = await ethiopiaArrivalInfo.save();

      // Update the main application to reference this arrival info
      const updatedEthiopiaVisaApplication =
        await EthiopiaVisaApplication.findOneAndUpdate(
          { _id: formId },
          {
            arrivalInfo: ethiopiaArrivalInfoResult._id,
            lastExitUrl: 'personal-info',
          },
          { new: true }
        );

      if (!updatedEthiopiaVisaApplication) {
        // If the application doesn't exist, delete the arrival info we just created
        await EthiopiaArrivalInfo.findByIdAndDelete(
          ethiopiaArrivalInfoResult._id
        );
        return res.status(404).json({
          error: 'Ethiopia visa application not found',
          statusCode: 404,
        });
      }

      return res.status(201).json(ethiopiaArrivalInfoResult);
    } catch (error) {
      console.error('Error creating Ethiopia arrival info:', error);
      return res.status(500).json({ error: error.message });
    }
  },

  getEthiopiaArrivalInfoByFormId: async (req, res) => {
    try {
      const { formId } = req.params;

      const ethiopiaArrivalInfo = await EthiopiaArrivalInfo.findOne({ formId });

      if (!ethiopiaArrivalInfo) {
        return res.status(404).json({
          error: 'Ethiopia arrival info not found',
          statusCode: 404,
        });
      }

      return res.status(200).json(ethiopiaArrivalInfo);
    } catch (error) {
      console.error('Error fetching Ethiopia arrival info:', error);
      return res.status(500).json({ error: error.message });
    }
  },

  updateEthiopiaArrivalInfo: async (req, res) => {
    try {
      const { formId } = req.params;
      const updateData = req.body;

      const ethiopiaArrivalInfo = await EthiopiaArrivalInfo.findOneAndUpdate(
        { formId },
        updateData,
        { new: true }
      );

      if (!ethiopiaArrivalInfo) {
        return res.status(404).json({
          error: 'Ethiopia arrival info not found',
          statusCode: 404,
        });
      }

      return res.status(200).json(ethiopiaArrivalInfo);
    } catch (error) {
      console.error('Error updating Ethiopia arrival info:', error);
      return res.status(500).json({ error: error.message });
    }
  },
};

export default ethiopiaArrivalInfoController;
