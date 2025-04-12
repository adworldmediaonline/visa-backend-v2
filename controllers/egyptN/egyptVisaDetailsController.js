import EgyptVisaDetails from '../../models/egyptN/egyptVisaDetailsModel.js';
import EgyptVisaApplicationN from '../../models/egyptN/egyptVisaApplicationModel.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { sendEgyptApplicationConfirmation } from '../../utils/egyptEmailConfigs.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const visaTypesAndPrices = JSON.parse(
  fs.readFileSync(path.join(__dirname, './visaTypesAndPrices.json'), 'utf8')
);

const egyptVisaDetailsController = {
  createEgyptVisaDetails: async (req, res) => {
    try {
      const {
        emailAddress,
        visaType,
        visaValidity,
        attachments
      } = req.body;

      // Validate required fields
      if (!emailAddress) {
        return res.status(400).json({
          error: 'Missing required fields',
          statusCode: 400,
        });
      }

      // Find the visa type in the JSON data to get the price
      let visaFee = 0;
      if (visaType && visaValidity) {
        const visaTypeData = visaTypesAndPrices.visaTypes.find(
          type => type.name === visaType
        );
        if (!visaTypeData) {
          return res.status(400).json({
            error: 'Invalid visa type',
            statusCode: 400,
          });
        }

        const validityData = visaTypeData.validities.find(
          v => v.type === visaValidity
        );
        if (!validityData) {
          return res.status(400).json({
            error: 'Invalid visa validity for the selected visa type',
            statusCode: 400,
          });
        }

        visaFee = validityData.price;
      }

      // First create the visa application
      const egyptVisaApplication = new EgyptVisaApplicationN({
        emailAddress,
        lastExitUrl: 'arrival-info',
      });

      const egyptVisaApplicationResult = await egyptVisaApplication.save();

      // Then create the visa details with the price from the JSON data
      const egyptVisaDetails = new EgyptVisaDetails({
        formId: egyptVisaApplicationResult._id,
        visaType,
        visaValidity,
        visaFee,
        attachments
      });

      const egyptVisaDetailsResult = await egyptVisaDetails.save();

      // Update the main application to reference these details
      const updatedEgyptVisaApplication = await EgyptVisaApplicationN.findOneAndUpdate(
        { _id: egyptVisaApplicationResult._id },
        { visaDetails: egyptVisaDetailsResult._id },
        { new: true }
      );

      try {
        await sendEgyptApplicationConfirmation(
          egyptVisaApplicationResult._id
        );
        console.log('Application confirmation email sent successfully');
      } catch (emailError) {
        console.error(
          'Error sending application confirmation email:',
          emailError
        );
        // Continue with the response even if email fails
      }

      // Return both the application and details
      return res.status(201).json({
        application: updatedEgyptVisaApplication,
        details: egyptVisaDetailsResult,
      });
    } catch (error) {
      console.error(
        'Error creating Egypt visa application and details:',
        error
      );
      return res.status(500).json({ error: error.message });
    }
  },

  getEgyptVisaDetailsByFormId: async (req, res) => {
    try {
      const { formId } = req.params;

      const egyptVisaDetails = await EgyptVisaDetails.findOne({ formId });

      if (!egyptVisaDetails) {
        return res.status(404).json({
          error: 'Egypt visa details not found',
          statusCode: 404,
        });
      }

      return res.status(200).json(egyptVisaDetails);
    } catch (error) {
      console.error('Error fetching Egypt visa details:', error);
      return res.status(500).json({ error: error.message });
    }
  },

  updateEgyptVisaDetails: async (req, res) => {
    try {
      const { formId } = req.params;
      const updateData = req.body;

      // If visa type or validity is being updated, recalculate the fee
      if (updateData.visaType || updateData.visaValidity) {
        const currentDetails = await EgyptVisaDetails.findOne({ formId });
        const visaType = updateData.visaType || currentDetails.visaType;
        const visaValidity = updateData.visaValidity || currentDetails.visaValidity;

        if (visaType && visaValidity) {
          const visaTypeData = visaTypesAndPrices.visaTypes.find(
            type => type.name === visaType
          );
          if (!visaTypeData) {
            return res.status(400).json({
              error: 'Invalid visa type',
              statusCode: 400,
            });
          }

          const validityData = visaTypeData.validities.find(
            v => v.type === visaValidity
          );
          if (!validityData) {
            return res.status(400).json({
              error: 'Invalid visa validity for the selected visa type',
              statusCode: 400,
            });
          }

          updateData.visaFee = validityData.price;
        }
      }

      const egyptVisaDetails = await EgyptVisaDetails.findOneAndUpdate(
        { formId },
        updateData,
        { new: true }
      );

      if (!egyptVisaDetails) {
        return res.status(404).json({
          error: 'Egypt visa details not found',
          statusCode: 404,
        });
      }

      return res.status(200).json(egyptVisaDetails);
    } catch (error) {
      console.error('Error updating Egypt visa details:', error);
      return res.status(500).json({ error: error.message });
    }
  },

  getVisaTypesAndPrices: async (req, res) => {
    try {
      return res.status(200).json(visaTypesAndPrices);
    } catch (error) {
      console.error('Error fetching visa types and prices:', error);
      return res.status(500).json({ error: error.message });
    }
  },
};

export default egyptVisaDetailsController;
