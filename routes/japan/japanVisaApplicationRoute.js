import express from 'express';
import dotenv from 'dotenv';
import japanVisaApplicationController from '../../controllers/japan/japanVisaApplicationController.js';
dotenv.config();

const japanVisaApplicationRouter = express.Router();

japanVisaApplicationRouter
  .route('/japanVisaApplication')
  .post(japanVisaApplicationController.createJapanVisaApplication)
  .get(japanVisaApplicationController.getAllJapanVisaApplication);

japanVisaApplicationRouter
  .route('/japanVisaApplication/:id')
  .get(japanVisaApplicationController.japanVisaApplicationById)
  .put(japanVisaApplicationController.updateJapanVisaApplication)
  .delete(japanVisaApplicationController.deleteJapanVisaApplicationById);

export default japanVisaApplicationRouter;
