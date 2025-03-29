import EthiopiaVisaDetails from '../../models/ethiopia/ethiopiaVisaDetailsModel.js';
import EthiopiaVisaApplication from '../../models/ethiopia/ethiopiaVisaApplicationModel.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const visaTypesAndPrices = JSON.parse(
    fs.readFileSync(path.join(__dirname, './visaTypesAndPrices.json'), 'utf8')
);

const ethiopiaVisaDetailsController = {
    createEthiopiaVisaDetails: async (req, res) => {
        try {
            const { emailAddress, visaType, visaValidity, companyReferenceNumber, attachments } = req.body;

            // Validate required fields
            if (!emailAddress || !visaType || !visaValidity) {
                return res.status(400).json({
                    error: 'Missing required fields',
                    statusCode: 400
                });
            }

            // Find the visa type in the JSON data to get the price
            const visaTypeData = visaTypesAndPrices.visaTypes.find(type => type.name === visaType);
            if (!visaTypeData) {
                return res.status(400).json({
                    error: 'Invalid visa type',
                    statusCode: 400
                });
            }

            const validityData = visaTypeData.validities.find(v => v.type === visaValidity);
            if (!validityData) {
                return res.status(400).json({
                    error: 'Invalid visa validity for the selected visa type',
                    statusCode: 400
                });
            }

            // First create the visa application
            const ethiopiaVisaApplication = new EthiopiaVisaApplication({
                emailAddress,
                lastExitUrl: "arrival_info",
            });

            const ethiopiaVisaApplicationResult = await ethiopiaVisaApplication.save();

            // Then create the visa details with the price from the JSON data
            const ethiopiaVisaDetails = new EthiopiaVisaDetails({
                formId: ethiopiaVisaApplicationResult._id,
                visaType,
                visaValidity,
                companyReferenceNumber,
                visaFee: validityData.price,
                attachments
            });

            const ethiopiaVisaDetailsResult = await ethiopiaVisaDetails.save();

            // Update the main application to reference these details
            const updatedEthiopiaVisaApplication = await EthiopiaVisaApplication.findOneAndUpdate(
                { _id: ethiopiaVisaApplicationResult._id },
                { visaDetails: ethiopiaVisaDetailsResult._id },
                { new: true }
            );

            // Return both the application and details
            return res.status(201).json({
                application: updatedEthiopiaVisaApplication,
                details: ethiopiaVisaDetailsResult
            });
        } catch (error) {
            console.error('Error creating Ethiopia visa application and details:', error);
            return res.status(500).json({ error: error.message });
        }
    },

    getEthiopiaVisaDetailsByFormId: async (req, res) => {
        try {
            const { formId } = req.params;

            const ethiopiaVisaDetails = await EthiopiaVisaDetails.findOne({ formId });

            if (!ethiopiaVisaDetails) {
                return res.status(404).json({
                    error: 'Ethiopia visa details not found',
                    statusCode: 404
                });
            }

            return res.status(200).json(ethiopiaVisaDetails);
        } catch (error) {
            console.error('Error fetching Ethiopia visa details:', error);
            return res.status(500).json({ error: error.message });
        }
    },

    updateEthiopiaVisaDetails: async (req, res) => {
        try {
            const { formId } = req.params;
            const updateData = req.body;

            // If visa type or validity is being updated, recalculate the fee
            if (updateData.visaType || updateData.visaValidity) {
                const visaType = updateData.visaType || (await EthiopiaVisaDetails.findOne({ formId })).visaType;
                const visaValidity = updateData.visaValidity || (await EthiopiaVisaDetails.findOne({ formId })).visaValidity;

                const visaTypeData = visaTypesAndPrices.visaTypes.find(type => type.name === visaType);
                if (!visaTypeData) {
                    return res.status(400).json({
                        error: 'Invalid visa type',
                        statusCode: 400
                    });
                }

                const validityData = visaTypeData.validities.find(v => v.type === visaValidity);
                if (!validityData) {
                    return res.status(400).json({
                        error: 'Invalid visa validity for the selected visa type',
                        statusCode: 400
                    });
                }

                updateData.visaFee = validityData.price;
            }

            const ethiopiaVisaDetails = await EthiopiaVisaDetails.findOneAndUpdate(
                { formId },
                updateData,
                { new: true }
            );

            if (!ethiopiaVisaDetails) {
                return res.status(404).json({
                    error: 'Ethiopia visa details not found',
                    statusCode: 404
                });
            }

            return res.status(200).json(ethiopiaVisaDetails);
        } catch (error) {
            console.error('Error updating Ethiopia visa details:', error);
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
    }
};

export default ethiopiaVisaDetailsController;
