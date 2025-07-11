import express from 'express';
import countryRoutes from './countryRoutes.js';
import visaRuleRoutes from './visaRuleRoutes.js';
import visaTypeRoutes from './visaTypeRoutes.js';

const router = express.Router();

// Mount admin route modules
router.use('/countries', countryRoutes);
router.use('/visa-types', visaTypeRoutes);
router.use('/visa-rules', visaRuleRoutes);

// Health check for admin API
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Admin API v2 is running',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
  });
});

export default router;
