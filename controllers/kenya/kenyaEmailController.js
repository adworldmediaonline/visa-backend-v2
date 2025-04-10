import expressAsyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import {
    sendKenyaDocumentReminder,
    sendKenyaPassportReminder,
    sendKenyaPhotoReminder,
    sendKenyaApplicationConfirmation,
    sendKenyaSpecificDocumentReminder,
    sendKenyaPaymentReminder
} from '../../utils/kenyaEailConfigs.js';

/**
 * Send document reminder email for Kenya visa application
 */
const sendDocumentReminderEmail = expressAsyncHandler(async (req, res) => {
    try {
        const { applicationId } = req.params;

        const result = await sendKenyaDocumentReminder(applicationId);

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

const sendPaymentRemaiderEmail = expressAsyncHandler(async (req, res) => {
    try {
        const { applicationId } = req.params;

        const result = await sendKenyaPaymentReminder(applicationId);

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
 * Send passport reminder email for Kenya visa application
 */
const sendPassportReminderEmail = expressAsyncHandler(async (req, res) => {
    try {
        const { applicationId } = req.params;

        const result = await sendKenyaPassportReminder(applicationId);

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
 * Send photo reminder email for Kenya visa application
 */
const sendPhotoReminderEmail = expressAsyncHandler(async (req, res) => {
    try {
        const { applicationId } = req.params;

        const result = await sendKenyaPhotoReminder(applicationId);

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
 * Send application confirmation email for Kenya visa application
 */
const sendApplicationConfirmationEmail = expressAsyncHandler(async (req, res) => {
    try {
        const { applicationId } = req.params;

        const result = await sendKenyaApplicationConfirmation(applicationId);

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
 * Send specific document reminder email for Kenya visa application
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

        const result = await sendKenyaSpecificDocumentReminder(applicationId, requiredDocuments);

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
    sendPaymentRemaiderEmail,
    sendPassportReminderEmail,
    sendPhotoReminderEmail,
    sendApplicationConfirmationEmail,
    sendSpecificDocumentReminderEmail
};
