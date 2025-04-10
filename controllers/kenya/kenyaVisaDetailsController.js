import KenyaVisaDetails from '../../models/kenya/kenyaVisaDetailsModel.js';
import KenyaVisaApplication from '../../models/kenya/kenyaVisaApplicationModel.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { sendKenyaApplicationConfirmation } from '../../utils/kenyaEailConfigs.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const visaTypesAndPrices = JSON.parse(
  fs.readFileSync(path.join(__dirname, './visaTypesAndPrices.json'), 'utf8')
);

const kenyaVisaDetailsController = {
  createKenyaVisaDetails: async (req, res) => {
    try {
      const {
        emailAddress,
        visaType,
        visaValidity,
        companyReferenceNumber,
        attachments,
        reasonForTravel
      } = req.body;

      // Validate required fields
      if (!emailAddress || !reasonForTravel) {
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
      const kenyaVisaApplication = new KenyaVisaApplication({
        emailAddress,
        lastExitUrl: 'arrival-info',
      });

      const kenyaVisaApplicationResult = await kenyaVisaApplication.save();

      // Then create the visa details with the price from the JSON data
      const kenyaVisaDetails = new KenyaVisaDetails({
        formId: kenyaVisaApplicationResult._id,
        visaType,
        visaValidity,
        companyReferenceNumber,
        visaFee,
        attachments,
        reasonForTravel
      });

      const kenyaVisaDetailsResult = await kenyaVisaDetails.save();

      // Update the main application to reference these details
      const updatedKenyaVisaApplication = await KenyaVisaApplication.findOneAndUpdate(
        { _id: kenyaVisaApplicationResult._id },
        { visaDetails: kenyaVisaDetailsResult._id },
        { new: true }
      );

      try {
        await sendKenyaApplicationConfirmation(
          kenyaVisaApplicationResult._id
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
        application: updatedKenyaVisaApplication,
        details: kenyaVisaDetailsResult,
      });
    } catch (error) {
      console.error(
        'Error creating Kenya visa application and details:',
        error
      );
      return res.status(500).json({ error: error.message });
    }
  },

  getKenyaVisaDetailsByFormId: async (req, res) => {
    try {
      const { formId } = req.params;

      const kenyaVisaDetails = await KenyaVisaDetails.findOne({ formId });

      if (!kenyaVisaDetails) {
        return res.status(404).json({
          error: 'Kenya visa details not found',
          statusCode: 404,
        });
      }

      return res.status(200).json(kenyaVisaDetails);
    } catch (error) {
      console.error('Error fetching Kenya visa details:', error);
      return res.status(500).json({ error: error.message });
    }
  },

  updateKenyaVisaDetails: async (req, res) => {
    try {
      const { formId } = req.params;
      const updateData = req.body;

      // If visa type or validity is being updated, recalculate the fee
      if (updateData.visaType || updateData.visaValidity) {
        const currentDetails = await KenyaVisaDetails.findOne({ formId });
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

      const kenyaVisaDetails = await KenyaVisaDetails.findOneAndUpdate(
        { formId },
        updateData,
        { new: true }
      );

      if (!kenyaVisaDetails) {
        return res.status(404).json({
          error: 'Kenya visa details not found',
          statusCode: 404,
        });
      }

      return res.status(200).json(kenyaVisaDetails);
    } catch (error) {
      console.error('Error updating Kenya visa details:', error);
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

export default kenyaVisaDetailsController;
