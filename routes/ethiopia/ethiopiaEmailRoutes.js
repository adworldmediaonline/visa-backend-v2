import express from 'express';
import {
    sendDocumentReminderEmail,
    sendPassportReminderEmail,
    sendPhotoReminderEmail,
    sendApplicationConfirmationEmail,
    sendSpecificDocumentReminderEmail,
    sendPaymentRemaiderEmail
} from '../../controllers/ethiopia/ethiopiaEmailController.js';

const mailRouter = express.Router();

// Email routes for Ethiopia visa applications
mailRouter.post('/documents-reminder/:applicationId', sendDocumentReminderEmail);
mailRouter.post('/payment-reminder/:applicationId', sendPaymentRemaiderEmail);
mailRouter.post('/passport-reminder/:applicationId', sendPassportReminderEmail);
mailRouter.post('/photo-reminder/:applicationId', sendPhotoReminderEmail);
mailRouter.post('/application-confirmation/:applicationId', sendApplicationConfirmationEmail);
mailRouter.post('/specific-documents-reminder/:applicationId', sendSpecificDocumentReminderEmail);

export default mailRouter;
