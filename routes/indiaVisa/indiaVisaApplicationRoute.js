import express from 'express';
import { sendEmailBasedOnDomain } from '../../utils/sendEmailBasedOnDomain.js';
import indiaVisaApplicationController from '../../controllers/indiaVisa/indiaVisaApplicationController.js';

const indiaVisaRouter = express.Router();

const mailMiddlewareBasedOnDomain = (req, res, next) => {
  req.mailAuth = sendEmailBasedOnDomain(
    process.env.TRAVEL_TO_INDIA_SERVICES_DOMAIN_URL
  );
  next();
};

indiaVisaRouter.use(mailMiddlewareBasedOnDomain);

// Get all Indian visa applications
indiaVisaRouter
  .route('/applications')
  .get(indiaVisaApplicationController.getAllIndianVisaApplications);

// Get specific Indian visa application by ID
indiaVisaRouter
  .route('/applications/:id')
  .get(indiaVisaApplicationController.getIndianVisaApplicationById);

// Send emails to visa applicants
indiaVisaRouter
  .route('/applications/send-emails')
  .post(indiaVisaApplicationController.sendEmailToIndianVisaApplication);

// Send reminder emails based on visa status
indiaVisaRouter
  .route('/send-reminder-emails')
  .post(indiaVisaApplicationController.sendReminderEmails);

export default indiaVisaRouter;
