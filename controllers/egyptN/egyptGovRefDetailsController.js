import expressAsyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import EgyptVisaApplicationN from '../../models/egyptN/egyptVisaApplicationModel.js';
import EgyptGovRefDetails from '../../models/egyptN/egyptGovRefDetailsModel.js';

// Create or update government reference details
const createOrUpdateGovRefDetails = expressAsyncHandler(async (req, res) => {
    try {
        const {
            applicationId,
            govRefEmail,
            govRefNumber,
            comment,
            applicantType = 'primary',
            additionalApplicantIndex = null,
        } = req.body;

        if (!applicationId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'Application ID is required',
            });
        }

        // Check if application exists
        const application = await EgyptVisaApplicationN.findById(applicationId);
        if (!application) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: 'Visa application not found',
            });
        }

        // Find or create government reference details
        let govRefDetails;
        let query = {
            visaApplicationId: applicationId,
            applicationType: applicantType,
        };

        if (applicantType === 'additional' && additionalApplicantIndex !== null) {
            query.additionalApplicantIndex = additionalApplicantIndex;
        }

        govRefDetails = await EgyptGovRefDetails.findOne(query);

        if (!govRefDetails) {
            govRefDetails = new EgyptGovRefDetails({
                visaApplicationId: applicationId,
                applicationType: applicantType,
                additionalApplicantIndex:
                    applicantType === 'additional' ? additionalApplicantIndex : null,
            });
        }

        // Update fields
        if (govRefEmail !== undefined) govRefDetails.govRefEmail = govRefEmail;
        if (govRefNumber !== undefined) govRefDetails.govRefNumber = govRefNumber;
        if (comment !== undefined) govRefDetails.comment = comment;

        await govRefDetails.save();

        // Update the application with the reference to govRefDetails
        if (applicantType === 'primary') {
            application.govRefDetails = govRefDetails._id;
        } else if (
            applicantType === 'additional' &&
            additionalApplicantIndex !== null
        ) {
            if (!application.additionalApplicants[additionalApplicantIndex]) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: 'Additional applicant not found at the specified index',
                });
            }
            application.additionalApplicants[additionalApplicantIndex].govRefDetails =
                govRefDetails._id;
        }

        await application.save();

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Government reference details saved successfully',
            data: govRefDetails,
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Error saving government reference details',
            error: error.message,
        });
    }
});

// Get government reference details
const getGovRefDetails = expressAsyncHandler(async (req, res) => {
    try {
        const {
            applicationId,
            applicantType = 'primary',
            additionalApplicantIndex = null,
        } = req.params;

        let query = {
            visaApplicationId: applicationId,
            applicationType: applicantType,
        };

        if (applicantType === 'additional' && additionalApplicantIndex !== null) {
            query.additionalApplicantIndex = additionalApplicantIndex;
        }

        const govRefDetails = await EgyptGovRefDetails.findOne(query);

        if (!govRefDetails) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: 'Government reference details not found for this application',
            });
        }

        res.status(StatusCodes.OK).json({
            success: true,
            data: govRefDetails,
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Error retrieving government reference details',
            error: error.message,
        });
    }
});

// Delete government reference details
const deleteGovRefDetails = expressAsyncHandler(async (req, res) => {
    try {
        const {
            applicationId,
            applicantType = 'primary',
            additionalApplicantIndex = null,
        } = req.params;

        let query = {
            visaApplicationId: applicationId,
            applicationType: applicantType,
        };

        if (applicantType === 'additional' && additionalApplicantIndex !== null) {
            query.additionalApplicantIndex = additionalApplicantIndex;
        }

        const govRefDetails = await EgyptGovRefDetails.findOne(query);

        if (!govRefDetails) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: 'Government reference details not found',
            });
        }

        // Remove reference from application
        const application = await EgyptVisaApplicationN.findById(applicationId);
        if (application) {
            if (applicantType === 'primary') {
                application.govRefDetails = undefined;
            } else if (
                applicantType === 'additional' &&
                additionalApplicantIndex !== null &&
                application.additionalApplicants[additionalApplicantIndex]
            ) {
                application.additionalApplicants[
                    additionalApplicantIndex
                ].govRefDetails = undefined;
            }
            await application.save();
        }

        // Delete the government reference details
        await EgyptGovRefDetails.findByIdAndDelete(govRefDetails._id);

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Government reference details deleted successfully',
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Error deleting government reference details',
            error: error.message,
        });
    }
});

export { createOrUpdateGovRefDetails, getGovRefDetails, deleteGovRefDetails };
