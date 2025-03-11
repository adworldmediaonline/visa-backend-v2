import dotenv from 'dotenv';
dotenv.config();
const visaBookingRouter = express.Router();
import express from 'express';
import { createVisaCheckoutSession } from './bookingController.js';

visaBookingRouter
  .route('/checkout-session/:id')
  .post(createVisaCheckoutSession);

export default visaBookingRouter;
