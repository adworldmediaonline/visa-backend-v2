import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import temporaryExitUrlController from '../controllers/temporaryExitUrlController.js';
const temporaryExitRouter = express.Router();

temporaryExitRouter
  .route('/visaLastTemporaryExitUrl')
  .post(temporaryExitUrlController.createTemporaryExitUrl)
  .get(temporaryExitUrlController.getAllTemporaryExit);
temporaryExitRouter
  .route('/visaLastTemporaryExitUrl/:id')
  .get(temporaryExitUrlController.temporaryExitByFormId)
  .put(temporaryExitUrlController.updateTemporaryExit);

export default temporaryExitRouter;
