import EthiopiaPersonalInfo from '../../models/ethiopia/ethiopiaPersonalInfoModel.js';
import EthiopiaVisaApplication from '../../models/ethiopia/ethiopiaVisaApplicationModel.js';

const ethiopiaPersonalInfoController = {
  createEthiopiaPersonalInfo: async (req, res) => {
    try {
      const {
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
        addressCountry
      } = req.body;

      // Validate required fields
      if (!formId || !givenName || !surname || !citizenship || !gender ||
        !countryOfBirth || !dateOfBirth || !placeOfBirth || !email ||
        !phoneNumber || !occupation || !streetAddress || !addressCity ||
        !addressCountry) {
        return res.status(400).json({
          error: 'Missing required fields',
          statusCode: 400
        });
      }

      // Create the personal info
      const ethiopiaPersonalInfo = new EthiopiaPersonalInfo({
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
        addressCountry
      });

      const ethiopiaPersonalInfoResult = await ethiopiaPersonalInfo.save();

      // Update the main application to reference this personal info
      const updatedEthiopiaVisaApplication = await EthiopiaVisaApplication.findOneAndUpdate(
        { _id: formId },
        { personalInfo: ethiopiaPersonalInfoResult._id, lastExitUrl: "passport-info" },
        { new: true }
      );

      if (!updatedEthiopiaVisaApplication) {
        // If the application doesn't exist, delete the personal info we just created
        await EthiopiaPersonalInfo.findByIdAndDelete(ethiopiaPersonalInfoResult._id);
        return res.status(404).json({
          error: 'Ethiopia visa application not found',
          statusCode: 404
        });
      }

      return res.status(201).json(ethiopiaPersonalInfoResult);
    } catch (error) {
      console.error('Error creating Ethiopia personal info:', error);
      return res.status(500).json({ error: error.message });
    }
  },

  getEthiopiaPersonalInfoByFormId: async (req, res) => {
    try {
      const { formId } = req.params;

      const ethiopiaPersonalInfo = await EthiopiaPersonalInfo.findOne({ formId });

      if (!ethiopiaPersonalInfo) {
        return res.status(404).json({
          error: 'Ethiopia personal info not found',
          statusCode: 404
        });
      }

      return res.status(200).json(ethiopiaPersonalInfo);
    } catch (error) {
      console.error('Error fetching Ethiopia personal info:', error);
      return res.status(500).json({ error: error.message });
    }
  },

  updateEthiopiaPersonalInfo: async (req, res) => {
    try {
      const { formId } = req.params;
      const updateData = req.body;

      const ethiopiaPersonalInfo = await EthiopiaPersonalInfo.findOneAndUpdate(
        { formId },
        updateData,
        { new: true }
      );

      if (!ethiopiaPersonalInfo) {
        return res.status(404).json({
          error: 'Ethiopia personal info not found',
          statusCode: 404
        });
      }

      return res.status(200).json(ethiopiaPersonalInfo);
    } catch (error) {
      console.error('Error updating Ethiopia personal info:', error);
      return res.status(500).json({ error: error.message });
    }
  }
};

export default ethiopiaPersonalInfoController;
