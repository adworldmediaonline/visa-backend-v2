import express from 'express';
import {
  checkVisaEligibility,
  createVisaRule,
  deleteVisaRule,
  getVisaRuleById,
  getVisaRules,
  getVisaRulesForDestination,
  hardDeleteVisaRule,
  toggleVisaRuleStatus,
  updateVisaRule,
} from '../../controllers/admin/visaRuleController.js';
import { validateSchema } from '../../middleware/validation.js';
import {
  createVisaRuleSchema,
  updateVisaRuleSchema,
} from '../../schemas/admin.js';
import { objectIdSchema } from '../../schemas/common.js';

const router = express.Router();

// Public routes
router.get('/check-eligibility', checkVisaEligibility);
router.get(
  '/destination/:countryId',
  validateSchema({
    params: { countryId: objectIdSchema },
  }),
  getVisaRulesForDestination
);

// Admin routes
router.get('/', getVisaRules);
router.get(
  '/:id',
  validateSchema({
    params: { id: objectIdSchema },
  }),
  getVisaRuleById
);
router.post(
  '/',
  validateSchema({ body: createVisaRuleSchema }),
  createVisaRule
);
router.put(
  '/:id',
  validateSchema({
    params: { id: objectIdSchema },
    body: updateVisaRuleSchema,
  }),
  updateVisaRule
);
router.delete(
  '/:id',
  validateSchema({
    params: { id: objectIdSchema },
  }),
  deleteVisaRule
);
router.delete(
  '/:id/hard',
  validateSchema({
    params: { id: objectIdSchema },
  }),
  hardDeleteVisaRule
);
router.patch(
  '/:id/toggle-status',
  validateSchema({
    params: { id: objectIdSchema },
  }),
  toggleVisaRuleStatus
);

export default router;
