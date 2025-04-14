import express from 'express';
import { createOrUpdateGovRefDetails, deleteGovRefDetails, getGovRefDetails } from '../../controllers/egyptN/egyptGovRefDetailsController.js';

const egyptGovRefDetailsRouter = express.Router();

// Create or update government reference details
egyptGovRefDetailsRouter.post('/create', createOrUpdateGovRefDetails);

// Get government reference details
egyptGovRefDetailsRouter.get(
    '/:applicationId/:applicantType?/:additionalApplicantIndex?',
    getGovRefDetails
);

// Delete government reference details
egyptGovRefDetailsRouter.delete(
    '/:applicationId/:applicantType?/:additionalApplicantIndex?',
    deleteGovRefDetails
);

export default egyptGovRefDetailsRouter;
