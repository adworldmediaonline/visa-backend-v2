import express from 'express';
const indiaVisaPaymentRouter = express.Router();
import { createIndiaVisaCheckoutSession } from '../../controllers/indiaVisa/paymentIndiaVisaController.js';

indiaVisaPaymentRouter
  .route('/checkout-session/:id')
  .post(createIndiaVisaCheckoutSession);

export default indiaVisaPaymentRouter;
