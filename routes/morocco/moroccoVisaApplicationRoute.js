import express from 'express';
import dotenv from 'dotenv';
import moroccoVisaApplicationController from '../../controllers/morocco/moroccoVisaApplicationController.js';
dotenv.config();

const moroccoVisaApplicationRouter = express.Router();

moroccoVisaApplicationRouter
  .route('/moroccoVisaApplication')
  .post(moroccoVisaApplicationController.createMoroccoVisaApplication)
  .get(moroccoVisaApplicationController.getAllMoroccoVisaApplication);

moroccoVisaApplicationRouter
  .route('/moroccoVisaApplication/:id')
  .get(moroccoVisaApplicationController.moroccoVisaApplicationById)
  .put(moroccoVisaApplicationController.updateMoroccoVisaApplication)
  .delete(moroccoVisaApplicationController.deleteMoroccoVisaApplicationById);

export default moroccoVisaApplicationRouter;
