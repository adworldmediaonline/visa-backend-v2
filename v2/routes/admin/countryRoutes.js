import express from 'express';
import {
  createCountry,
  deleteCountry,
  getCountries,
  getCountryById,
  getDestinationCountries,
  getOriginCountries,
  hardDeleteCountry,
  toggleCountryStatus,
  updateCountry,
} from '../../controllers/admin/countryController.js';
import { validateSchema } from '../../middleware/validation.js';
import {
  countryParamsSchema,
  countryQuerySchema,
  createCountrySchema,
  updateCountrySchema,
} from '../../schemas/admin.js';

const router = express.Router();

// Public routes (for user selection)
router.get('/origin', getOriginCountries);
router.get('/destination', getDestinationCountries);

// Admin routes
router.get('/', validateSchema({ query: countryQuerySchema }), getCountries);
router.get(
  '/:id',
  validateSchema({ params: countryParamsSchema }),
  getCountryById
);
router.post('/', validateSchema({ body: createCountrySchema }), createCountry);
router.put(
  '/:id',
  validateSchema({
    params: countryParamsSchema,
    body: updateCountrySchema,
  }),
  updateCountry
);
router.delete(
  '/:id',
  validateSchema({ params: countryParamsSchema }),
  deleteCountry
);
router.delete(
  '/:id/hard',
  validateSchema({ params: countryParamsSchema }),
  hardDeleteCountry
);
router.patch(
  '/:id/toggle-status',
  validateSchema({ params: countryParamsSchema }),
  toggleCountryStatus
);

export default router;
