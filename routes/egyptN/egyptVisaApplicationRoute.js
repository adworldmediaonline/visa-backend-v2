import express from 'express';
import egyptVisaApplicationController from '../../controllers/egyptN/egyptVisaApplicationController.js';
import egyptVisaDetailsController from '../../controllers/egyptN/egyptVisaDetailsController.js';
import egyptArrivalInfoController from '../../controllers/egyptN/egyptArrivalInfoController.js';
import egyptPersonalInfoController from '../../controllers/egyptN/egyptPersonalInfoController.js';
import egyptPassportInfoController from '../../controllers/egyptN/egyptPassportInfoController.js';
import egyptAdditionalApplicantsController from '../../controllers/egyptN/egyptAdditionalApplicantsController.js';

const egyptVisaApplicationRouterN = express.Router();

// Main application routes
egyptVisaApplicationRouterN.get(
  '/all',
  egyptVisaApplicationController.getAllEgyptVisaApplications
);

egyptVisaApplicationRouterN.get(
  '/:id',
  egyptVisaApplicationController.getEgyptVisaApplicationById
);

egyptVisaApplicationRouterN.post(
  '/check-status',
  egyptVisaApplicationController.checkApplicationStatus
);

egyptVisaApplicationRouterN.put(
  '/:id',
  egyptVisaApplicationController.updateEgyptVisaApplication
);

egyptVisaApplicationRouterN.delete(
  '/:id',
  egyptVisaApplicationController.deleteEgyptVisaApplication
);

egyptVisaApplicationRouterN.get(
  '/:id/applicants',
  egyptVisaApplicationController.getAllApplicantsDetails
);

// Visa details routes
egyptVisaApplicationRouterN.post(
  '/visa-details',
  egyptVisaDetailsController.createEgyptVisaDetails
);

egyptVisaApplicationRouterN.get(
  '/visa-details/:formId',
  egyptVisaDetailsController.getEgyptVisaDetailsByFormId
);

egyptVisaApplicationRouterN.put(
  '/visa-details/:formId',
  egyptVisaDetailsController.updateEgyptVisaDetails
);

egyptVisaApplicationRouterN.get(
  '/visa-types/prices',
  egyptVisaDetailsController.getVisaTypesAndPrices
);

// Arrival info routes
egyptVisaApplicationRouterN.post(
  '/arrival-info',
  egyptArrivalInfoController.createEgyptArrivalInfo
);

egyptVisaApplicationRouterN.get(
  '/arrival-info/:formId',
  egyptArrivalInfoController.getEgyptArrivalInfoByFormId
);

egyptVisaApplicationRouterN.put(
  '/arrival-info/:formId',
  egyptArrivalInfoController.updateEgyptArrivalInfo
);

// Personal info routes
egyptVisaApplicationRouterN.post(
  '/personal-info',
  egyptPersonalInfoController.createEgyptPersonalInfo
);

egyptVisaApplicationRouterN.get(
  '/personal-info/:formId',
  egyptPersonalInfoController.getEgyptPersonalInfoByFormId
);

egyptVisaApplicationRouterN.put(
  '/personal-info/:formId',
  egyptPersonalInfoController.updateEgyptPersonalInfo
);

// Passport info routes
egyptVisaApplicationRouterN.post(
  '/passport-info',
  egyptPassportInfoController.createEgyptPassportInfo
);

egyptVisaApplicationRouterN.get(
  '/passport-info/:formId',
  egyptPassportInfoController.getEgyptPassportInfoByFormId
);

egyptVisaApplicationRouterN.put(
  '/passport-info/:formId',
  egyptPassportInfoController.updateEgyptPassportInfo
);

// Additional Applicants
egyptVisaApplicationRouterN.get(
  '/additional-applicants/:formId',
  egyptAdditionalApplicantsController.getAdditionalApplicants
);

egyptVisaApplicationRouterN.post(
  '/additional-applicants/:formId',
  egyptAdditionalApplicantsController.addAdditionalApplicant
);

egyptVisaApplicationRouterN.put(
  '/additional-applicants/:formId/:applicantIndex',
  egyptAdditionalApplicantsController.updateAdditionalApplicant
);

egyptVisaApplicationRouterN.delete(
  '/additional-applicants/:formId/:applicantIndex',
  egyptAdditionalApplicantsController.removeAdditionalApplicant
);

export default egyptVisaApplicationRouterN;
