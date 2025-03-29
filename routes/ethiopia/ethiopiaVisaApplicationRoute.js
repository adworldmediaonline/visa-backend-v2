import express from 'express';
import ethiopiaVisaApplicationController from '../../controllers/ethiopia/ethiopiaVisaApplicationController.js';
import ethiopiaVisaDetailsController from '../../controllers/ethiopia/ethiopiaVisaDetailsController.js';
import ethiopiaArrivalInfoController from '../../controllers/ethiopia/ethiopiaArrivalInfoController.js';
import ethiopiaPersonalInfoController from '../../controllers/ethiopia/ethiopiaPersonalInfoController.js';
import ethiopiaPassportInfoController from '../../controllers/ethiopia/ethiopiaPassportInfoController.js';
import ethiopiaAdditionalApplicantsController from '../../controllers/ethiopia/ethiopiaAdditionalApplicantsController.js';

const ethiopiaVisaApplicationRouter = express.Router();

// Main application routes

ethiopiaVisaApplicationRouter.get(
    '/all',
    ethiopiaVisaApplicationController.getAllEthiopiaVisaApplications
);

ethiopiaVisaApplicationRouter.get(
    '/:id',
    ethiopiaVisaApplicationController.getEthiopiaVisaApplicationById
);

ethiopiaVisaApplicationRouter.put(
    '/:id',
    ethiopiaVisaApplicationController.updateEthiopiaVisaApplication
);

ethiopiaVisaApplicationRouter.delete(
    '/:id',
    ethiopiaVisaApplicationController.deleteEthiopiaVisaApplication
);

ethiopiaVisaApplicationRouter.get(
    '/:id/applicants',
    ethiopiaVisaApplicationController.getAllApplicantsDetails
)

// Visa details routes
ethiopiaVisaApplicationRouter.post(
    '/visa-details',
    ethiopiaVisaDetailsController.createEthiopiaVisaDetails
);

ethiopiaVisaApplicationRouter.get(
    '/visa-details/:formId',
    ethiopiaVisaDetailsController.getEthiopiaVisaDetailsByFormId
);

ethiopiaVisaApplicationRouter.put(
    '/visa-details/:formId',
    ethiopiaVisaDetailsController.updateEthiopiaVisaDetails
);

ethiopiaVisaApplicationRouter.get(
    '/visa-types/prices',
    ethiopiaVisaDetailsController.getVisaTypesAndPrices
);

// Arrival info routes
ethiopiaVisaApplicationRouter.post(
    '/arrival-info',
    ethiopiaArrivalInfoController.createEthiopiaArrivalInfo
);

ethiopiaVisaApplicationRouter.get(
    '/arrival-info/:formId',
    ethiopiaArrivalInfoController.getEthiopiaArrivalInfoByFormId
);

ethiopiaVisaApplicationRouter.put(
    '/arrival-info/:formId',
    ethiopiaArrivalInfoController.updateEthiopiaArrivalInfo
);

// Personal info routes
ethiopiaVisaApplicationRouter.post(
    '/personal-info',
    ethiopiaPersonalInfoController.createEthiopiaPersonalInfo
);

ethiopiaVisaApplicationRouter.get(
    '/personal-info/:formId',
    ethiopiaPersonalInfoController.getEthiopiaPersonalInfoByFormId
);

ethiopiaVisaApplicationRouter.put(
    '/personal-info/:formId',
    ethiopiaPersonalInfoController.updateEthiopiaPersonalInfo
);

// Passport info routes
ethiopiaVisaApplicationRouter.post(
    '/passport-info',
    ethiopiaPassportInfoController.createEthiopiaPassportInfo
);

ethiopiaVisaApplicationRouter.get(
    '/passport-info/:formId',
    ethiopiaPassportInfoController.getEthiopiaPassportInfoByFormId
);

ethiopiaVisaApplicationRouter.put(
    '/passport-info/:formId',
    ethiopiaPassportInfoController.updateEthiopiaPassportInfo
);

// Additional Applicants
ethiopiaVisaApplicationRouter.get(
    '/additional-applicants/:formId',
    ethiopiaAdditionalApplicantsController.getAdditionalApplicants
);

ethiopiaVisaApplicationRouter.post(
    '/additional-applicants/:formId',
    ethiopiaAdditionalApplicantsController.addAdditionalApplicant
);

ethiopiaVisaApplicationRouter.put(
    '/additional-applicants/:formId/:applicantIndex',
    ethiopiaAdditionalApplicantsController.updateAdditionalApplicant
);

ethiopiaVisaApplicationRouter.delete(
    '/additional-applicants/:formId/:applicantIndex',
    ethiopiaAdditionalApplicantsController.removeAdditionalApplicant
);

export default ethiopiaVisaApplicationRouter;
