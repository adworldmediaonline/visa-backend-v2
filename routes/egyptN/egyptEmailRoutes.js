import express from 'express';
import {
    sendDocumentReminderEmail,
    sendPassportReminderEmail,
    sendPhotoReminderEmail,
    sendApplicationConfirmationEmail,
    sendSpecificDocumentReminderEmail,
    sendPaymentReminderEmail
} from '../../controllers/egyptN/egyptEmailController.js';

const egyptEmailRouter = express.Router();

// Email routes for Egypt visa applications
egyptEmailRouter.post('/documents-reminder/:applicationId', sendDocumentReminderEmail);
egyptEmailRouter.post('/payment-reminder/:applicationId', sendPaymentReminderEmail);
egyptEmailRouter.post('/passport-reminder/:applicationId', sendPassportReminderEmail);
egyptEmailRouter.post('/photo-reminder/:applicationId', sendPhotoReminderEmail);
egyptEmailRouter.post('/application-confirmation/:applicationId', sendApplicationConfirmationEmail);
egyptEmailRouter.post('/specific-documents-reminder/:applicationId', sendSpecificDocumentReminderEmail);

export default egyptEmailRouter;
