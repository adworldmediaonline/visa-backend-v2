import express from 'express';
import dotenv from 'dotenv';
import malaysiaVisaApplicationController from '../../controllers/malaysia/malaysiaVisaApplicationController.js';
dotenv.config();

const malaysiaVisaApplicationRouter = express.Router();

malaysiaVisaApplicationRouter
  .route('/malaysiaVisaApplication')
  .post(malaysiaVisaApplicationController.createMalaysiaVisaApplication)
  .get(malaysiaVisaApplicationController.getAllMalaysiaVisaApplication);

malaysiaVisaApplicationRouter
  .route('/malaysiaVisaApplication/:id')
  .get(malaysiaVisaApplicationController.malaysiaVisaApplicationById)
  .put(malaysiaVisaApplicationController.updateMalaysiaVisaApplication)
  .delete(malaysiaVisaApplicationController.deleteMalaysiaVisaApplicationById);

export default malaysiaVisaApplicationRouter;
