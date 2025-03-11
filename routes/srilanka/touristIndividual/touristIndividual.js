import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import touristIndividualController from '../../../controllers/srilanka/touristIndividual/touristIndividualController.js';
import { uploadFiles } from '../../../middleware/multerMiddleware.js';

const touristIndividualRouter = express.Router();

touristIndividualRouter
  .route('/touristIndividual')
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
    touristIndividualController.createTouristIndividual
  )
  .get(touristIndividualController.getAllTouristIndividual);

touristIndividualRouter
  .route('/touristIndividual/:id')
  .get(touristIndividualController.touristIndividualById)
  .put(
    uploadFiles([{ name: 'passportImageIndividualTourist', maxCount: 1 }]),
    touristIndividualController.updateTouristIndividual
  );

export default touristIndividualRouter;
