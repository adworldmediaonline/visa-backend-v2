import expressAsyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import {
    sendEgyptDocumentReminder,
    sendEgyptPassportReminder,
    sendEgyptPhotoReminder,
    sendEgyptApplicationConfirmation,
    sendEgyptSpecificDocumentReminder,
    sendEgyptPaymentReminder
} from '../../utils/egyptEmailConfigs.js';

/**
 * Send document reminder email for Egypt visa application
 */
const sendDocumentReminderEmail = expressAsyncHandler(async (req, res) => {
    try {
        const { applicationId } = req.params;

        const result = await sendEgyptDocumentReminder(applicationId);

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Document reminder email sent successfully',
            data: result
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Error sending document reminder email',
            error: error.message
        });
    }
});

/**
 * Send payment reminder email for Egypt visa application
 */
const sendPaymentReminderEmail = expressAsyncHandler(async (req, res) => {
    try {
        const { applicationId } = req.params;

        const result = await sendEgyptPaymentReminder(applicationId);

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Payment reminder email sent successfully',
            data: result
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Error sending payment reminder email',
            error: error.message
        });
    }
});

/**
 * Send passport reminder email for Egypt visa application
 */
const sendPassportReminderEmail = expressAsyncHandler(async (req, res) => {
    try {
        const { applicationId } = req.params;

        const result = await sendEgyptPassportReminder(applicationId);

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Passport reminder email sent successfully',
            data: result
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Error sending passport reminder email',
            error: error.message
        });
    }
});

/**
 * Send photo reminder email for Egypt visa application
 */
const sendPhotoReminderEmail = expressAsyncHandler(async (req, res) => {
    try {
        const { applicationId } = req.params;

        const result = await sendEgyptPhotoReminder(applicationId);

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Photo reminder email sent successfully',
            data: result
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Error sending photo reminder email',
            error: error.message
        });
    }
});

/**
 * Send application confirmation email for Egypt visa application
 */
const sendApplicationConfirmationEmail = expressAsyncHandler(async (req, res) => {
    try {
        const { applicationId } = req.params;

        const result = await sendEgyptApplicationConfirmation(applicationId);

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Application confirmation email sent successfully',
            data: result
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Error sending application confirmation email',
            error: error.message
        });
    }
});

/**
 * Send specific document reminder email for Egypt visa application
 */
const sendSpecificDocumentReminderEmail = expressAsyncHandler(async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { requiredDocuments } = req.body;

        if (!requiredDocuments) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'Required documents list is required'
            });
        }

        const result = await sendEgyptSpecificDocumentReminder(applicationId, requiredDocuments);

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Specific document reminder email sent successfully',
            data: result
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Error sending specific document reminder email',
            error: error.message
        });
    }
});

export {
    sendDocumentReminderEmail,
    sendPaymentReminderEmail,
    sendPassportReminderEmail,
    sendPhotoReminderEmail,
    sendApplicationConfirmationEmail,
    sendSpecificDocumentReminderEmail
};
