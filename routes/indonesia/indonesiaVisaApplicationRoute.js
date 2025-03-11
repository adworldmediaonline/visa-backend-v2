import express from 'express';
import dotenv from 'dotenv';
import indonesiaVisaApplicationController from '../../controllers/indonesia/indonesiaVisaApplicationController.js';
import { validate } from '../../middleware/validate.js';
import { indonesiaYupSchema } from '../../utils/yupSchema.js';

dotenv.config();

const indonesiaVisaApplicationRouter = express.Router();

indonesiaVisaApplicationRouter
  .route('/indonesiaVisaApplication')
  .post(
    validate(indonesiaYupSchema),
    indonesiaVisaApplicationController.createIndonesiaVisaApplication
  )
  .get(indonesiaVisaApplicationController.getAllIndonesiaVisaApplication);

indonesiaVisaApplicationRouter
  .route('/indonesiaVisaApplication/:id')
  .get(indonesiaVisaApplicationController.indonesiaVisaApplicationById)
  .put(
    validate(indonesiaYupSchema),
    indonesiaVisaApplicationController.updateIndonesiaVisaApplication
  )
  .delete(
    indonesiaVisaApplicationController.deleteIndonesiaVisaApplicationById
  );

indonesiaVisaApplicationRouter
  .route('/indonesiaVisaApplication/payment')
  .post(
    indonesiaVisaApplicationController.createIndonesiaVisaApplicationPayment
  );

export default indonesiaVisaApplicationRouter;
