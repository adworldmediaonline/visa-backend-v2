import expressAsyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import IndiaGovRefDetails from '../../models/govRefDetails.js';
import VisaRequestForm from '../../models/visa.js';

// Create or update government reference details
export const createOrUpdateGovRefDetails = expressAsyncHandler(async (req, res) => {
    try {
        const {
            govRefEmail,
            govRefNumber,
            comment,
            visaApplicationId
        } = req.body;

        // Validate required fields
        if (!visaApplicationId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'Visa application ID is required'
            });
        }

        // Find existing record or create new one
        let govRefDetails = await IndiaGovRefDetails.findOne({
            visaApplicationId
        });

        if (govRefDetails) {
            // Update existing record
            govRefDetails.govRefEmail = govRefEmail;
            govRefDetails.govRefNumber = govRefNumber;
            govRefDetails.comment = comment;
            await govRefDetails.save();
        } else {
            // Create new record
            govRefDetails = await IndiaGovRefDetails.create({
                govRefEmail,
                govRefNumber,
                comment,
                visaApplicationId
            });
        }

        await VisaRequestForm.findByIdAndUpdate(
            visaApplicationId,
            { govRefDetails: govRefDetails._id },
            { new: true }
        );

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Government reference details saved successfully',
            data: govRefDetails
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Error saving government reference details',
            error: error.message
        });
    }
});

// Get government reference details
export const getGovRefDetails = expressAsyncHandler(async (req, res) => {
    try {
        const { applicationId } = req.params;

        const govRefDetails = await IndiaGovRefDetails.findOne({
            visaApplicationId: applicationId
        });

        if (!govRefDetails) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: 'Government reference details not found'
            });
        }

        res.status(StatusCodes.OK).json({
            success: true,
            data: govRefDetails
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Error retrieving government reference details',
            error: error.message
        });
    }
});

// Delete government reference details
export const deleteGovRefDetails = expressAsyncHandler(async (req, res) => {
    try {
        const { applicationId } = req.params;

        const result = await IndiaGovRefDetails.findOneAndDelete({
            visaApplicationId: applicationId
        });

        if (!result) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: 'Government reference details not found'
            });
        }

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Government reference details deleted successfully'
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Error deleting government reference details',
            error: error.message
        });
    }
});
