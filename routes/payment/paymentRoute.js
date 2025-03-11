import express from 'express';
import dotenv from 'dotenv';
import paymentVisaApplicationController from '../../controllers/payment/paymentController.js';

dotenv.config();

const paymentVisaApplicationRouter = express.Router();

paymentVisaApplicationRouter
  .route('/paymentVisaApplication')
  .post(paymentVisaApplicationController.makePayment);

export default paymentVisaApplicationRouter;
