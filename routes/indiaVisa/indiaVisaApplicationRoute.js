import express from 'express';
import { sendEmailBasedOnDomain } from '../../utils/sendEmailBasedOnDomain.js';
import indiaVisaApplicationController from '../../controllers/indiaVisa/indiaVisaApplicationController.js';

const indiaVisaRouter = express.Router();

const mailMiddlewareBasedOnDomain = (req, res, next) => {
  req.mailAuth = sendEmailBasedOnDomain(process.env.VISA_COLLECT_DOMAIN_URL);
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

export default indiaVisaRouter;
