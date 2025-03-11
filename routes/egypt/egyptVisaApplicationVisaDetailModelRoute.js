import express from 'express';
import dotenv from 'dotenv';
import egyptVisaDetailController from '../../controllers/egypt/egyptVisaDetailController.js';

dotenv.config();
const egyptVisaDetailRouter = express.Router();

egyptVisaDetailRouter
  .route('/egyptVisaDetail')
  .post(egyptVisaDetailController.createEgyptVisaDetail)
  .get(egyptVisaDetailController.getAllEgyptVisaDetail);

egyptVisaDetailRouter
  .route('/egyptVisaDetail/:id')
  .get(egyptVisaDetailController.egyptVisaDetailById)
  .put(egyptVisaDetailController.updateEgyptVisaDetail)
  .delete(egyptVisaDetailController.deleteEgyptVisaDetailById);

export default egyptVisaDetailRouter;
