import express from 'express';
import dotenv from 'dotenv';
import australiaVisaApplicationController from '../../controllers/australia/australiaTourismVisaApplicationController.js';
import { uploadFiles } from '../../middleware/multerMiddleware.js';

dotenv.config();

const australiaVisaApplicationRouter = express.Router();

australiaVisaApplicationRouter
  .route('/australiaVisaApplication')
  .post(
    uploadFiles([
      { name: 'passportDocuments', maxCount: 1 },
      {
        name: 'passportSizePhoto',
        maxCount: 2,
      },
      {
        name: 'bankStatementPaySlips',
        maxCount: 2,
      },
      {
        name: 'businessCard',
        maxCount: 2,
      },
      {
        name: 'invitationLetter',
        maxCount: 5,
      },
      {
        name: 'travelAndHealthInsurance',
        maxCount: 1,
      },
      {
        name: 'policeCertificate',
        maxCount: 1,
      },
      {
        name: 'medicalCertificate',
        maxCount: 1,
      },
      {
        name: 'additionalDocuments',
        maxCount: 10,
      },
    ]),
    australiaVisaApplicationController.createAustraliaVisaApplication
  )
  .get(australiaVisaApplicationController.getAllAustraliaVisaApplication);

australiaVisaApplicationRouter
  .route('/australiaVisaApplication/:id')
  .get(australiaVisaApplicationController.australiaVisaApplicationById)
  .put(australiaVisaApplicationController.updateAustraliaVisaApplication)
  .delete(
    australiaVisaApplicationController.deleteAustraliaVisaApplicationById
  );

australiaVisaApplicationRouter
  .route('/australiaVisaApplication/payment')
  .post(
    australiaVisaApplicationController.createAustraliaVisaApplicationPayment
  );

export default australiaVisaApplicationRouter;
