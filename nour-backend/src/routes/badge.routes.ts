import { Router } from 'express';
import { BadgeController } from '../controllers/badge.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
const badgeController = new BadgeController();

router.get('/', authMiddleware, badgeController.getUserBadges.bind(badgeController));
router.post('/check', authMiddleware, badgeController.checkNewBadges.bind(badgeController));

export default router;