/**
 * Tracker Routes
 * Prayer tracking endpoints
 */

import { Router } from 'express';
import * as trackerController from '../controllers/tracker.controller';
import { authenticateToken } from '../middleware/auth';
import { validateBody } from '../middleware/validate-request';

const router = Router();

router.use(authenticateToken);

router.get('/today', trackerController.getToday);
router.post('/mark', validateBody(trackerController.markPrayerSchema), trackerController.markPrayer);
router.get('/streaks', trackerController.getStreaks);
router.get('/constancy', trackerController.getConstancy);
router.get('/heatmap', trackerController.getHeatmap);
router.get('/sunnah', trackerController.getSunnah);
router.get('/badges', trackerController.getBadges);

export default router;
