import express from 'express';
import { createOrUpdateGovRefDetails, deleteGovRefDetails, getGovRefDetails } from '../../controllers/kenya/kenyaGovRefDetailsController.js';

const kenyaGovRefDetailsRouter = express.Router();

// Create or update government reference details
kenyaGovRefDetailsRouter.post('/create', createOrUpdateGovRefDetails);

// Get government reference details
kenyaGovRefDetailsRouter.get(
    '/:applicationId/:applicantType?/:additionalApplicantIndex?',
    getGovRefDetails
);

// Delete government reference details
kenyaGovRefDetailsRouter.delete(
    '/:applicationId/:applicantType?/:additionalApplicantIndex?',
    deleteGovRefDetails
);

export default kenyaGovRefDetailsRouter;
