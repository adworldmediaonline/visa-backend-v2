import EgyptDeclaration from '../../models/egyptN/egyptDeclarationModel.js';
import EgyptVisaApplicationN from '../../models/egyptN/egyptVisaApplicationModel.js';
import { StatusCodes } from 'http-status-codes';
import expressAsyncHandler from 'express-async-handler';

const egyptDeclarationController = {
    createEgyptDeclaration: expressAsyncHandler(async (req, res) => {
        try {
            const {
                formId,
                visitedBefore,
                dateFrom,
                dateTo,
                whereStayed,
                deportedFromEgyptOrOtherCountry,
                deportedDateFrom,
                deportedDateTo,
                whoIsPaying,
                hostType,
                hostName,
                hostPhoneNumber,
                hostEmail,
                hostAddress
            } = req.body;

            // Validate required fields
            if (
                !formId ||
                visitedBefore === undefined ||
                deportedFromEgyptOrOtherCountry === undefined
            ) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: 'Missing required fields',
                    statusCode: StatusCodes.BAD_REQUEST,
                });
            }

            // Create the declaration
            const egyptDeclaration = new EgyptDeclaration({
                formId,
                visitedBefore,
                dateFrom,
                dateTo,
                whereStayed,
                deportedFromEgyptOrOtherCountry,
                deportedDateFrom,
                deportedDateTo,
                whoIsPaying,
                hostType,
                hostName,
                hostPhoneNumber,
                hostEmail,
                hostAddress
            });

            const egyptDeclarationResult = await egyptDeclaration.save();

            // Update the main application to reference this declaration
            const updatedEgyptVisaApplication =
                await EgyptVisaApplicationN.findOneAndUpdate(
                    { _id: formId },
                    {
                        declaration: egyptDeclarationResult._id,
                        lastExitUrl: 'payment',
                        applicationStatus: 'pending'
                    },
                    { new: true }
                );

            if (!updatedEgyptVisaApplication) {
                // If the application doesn't exist, delete the declaration we just created
                await EgyptDeclaration.findByIdAndDelete(
                    egyptDeclarationResult._id
                );
                return res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    message: 'Egypt visa application not found',
                    statusCode: StatusCodes.NOT_FOUND,
                });
            }

            return res.status(StatusCodes.CREATED).json({
                success: true,
                data: egyptDeclarationResult
            });
        } catch (error) {
            console.error('Error creating Egypt declaration:', error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error creating Egypt declaration',
                error: error.message
            });
        }
    }),

    getEgyptDeclarationByFormId: expressAsyncHandler(async (req, res) => {
        try {
            const { formId } = req.params;

            const egyptDeclaration = await EgyptDeclaration.findOne({ formId });

            if (!egyptDeclaration) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    message: 'Egypt declaration not found',
                    statusCode: StatusCodes.NOT_FOUND,
                });
            }

            return res.status(StatusCodes.OK).json({
                success: true,
                data: egyptDeclaration
            });
        } catch (error) {
            console.error('Error fetching Egypt declaration:', error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error fetching Egypt declaration',
                error: error.message
            });
        }
    }),

    updateEgyptDeclaration: expressAsyncHandler(async (req, res) => {
        try {
            const { formId } = req.params;
            const updateData = req.body;

            const egyptDeclaration = await EgyptDeclaration.findOneAndUpdate(
                { formId },
                updateData,
                { new: true }
            );

            if (!egyptDeclaration) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    message: 'Egypt declaration not found',
                    statusCode: StatusCodes.NOT_FOUND,
                });
            }

            return res.status(StatusCodes.OK).json({
                success: true,
                data: egyptDeclaration
            });
        } catch (error) {
            console.error('Error updating Egypt declaration:', error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error updating Egypt declaration',
                error: error.message
            });
        }
    }),
};

export default egyptDeclarationController;
