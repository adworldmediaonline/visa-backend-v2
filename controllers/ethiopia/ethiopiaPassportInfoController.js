import EthiopiaPassportInfo from '../../models/ethiopia/ethiopiaPassportInfoModel.js';
import EthiopiaVisaApplication from '../../models/ethiopia/ethiopiaVisaApplicationModel.js';

const ethiopiaPassportInfoController = {
  createEthiopiaPassportInfo: async (req, res) => {
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
        return res.status(400).json({
          error: 'Missing required fields',
          statusCode: 400,
        });
      }

      // Validate passport expiry date
      const currentDate = new Date();
      const expiryDate = new Date(passportExpiryDate);

      if (expiryDate < currentDate) {
        return res.status(400).json({
          error: 'Passport is expired',
          statusCode: 400,
        });
      }

      // Create the passport info
      const ethiopiaPassportInfo = new EthiopiaPassportInfo({
        formId,
        passportType,
        passportNumber,
        passportIssueDate,
        passportExpiryDate,
        passportIssuingCountry,
        passportIssuingAuthority,
      });

      const ethiopiaPassportInfoResult = await ethiopiaPassportInfo.save();

      // Update the main application to reference this passport info
      const updatedEthiopiaVisaApplication =
        await EthiopiaVisaApplication.findOneAndUpdate(
          { _id: formId },
          {
            passportInfo: ethiopiaPassportInfoResult._id,
            lastExitUrl: 'review',
          },
          { new: true }
        );

      if (!updatedEthiopiaVisaApplication) {
        // If the application doesn't exist, delete the passport info we just created
        await EthiopiaPassportInfo.findByIdAndDelete(
          ethiopiaPassportInfoResult._id
        );
        return res.status(404).json({
          error: 'Ethiopia visa application not found',
          statusCode: 404,
        });
      }

      // Check if all steps are complete and update application status if they are
      const completeApplication = await EthiopiaVisaApplication.findById(formId)
        .populate('visaDetails')
        .populate('arrivalInfo')
        .populate('personalInfo')
        .populate('passportInfo');

      if (completeApplication.isComplete) {
        await EthiopiaVisaApplication.findByIdAndUpdate(
          formId,
          { applicationStatus: 'submitted' },
          { new: true }
        );
      }

      return res.status(201).json(ethiopiaPassportInfoResult);
    } catch (error) {
      console.error('Error creating Ethiopia passport info:', error);
      return res.status(500).json({ error: error.message });
    }
  },

  getEthiopiaPassportInfoByFormId: async (req, res) => {
    try {
      const { formId } = req.params;

      const ethiopiaPassportInfo = await EthiopiaPassportInfo.findOne({
        formId,
      });

      if (!ethiopiaPassportInfo) {
        return res.status(404).json({
          error: 'Ethiopia passport info not found',
          statusCode: 404,
        });
      }

      return res.status(200).json(ethiopiaPassportInfo);
    } catch (error) {
      console.error('Error fetching Ethiopia passport info:', error);
      return res.status(500).json({ error: error.message });
    }
  },

  updateEthiopiaPassportInfo: async (req, res) => {
    try {
      const { formId } = req.params;
      const updateData = req.body;

      // If updating expiry date, validate it
      if (updateData.passportExpiryDate) {
        const currentDate = new Date();
        const expiryDate = new Date(updateData.passportExpiryDate);

        if (expiryDate < currentDate) {
          return res.status(400).json({
            error: 'Passport is expired',
            statusCode: 400,
          });
        }
      }

      const ethiopiaPassportInfo = await EthiopiaPassportInfo.findOneAndUpdate(
        { formId },
        updateData,
        { new: true }
      );

      if (!ethiopiaPassportInfo) {
        return res.status(404).json({
          error: 'Ethiopia passport info not found',
          statusCode: 404,
        });
      }

      return res.status(200).json(ethiopiaPassportInfo);
    } catch (error) {
      console.error('Error updating Ethiopia passport info:', error);
      return res.status(500).json({ error: error.message });
    }
  },
};

export default ethiopiaPassportInfoController;
