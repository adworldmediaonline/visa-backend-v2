import express from 'express';
import dotenv from 'dotenv';
import egyptVisaApplicationController from '../../controllers/egypt/egyptVisaApplicationController.js';

dotenv.config();

const egyptVisaApplicationRouter = express.Router();

egyptVisaApplicationRouter
  .route('/egyptVisaApplication')
  .post(egyptVisaApplicationController.createEgyptVisaApplication)
  .get(egyptVisaApplicationController.getAllEgyptVisaApplication);

egyptVisaApplicationRouter
  .route('/egyptVisaApplication/:id')
  .get(egyptVisaApplicationController.egyptVisaApplicationById)
  .put(egyptVisaApplicationController.updateEgyptVisaApplication)
  .delete(egyptVisaApplicationController.deleteEgyptVisaApplicationById);

export default egyptVisaApplicationRouter;
