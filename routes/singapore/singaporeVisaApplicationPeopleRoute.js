import express from 'express';
import dotenv from 'dotenv';
import singaporeVisaApplicationPeopleController from '../../controllers/singapore/singaporeVisaApplicationPeopleController.js';

dotenv.config();
const singaporeVisaApplicationPeopleRouter = express.Router();

singaporeVisaApplicationPeopleRouter
  .route('/singaporeVisaApplicationPeople')
  .post(
    singaporeVisaApplicationPeopleController.createSingaporeVisaApplicationPeople
  )
  .get(
    singaporeVisaApplicationPeopleController.getAllSingaporeVisaApplicationPeople
  );

singaporeVisaApplicationPeopleRouter
  .route('/singaporeVisaApplicationPeople/:id')
  .get(
    singaporeVisaApplicationPeopleController.singaporeVisaApplicationPeopleById
  )
  .put(
    singaporeVisaApplicationPeopleController.updateSingaporeVisaApplicationPeople
  )
  .delete(
    singaporeVisaApplicationPeopleController.deleteSingaporeVisaApplicationPeopleById
  );

export default singaporeVisaApplicationPeopleRouter;
