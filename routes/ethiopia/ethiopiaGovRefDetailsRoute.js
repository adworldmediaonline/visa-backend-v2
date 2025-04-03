import express from 'express';
import {
    createOrUpdateGovRefDetails,
    getGovRefDetails,
    deleteGovRefDetails,
} from '../../controllers/ethiopia/ethiopiaGovRefDetailsController.js';

const ethiopiaGovRefDetailsRouter = express.Router();

// Create or update government reference details
ethiopiaGovRefDetailsRouter.post('/create', createOrUpdateGovRefDetails);

// Get government reference details
ethiopiaGovRefDetailsRouter.get(
    '/:applicationId/:applicantType?/:additionalApplicantIndex?',
    getGovRefDetails
);

// Delete government reference details
ethiopiaGovRefDetailsRouter.delete(
    '/:applicationId/:applicantType?/:additionalApplicantIndex?',
    deleteGovRefDetails
);

export default ethiopiaGovRefDetailsRouter;
