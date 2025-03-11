import express from 'express';
import dotenv from 'dotenv';
import turkeyVisaApplicationController from '../../controllers/turkey/turkeyVisaApplicationController.js';

dotenv.config();

const turkeyVisaApplicationRouter = express.Router();

turkeyVisaApplicationRouter
  .route('/turkeyVisaApplication')
  .post(turkeyVisaApplicationController.createTurkeyVisaApplication)
  .get(turkeyVisaApplicationController.getAllTurkeyVisaApplication);

turkeyVisaApplicationRouter
  .route('/turkeyVisaApplication/:id')
  .get(turkeyVisaApplicationController.turkeyVisaApplicationById)
  .put(turkeyVisaApplicationController.updateTurkeyVisaApplication)
  .delete(turkeyVisaApplicationController.deleteTurkeyVisaApplicationById);

turkeyVisaApplicationRouter
  .route('/turkeyVisaApplication/payment')
  .post(turkeyVisaApplicationController.createTurkeyVisaApplicationPayment);

export default turkeyVisaApplicationRouter;
