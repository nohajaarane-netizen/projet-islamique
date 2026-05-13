/**
 * Dhikr Routes
 * Dhikr counter endpoints
 */

import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

// Increment dhikr
router.post('/', async (req, res, next) => {
  try {
    const userId = (req as any).user.userId;
    const { type, count = 1 } = req.body;

    const dhikrService = await import('../services/dhikr.service');
    const result = await dhikrService.default.incrementCount(userId, type, count);

    res.json({
      success: true,
      message: 'Dhikr mis à jour',
      data: result,
      meta: { timestamp: new Date().toISOString(), language: 'fr' }
    });
  } catch (error) { next(error); }
});

// Get today's dhikr
router.get('/today', async (req, res, next) => {
  try {
    const userId = (req as any).user.userId;

    const dhikrService = await import('../services/dhikr.service');
    const result = await dhikrService.default.getTodayDhikr(userId);

    res.json({
      success: true,
      data: result,
      meta: { timestamp: new Date().toISOString(), language: 'fr' }
    });
  } catch (error) { next(error); }
});

// Get history
router.get('/history', async (req, res, next) => {
  try {
    const userId = (req as any).user.userId;
    const { days = '7' } = req.query;

    const dhikrService = await import('../services/dhikr.service');
    const result = await dhikrService.default.getHistory(userId, parseInt(days as string));

    res.json({
      success: true,
      data: result,
      meta: { timestamp: new Date().toISOString(), language: 'fr' }
    });
  } catch (error) { next(error); }
});

export default router;
