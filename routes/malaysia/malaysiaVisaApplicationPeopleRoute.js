import express from 'express';
import dotenv from 'dotenv';
import malaysiaVisaApplicationPeopleController from '../../controllers/malaysia/malaysiaVisaApplicationPeopleController.js';

dotenv.config();
const malaysiaVisaApplicationPeopleRouter = express.Router();

malaysiaVisaApplicationPeopleRouter
  .route('/malaysiaVisaApplicationPeople')
  .post(
    malaysiaVisaApplicationPeopleController.createMalaysiaVisaApplicationPeople
  )
  .get(
    malaysiaVisaApplicationPeopleController.getAllMalaysiaVisaApplicationPeople
  );

malaysiaVisaApplicationPeopleRouter
  .route('/malaysiaVisaApplicationPeople/:id')
  .get(
    malaysiaVisaApplicationPeopleController.malaysiaVisaApplicationPeopleById
  )
  .put(
    malaysiaVisaApplicationPeopleController.updateMalaysiaVisaApplicationPeople
  )
  .delete(
    malaysiaVisaApplicationPeopleController.deleteMalaysiaVisaApplicationPeopleById
  );

export default malaysiaVisaApplicationPeopleRouter;
