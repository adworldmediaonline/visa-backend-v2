import express from 'express';
import { getAdmin, loginAdmin, registerAdmin, updateAdmin, deleteAdmin } from '../../controllers/adminD/adminController.js';
import { verifyToken, restrictTo } from '../../middleware/authMiddleware.js';

const adminRouter = express.Router();

// Public routes
adminRouter.post('/login', loginAdmin);
adminRouter.post('/register', registerAdmin);

// Protected routes
adminRouter.use(verifyToken); // Apply token verification to all routes below

// Routes accessible by all authenticated admins
adminRouter.get('/profile/:id', getAdmin);
adminRouter.put('/profile/:id', updateAdmin);

// Routes accessible only by super admins
// adminRouter.post('/register', restrictTo('superAdmin'), registerAdmin);
adminRouter.delete('/:id', restrictTo('superAdmin'), deleteAdmin);

export default adminRouter;
