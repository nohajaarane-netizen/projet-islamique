/**
 * Auth Routes
 * Authentication endpoints
 */

import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validateBody } from '../middleware/validate-request';
import { authenticateToken } from '../middleware/auth';
import { authLimiter } from '../middleware/rate-limiter';

const router = Router();

// Public routes with rate limiting
router.post('/register', authLimiter, validateBody(authController.registerSchema), authController.register);
router.post('/login', authLimiter, validateBody(authController.loginSchema), authController.login);
router.post('/refresh', authLimiter, validateBody(authController.refreshSchema), authController.refresh);

// Protected routes
router.get('/profile', authenticateToken, authController.getProfile);
router.put('/profile', authenticateToken, authController.updateProfile);

export default router;
