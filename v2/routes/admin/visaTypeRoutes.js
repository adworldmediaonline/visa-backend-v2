import express from 'express';
import {
  createVisaType,
  deleteVisaType,
  getActiveVisaTypes,
  getVisaTypeById,
  getVisaTypes,
  getVisaTypesByCategory,
  hardDeleteVisaType,
  toggleVisaTypeStatus,
  updateVisaType,
} from '../../controllers/admin/visaTypeController.js';
import { validateSchema } from '../../middleware/validation.js';
import {
  createVisaTypeSchema,
  updateVisaTypeSchema,
} from '../../schemas/admin.js';
import { objectIdSchema } from '../../schemas/common.js';

const router = express.Router();

// Public routes
router.get('/active', getActiveVisaTypes);
router.get('/category/:category', getVisaTypesByCategory);

// Admin routes
router.get('/', getVisaTypes);
router.get(
  '/:id',
  validateSchema({
    params: { id: objectIdSchema },
  }),
  getVisaTypeById
);
router.post(
  '/',
  validateSchema({ body: createVisaTypeSchema }),
  createVisaType
);
router.put(
  '/:id',
  validateSchema({
    params: { id: objectIdSchema },
    body: updateVisaTypeSchema,
  }),
  updateVisaType
);
router.delete(
  '/:id',
  validateSchema({
    params: { id: objectIdSchema },
  }),
  deleteVisaType
);
router.delete(
  '/:id/hard',
  validateSchema({
    params: { id: objectIdSchema },
  }),
  hardDeleteVisaType
);
router.patch(
  '/:id/toggle-status',
  validateSchema({
    params: { id: objectIdSchema },
  }),
  toggleVisaTypeStatus
);

export default router;
