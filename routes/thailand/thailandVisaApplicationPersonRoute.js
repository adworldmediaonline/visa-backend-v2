import express from 'express';
import dotenv from 'dotenv';
import thailandVisaApplicationPersonController from '../../controllers/thailand/thailandVisaApplicationPersonController.js';

dotenv.config();
const thailandVisaApplicationPersonRouter = express.Router();

thailandVisaApplicationPersonRouter
  .route('/thailandVisaApplicationPerson')
  .post(
    thailandVisaApplicationPersonController.createThailandVisaApplicationPerson
  )
  .get(
    thailandVisaApplicationPersonController.getAllThailandVisaApplicationPerson
  );

thailandVisaApplicationPersonRouter
  .route('/thailandVisaApplicationPerson/:id')
  .get(
    thailandVisaApplicationPersonController.thailandVisaApplicationPersonById
  )
  .put(
    thailandVisaApplicationPersonController.updateThailandVisaApplicationPerson
  )
  .delete(
    thailandVisaApplicationPersonController.deleteThailandVisaApplicationPersonById
  );

export default thailandVisaApplicationPersonRouter;
