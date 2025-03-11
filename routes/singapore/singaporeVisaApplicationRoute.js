import express from 'express';
import dotenv from 'dotenv';
import singaporeVisaApplicationController from '../../controllers/singapore/singaporeVisaApplicationController.js';
dotenv.config();

const singaporeVisaApplicationRouter = express.Router();

singaporeVisaApplicationRouter
  .route('/singaporeVisaApplication')
  .post(singaporeVisaApplicationController.createSingaporeVisaApplication)
  .get(singaporeVisaApplicationController.getAllSingaporeVisaApplication);

singaporeVisaApplicationRouter
  .route('/singaporeVisaApplication/:id')
  .get(singaporeVisaApplicationController.singaporeVisaApplicationById)
  .put(singaporeVisaApplicationController.updateSingaporeVisaApplication)
  .delete(
    singaporeVisaApplicationController.deleteSingaporeVisaApplicationById
  );

export default singaporeVisaApplicationRouter;
