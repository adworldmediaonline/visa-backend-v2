import express from 'express';
import dotenv from 'dotenv';
import thailandVisaApplicationController from '../../controllers/thailand/thailandVisaApplicationController.js';

dotenv.config();

const thailandVisaApplicationRouter = express.Router();

thailandVisaApplicationRouter
  .route('/thailandVisaApplication')
  .post(thailandVisaApplicationController.createThailandVisaApplication)
  .get(thailandVisaApplicationController.getAllThailandVisaApplication);

thailandVisaApplicationRouter
  .route('/thailandVisaApplication/:id')
  .get(thailandVisaApplicationController.thailandVisaApplicationById)
  .put(thailandVisaApplicationController.updateThailandVisaApplication)
  .delete(thailandVisaApplicationController.deleteThailandVisaApplicationById);

export default thailandVisaApplicationRouter;
