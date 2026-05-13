/**
 * Prayer Time Routes
 * Prayer schedule endpoints
 */

import { Router } from 'express';
import * as prayerTimeController from '../controllers/prayer-time.controller';
import { authenticateToken } from '../middleware/auth';
import { prayerCalcLimiter } from '../middleware/rate-limiter';

const router = Router();

router.use(authenticateToken);

router.get('/daily', prayerCalcLimiter, prayerTimeController.getDaily);
router.get('/monthly', prayerCalcLimiter, prayerTimeController.getMonthly);
router.get('/next', prayerTimeController.getNext);
router.get('/notifications', prayerTimeController.getNotifications);
router.post('/notifications', prayerTimeController.updateNotification);

export default router;
