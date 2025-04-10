import KenyaDeclaration from '../../models/kenya/kenyaDeclarationModel.js';
import KenyaVisaApplication from '../../models/kenya/kenyaVisaApplicationModel.js';
import { StatusCodes } from 'http-status-codes';
import expressAsyncHandler from 'express-async-handler';

const kenyaDeclarationController = {
    createKenyaDeclaration: expressAsyncHandler(async (req, res) => {
        try {
            const {
                formId,
                tripFinanced,
                convictedOfOffence,
                deniedEntryToKenya,
                previousTravelToKenya,
                monetaryInstrument,
                monetaryInstrumentName,
                monetaryInstrumentCurrency,
                amount
            } = req.body;

            // Validate required fields
            if (
                !formId ||
                tripFinanced === undefined ||
                convictedOfOffence === undefined ||
                deniedEntryToKenya === undefined ||
                previousTravelToKenya === undefined ||
                monetaryInstrument === undefined
            ) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: 'Missing required fields',
                    statusCode: StatusCodes.BAD_REQUEST,
                });
            }

            // Create the declaration
            const kenyaDeclaration = new KenyaDeclaration({
                formId,
                tripFinanced,
                convictedOfOffence,
                deniedEntryToKenya,
                previousTravelToKenya,
                monetaryInstrument,
                monetaryInstrumentName,
                monetaryInstrumentCurrency,
                amount
            });

            const kenyaDeclarationResult = await kenyaDeclaration.save();

            // Update the main application to reference this declaration
            const updatedKenyaVisaApplication =
                await KenyaVisaApplication.findOneAndUpdate(
                    { _id: formId },
                    {
                        declaration: kenyaDeclarationResult._id,
                        lastExitUrl: 'payment',
                        applicationStatus: 'pending'
                    },
                    { new: true }
                );

            if (!updatedKenyaVisaApplication) {
                // If the application doesn't exist, delete the declaration we just created
                await KenyaDeclaration.findByIdAndDelete(
                    kenyaDeclarationResult._id
                );
                return res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    message: 'Kenya visa application not found',
                    statusCode: StatusCodes.NOT_FOUND,
                });
            }

            return res.status(StatusCodes.CREATED).json({
                success: true,
                data: kenyaDeclarationResult
            });
        } catch (error) {
            console.error('Error creating Kenya declaration:', error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error creating Kenya declaration',
                error: error.message
            });
        }
    }),

    getKenyaDeclarationByFormId: expressAsyncHandler(async (req, res) => {
        try {
            const { formId } = req.params;

            const kenyaDeclaration = await KenyaDeclaration.findOne({ formId });

            if (!kenyaDeclaration) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    message: 'Kenya declaration not found',
                    statusCode: StatusCodes.NOT_FOUND,
                });
            }

            return res.status(StatusCodes.OK).json({
                success: true,
                data: kenyaDeclaration
            });
        } catch (error) {
            console.error('Error fetching Kenya declaration:', error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error fetching Kenya declaration',
                error: error.message
            });
        }
    }),

    updateKenyaDeclaration: expressAsyncHandler(async (req, res) => {
        try {
            const { formId } = req.params;
            const updateData = req.body;

            const kenyaDeclaration = await KenyaDeclaration.findOneAndUpdate(
                { formId },
                updateData,
                { new: true }
            );

            if (!kenyaDeclaration) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    message: 'Kenya declaration not found',
                    statusCode: StatusCodes.NOT_FOUND,
                });
            }

            return res.status(StatusCodes.OK).json({
                success: true,
                data: kenyaDeclaration
            });
        } catch (error) {
            console.error('Error updating Kenya declaration:', error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error updating Kenya declaration',
                error: error.message
            });
        }
    }),
};

export default kenyaDeclarationController;
