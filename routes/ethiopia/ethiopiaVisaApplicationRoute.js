import express from 'express';
import ethiopiaVisaApplicationController from '../../controllers/ethiopia/ethiopiaVisaApplicationController.js';
import ethiopiaVisaDetailsController from '../../controllers/ethiopia/ethiopiaVisaDetailsController.js';
import ethiopiaArrivalInfoController from '../../controllers/ethiopia/ethiopiaArrivalInfoController.js';
import ethiopiaPersonalInfoController from '../../controllers/ethiopia/ethiopiaPersonalInfoController.js';
import ethiopiaPassportInfoController from '../../controllers/ethiopia/ethiopiaPassportInfoController.js';

const ethiopiaVisaApplicationRouter = express.Router();

// Main application routes
ethiopiaVisaApplicationRouter.post(
    '/create',
    ethiopiaVisaApplicationController.createEthiopiaVisaApplication
);

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

export default ethiopiaVisaApplicationRouter;
