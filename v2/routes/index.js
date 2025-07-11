import express from 'express';
import adminRoutes from './admin/index.js';
import docsRoutes from './docs.js';

const router = express.Router();

// Mount route modules
router.use('/admin', adminRoutes);

// Documentation routes
router.use('/docs', docsRoutes);

// V2 API health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Visa Application API v2 is running',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    modules: {
      admin: 'active',
      user: 'coming_soon',
    },
  });
});

export default router;
