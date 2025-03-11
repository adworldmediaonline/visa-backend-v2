import express from 'express';
import dotenv from 'dotenv';
import omanVisaApplicationController from '../../controllers/oman/omanVisaApplicationController.js';
dotenv.config();

const omanVisaApplicationRouter = express.Router();

omanVisaApplicationRouter
  .route('/omanVisaApplication')
  .post(omanVisaApplicationController.createOmanVisaApplication)
  .get(omanVisaApplicationController.getAllOmanVisaApplication);

omanVisaApplicationRouter
  .route('/omanVisaApplication/:id')
  .get(omanVisaApplicationController.omanVisaApplicationById)
  .put(omanVisaApplicationController.updateOmanVisaApplication)
  .delete(omanVisaApplicationController.deleteOmanVisaApplicationById);

export default omanVisaApplicationRouter;
