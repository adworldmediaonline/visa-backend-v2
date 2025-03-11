import express from 'express';
import dotenv from 'dotenv';
import cambodiaVisaApplicationController from '../../controllers/cambodia/cambodiaVisaApplicationController.js';
import { validate } from '../../middleware/validate.js';
import { cambodiaYupSchema } from '../../utils/yupSchema.js';

dotenv.config();

const cambodiaVisaApplicationRouter = express.Router();

cambodiaVisaApplicationRouter
  .route('/cambodiaVisaApplication')
  .post(
    validate(cambodiaYupSchema),
    cambodiaVisaApplicationController.createCambodiaVisaApplication
  )
  .get(cambodiaVisaApplicationController.getAllCambodiaVisaApplication);

cambodiaVisaApplicationRouter
  .route('/cambodiaVisaApplication/:id')
  .get(cambodiaVisaApplicationController.cambodiaVisaApplicationById)
  .put(cambodiaVisaApplicationController.updateCambodiaVisaApplication)
  .delete(cambodiaVisaApplicationController.deleteCambodiaVisaApplicationById);

cambodiaVisaApplicationRouter
  .route('/cambodiaVisaApplication/payment')
  .post(cambodiaVisaApplicationController.createCambodiaVisaApplicationPayment);

export default cambodiaVisaApplicationRouter;
