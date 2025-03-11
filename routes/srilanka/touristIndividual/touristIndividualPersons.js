import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import touristIndividualPersonsController from '../../../controllers/srilanka/touristIndividual/touristIndividualPersonsController.js';
import { uploadFiles } from '../../../middleware/multerMiddleware.js';

const touristIndividualPersonsRouter = express.Router();

touristIndividualPersonsRouter
  .route('/touristIndividualPersons')
  .post(
    uploadFiles([
      { name: 'passportFrontImage', maxCount: 1 },
      {
        name: 'profilePicture',
        maxCount: 1,
      },
      {
        name: 'invitationLetter',
        maxCount: 5,
      },
      {
        name: 'additionalDocuments',
        maxCount: 5,
      },
    ]),
    touristIndividualPersonsController.createTouristIndividualPersons
  )
  .get(touristIndividualPersonsController.getAllTouristIndividualPersons);

touristIndividualPersonsRouter
  .route('/touristIndividualPersons/:id')
  .get(touristIndividualPersonsController.touristIndividualPersonsById)
  .put(
    uploadFiles([{ name: 'passportImageIndividualTourist', maxCount: 1 }]),
    touristIndividualPersonsController.updateTouristIndividualPersons
  );

export default touristIndividualPersonsRouter;
