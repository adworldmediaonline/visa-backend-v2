import express from 'express';
import dotenv from 'dotenv';
import moroccoVisaApplicationPeopleController from '../../controllers/morocco/moroccoVisaApplicationPeopleController.js';
import { uploadFiles } from '../../middleware/multerMiddleware.js';

dotenv.config();
const moroccoVisaApplicationPeopleRouter = express.Router();

moroccoVisaApplicationPeopleRouter
  .route('/moroccoVisaApplicationPeople')
  .post(
    uploadFiles([
      { name: 'passportColouredPhoto', maxCount: 1 },
      { name: 'profilePhoto', maxCount: 1 },
    ]),
    moroccoVisaApplicationPeopleController.createMoroccoVisaApplicationPeople
  )
  .get(
    moroccoVisaApplicationPeopleController.getAllMoroccoVisaApplicationPeople
  );

moroccoVisaApplicationPeopleRouter
  .route('/moroccoVisaApplicationPeople/:id')
  .get(moroccoVisaApplicationPeopleController.moroccoVisaApplicationPeopleById)
  .put(
    uploadFiles([
      { name: 'passportColouredPhoto', maxCount: 1 },
      { name: 'profilePhoto', maxCount: 1 },
    ]),
    moroccoVisaApplicationPeopleController.updateMoroccoVisaApplicationPeople
  )
  .delete(
    moroccoVisaApplicationPeopleController.deleteMoroccoVisaApplicationPeopleById
  );

export default moroccoVisaApplicationPeopleRouter;
