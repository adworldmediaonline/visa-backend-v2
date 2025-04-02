import expressAsyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import {
    sendEthiopiaDocumentReminder,
    sendEthiopiaPassportReminder,
    sendEthiopiaPhotoReminder,
    sendEthiopiaApplicationConfirmation,
    sendEthiopiaSpecificDocumentReminder
} from '../../utils/mailConfigs.js';

/**
 * Send document reminder email for Ethiopia visa application
 */
const sendDocumentReminderEmail = expressAsyncHandler(async (req, res) => {
    try {
        const { applicationId } = req.params;

        const result = await sendEthiopiaDocumentReminder(applicationId);

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
 * Send passport reminder email for Ethiopia visa application
 */
const sendPassportReminderEmail = expressAsyncHandler(async (req, res) => {
    try {
        const { applicationId } = req.params;

        const result = await sendEthiopiaPassportReminder(applicationId);

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
 * Send photo reminder email for Ethiopia visa application
 */
const sendPhotoReminderEmail = expressAsyncHandler(async (req, res) => {
    try {
        const { applicationId } = req.params;

        const result = await sendEthiopiaPhotoReminder(applicationId);

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
 * Send application confirmation email for Ethiopia visa application
 */
const sendApplicationConfirmationEmail = expressAsyncHandler(async (req, res) => {
    try {
        const { applicationId } = req.params;

        const result = await sendEthiopiaApplicationConfirmation(applicationId);

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
 * Send specific document reminder email for Ethiopia visa application
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

        const result = await sendEthiopiaSpecificDocumentReminder(applicationId, requiredDocuments);

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
    sendPassportReminderEmail,
    sendPhotoReminderEmail,
    sendApplicationConfirmationEmail,
    sendSpecificDocumentReminderEmail
};
