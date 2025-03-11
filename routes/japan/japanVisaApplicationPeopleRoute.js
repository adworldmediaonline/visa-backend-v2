import express from 'express';
import dotenv from 'dotenv';
import japanVisaApplicationPeopleController from '../../controllers/japan/japanVisaApplicationPeopleController.js';

dotenv.config();
const japanVisaApplicationPeopleRouter = express.Router();

japanVisaApplicationPeopleRouter
  .route('/japanVisaApplicationPeople')
  .post(japanVisaApplicationPeopleController.createJapanVisaApplicationPeople)
  .get(japanVisaApplicationPeopleController.getAllJapanVisaApplicationPeople);

japanVisaApplicationPeopleRouter
  .route('/japanVisaApplicationPeople/:id')
  .get(japanVisaApplicationPeopleController.japanVisaApplicationPeopleById)
  .put(japanVisaApplicationPeopleController.updateJapanVisaApplicationPeople)
  .delete(
    japanVisaApplicationPeopleController.deleteJapanVisaApplicationPeopleById
  );

export default japanVisaApplicationPeopleRouter;
