import express from 'express';
import egyptVisaApplicationController from '../../controllers/egyptN/egyptVisaApplicationController.js';
import egyptVisaDetailsController from '../../controllers/egyptN/egyptVisaDetailsController.js';
import egyptArrivalInfoController from '../../controllers/egyptN/egyptArrivalInfoController.js';
import egyptPersonalInfoController from '../../controllers/egyptN/egyptPersonalInfoController.js';
import egyptPassportInfoController from '../../controllers/egyptN/egyptPassportInfoController.js';
import egyptAdditionalApplicantsController from '../../controllers/egyptN/egyptAdditionalApplicantsController.js';

const egyptVisaApplicationRouter = express.Router();

// Main application routes
egyptVisaApplicationRouter.get(
  '/all',
  egyptVisaApplicationController.getAllEgyptVisaApplications
);

egyptVisaApplicationRouter.get(
  '/:id',
  egyptVisaApplicationController.getEgyptVisaApplicationById
);

egyptVisaApplicationRouter.post(
  '/check-status',
  egyptVisaApplicationController.checkApplicationStatus
);

egyptVisaApplicationRouter.put(
  '/:id',
  egyptVisaApplicationController.updateEgyptVisaApplication
);

egyptVisaApplicationRouter.delete(
  '/:id',
  egyptVisaApplicationController.deleteEgyptVisaApplication
);

egyptVisaApplicationRouter.get(
  '/:id/applicants',
  egyptVisaApplicationController.getAllApplicantsDetails
);

// Visa details routes
egyptVisaApplicationRouter.post(
  '/visa-details',
  egyptVisaDetailsController.createEgyptVisaDetails
);

egyptVisaApplicationRouter.get(
  '/visa-details/:formId',
  egyptVisaDetailsController.getEgyptVisaDetailsByFormId
);

egyptVisaApplicationRouter.put(
  '/visa-details/:formId',
  egyptVisaDetailsController.updateEgyptVisaDetails
);

egyptVisaApplicationRouter.get(
  '/visa-types/prices',
  egyptVisaDetailsController.getVisaTypesAndPrices
);

// Arrival info routes
egyptVisaApplicationRouter.post(
  '/arrival-info',
  egyptArrivalInfoController.createEgyptArrivalInfo
);

egyptVisaApplicationRouter.get(
  '/arrival-info/:formId',
  egyptArrivalInfoController.getEgyptArrivalInfoByFormId
);

egyptVisaApplicationRouter.put(
  '/arrival-info/:formId',
  egyptArrivalInfoController.updateEgyptArrivalInfo
);

// Personal info routes
egyptVisaApplicationRouter.post(
  '/personal-info',
  egyptPersonalInfoController.createEgyptPersonalInfo
);

egyptVisaApplicationRouter.get(
  '/personal-info/:formId',
  egyptPersonalInfoController.getEgyptPersonalInfoByFormId
);

egyptVisaApplicationRouter.put(
  '/personal-info/:formId',
  egyptPersonalInfoController.updateEgyptPersonalInfo
);

// Passport info routes
egyptVisaApplicationRouter.post(
  '/passport-info',
  egyptPassportInfoController.createEgyptPassportInfo
);

egyptVisaApplicationRouter.get(
  '/passport-info/:formId',
  egyptPassportInfoController.getEgyptPassportInfoByFormId
);

egyptVisaApplicationRouter.put(
  '/passport-info/:formId',
  egyptPassportInfoController.updateEgyptPassportInfo
);

// Additional Applicants
egyptVisaApplicationRouter.get(
  '/additional-applicants/:formId',
  egyptAdditionalApplicantsController.getAdditionalApplicants
);

egyptVisaApplicationRouter.post(
  '/additional-applicants/:formId',
  egyptAdditionalApplicantsController.addAdditionalApplicant
);

egyptVisaApplicationRouter.put(
  '/additional-applicants/:formId/:applicantIndex',
  egyptAdditionalApplicantsController.updateAdditionalApplicant
);

egyptVisaApplicationRouter.delete(
  '/additional-applicants/:formId/:applicantIndex',
  egyptAdditionalApplicantsController.removeAdditionalApplicant
);

export default egyptVisaApplicationRouter;
