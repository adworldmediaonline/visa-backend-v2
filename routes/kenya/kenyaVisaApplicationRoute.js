import express from 'express';
import kenyaVisaApplicationController from '../../controllers/kenya/kenyaVisaApplicationController.js';
import kenyaVisaDetailsController from '../../controllers/kenya/kenyaVisaDetailsController.js';
import kenyaArrivalInfoController from '../../controllers/kenya/kenyaArrivalInfoController.js';
import kenyaPersonalInfoController from '../../controllers/kenya/kenyaPersonalInfoController.js';
import kenyaPassportInfoController from '../../controllers/kenya/kenyaPassportInfoController.js';
import kenyaAdditionalApplicantsController from '../../controllers/kenya/kenyaAdditionalApplicantsController.js';

const kenyaVisaApplicationRouter = express.Router();

// Main application routes

kenyaVisaApplicationRouter.get(
  '/all',
  kenyaVisaApplicationController.getAllKenyaVisaApplications
);

kenyaVisaApplicationRouter.get(
  '/:id',
  kenyaVisaApplicationController.getKenyaVisaApplicationById
);

kenyaVisaApplicationRouter.post(
  '/check-status',
  kenyaVisaApplicationController.checkApplicationStatus
);

kenyaVisaApplicationRouter.put(
  '/:id',
  kenyaVisaApplicationController.updateKenyaVisaApplication
);

kenyaVisaApplicationRouter.delete(
  '/:id',
  kenyaVisaApplicationController.deleteKenyaVisaApplication
);

kenyaVisaApplicationRouter.get(
  '/:id/applicants',
  kenyaVisaApplicationController.getAllApplicantsDetails
);

// Visa details routes
kenyaVisaApplicationRouter.post(
  '/visa-details',
  kenyaVisaDetailsController.createKenyaVisaDetails
);

kenyaVisaApplicationRouter.get(
  '/visa-details/:formId',
  kenyaVisaDetailsController.getKenyaVisaDetailsByFormId
);

kenyaVisaApplicationRouter.put(
  '/visa-details/:formId',
  kenyaVisaDetailsController.updateKenyaVisaDetails
);

kenyaVisaApplicationRouter.get(
  '/visa-types/prices',
  kenyaVisaDetailsController.getVisaTypesAndPrices
);

// Arrival info routes
kenyaVisaApplicationRouter.post(
  '/arrival-info',
  kenyaArrivalInfoController.createKenyaArrivalInfo
);

kenyaVisaApplicationRouter.get(
  '/arrival-info/:formId',
  kenyaArrivalInfoController.getKenyaArrivalInfoByFormId
);

kenyaVisaApplicationRouter.put(
  '/arrival-info/:formId',
  kenyaArrivalInfoController.updateKenyaArrivalInfo
);

// Personal info routes
kenyaVisaApplicationRouter.post(
  '/personal-info',
  kenyaPersonalInfoController.createKenyaPersonalInfo
);

kenyaVisaApplicationRouter.get(
  '/personal-info/:formId',
  kenyaPersonalInfoController.getKenyaPersonalInfoByFormId
);

kenyaVisaApplicationRouter.put(
  '/personal-info/:formId',
  kenyaPersonalInfoController.updateKenyaPersonalInfo
);

// Passport info routes
kenyaVisaApplicationRouter.post(
  '/passport-info',
  kenyaPassportInfoController.createKenyaPassportInfo
);

kenyaVisaApplicationRouter.get(
  '/passport-info/:formId',
  kenyaPassportInfoController.getKenyaPassportInfoByFormId
);

kenyaVisaApplicationRouter.put(
  '/passport-info/:formId',
  kenyaPassportInfoController.updateKenyaPassportInfo
);

// Additional Applicants
kenyaVisaApplicationRouter.get(
  '/additional-applicants/:formId',
  kenyaAdditionalApplicantsController.getAdditionalApplicants
);

kenyaVisaApplicationRouter.post(
  '/additional-applicants/:formId',
  kenyaAdditionalApplicantsController.addAdditionalApplicant
);

kenyaVisaApplicationRouter.put(
  '/additional-applicants/:formId/:applicantIndex',
  kenyaAdditionalApplicantsController.updateAdditionalApplicant
);

kenyaVisaApplicationRouter.delete(
  '/additional-applicants/:formId/:applicantIndex',
  kenyaAdditionalApplicantsController.removeAdditionalApplicant
);

export default kenyaVisaApplicationRouter;
