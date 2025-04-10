import express from 'express';
import {
    sendDocumentReminderEmail,
    sendPassportReminderEmail,
    sendPhotoReminderEmail,
    sendApplicationConfirmationEmail,
    sendSpecificDocumentReminderEmail,
    sendPaymentRemaiderEmail
} from '../../controllers/kenya/kenyaEmailController.js';

const kenyaEmailRouter = express.Router();

// Email routes for Ethiopia visa applications
kenyaEmailRouter.post('/documents-reminder/:applicationId', sendDocumentReminderEmail);
kenyaEmailRouter.post('/payment-reminder/:applicationId', sendPaymentRemaiderEmail);
kenyaEmailRouter.post('/passport-reminder/:applicationId', sendPassportReminderEmail);
kenyaEmailRouter.post('/photo-reminder/:applicationId', sendPhotoReminderEmail);
kenyaEmailRouter.post('/application-confirmation/:applicationId', sendApplicationConfirmationEmail);
kenyaEmailRouter.post('/specific-documents-reminder/:applicationId', sendSpecificDocumentReminderEmail);

export default kenyaEmailRouter;
