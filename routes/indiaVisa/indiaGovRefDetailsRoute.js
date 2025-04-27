import express from 'express';
import { createOrUpdateGovRefDetails, deleteGovRefDetails, getGovRefDetails } from '../../controllers/indiaVisa/indiaGovRefDetailsController.js';

const indiaGovRefDetailsRouter = express.Router();

// Create or update government reference details
indiaGovRefDetailsRouter.post('/create', createOrUpdateGovRefDetails);

// Get government reference details
indiaGovRefDetailsRouter.get('/:applicationId', getGovRefDetails);

// Delete government reference details
indiaGovRefDetailsRouter.delete('/:applicationId', deleteGovRefDetails);

export default indiaGovRefDetailsRouter;
