import express from 'express';
import dotenv from 'dotenv';
import omanVisaApplicationPeopleController from '../../controllers/oman/omanVisaApplicationPeopleController.js';
import { uploadFiles } from '../../middleware/multerMiddleware.js';

dotenv.config();
const omanVisaApplicationPeopleRouter = express.Router();

omanVisaApplicationPeopleRouter
  .route('/omanVisaApplicationPeople')
  .post(
    uploadFiles([
      { name: 'passportColouredPhoto', maxCount: 1 },
      { name: 'profilePhoto', maxCount: 1 },
    ]),
    omanVisaApplicationPeopleController.createOmanVisaApplicationPeople
  )
  .get(omanVisaApplicationPeopleController.getAllOmanVisaApplicationPeople);

omanVisaApplicationPeopleRouter
  .route('/omanVisaApplicationPeople/:id')
  .get(omanVisaApplicationPeopleController.omanVisaApplicationPeopleById)
  .put(
    uploadFiles([
      { name: 'passportColouredPhoto', maxCount: 1 },
      { name: 'profilePhoto', maxCount: 1 },
    ]),
    omanVisaApplicationPeopleController.updateOmanVisaApplicationPeople
  )
  .delete(
    omanVisaApplicationPeopleController.deleteOmanVisaApplicationPeopleById
  );

export default omanVisaApplicationPeopleRouter;
