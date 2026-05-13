/**
 * Gratitude Routes
 * Alhamdulillah journal endpoints
 */

import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

// Create entry
router.post('/', async (req, res, next) => {
  try {
    const userId = (req as any).user.userId;
    const { text, category = 'ALLAH' } = req.body;

    const gratitudeService = await import('../services/gratitude.service');
    const result = await gratitudeService.default.createEntry(userId, text, category);

    res.status(201).json({
      success: true,
      message: 'Gratitude enregistrée',
      data: result,
      meta: { timestamp: new Date().toISOString(), language: 'fr' }
    });
  } catch (error) { next(error); }
});

// Get recent entries
router.get('/recent', async (req, res, next) => {
  try {
    const userId = (req as any).user.userId;
    const { limit = '10', offset = '0' } = req.query;

    const gratitudeService = await import('../services/gratitude.service');
    const result = await gratitudeService.default.getRecentEntries(
      userId,
      parseInt(limit as string),
      parseInt(offset as string)
    );

    res.json({
      success: true,
      data: result,
      meta: { timestamp: new Date().toISOString(), language: 'fr' }
    });
  } catch (error) { next(error); }
});

// Get stats
router.get('/stats', async (req, res, next) => {
  try {
    const userId = (req as any).user.userId;

    const gratitudeService = await import('../services/gratitude.service');
    const result = await gratitudeService.default.getStats(userId);

    res.json({
      success: true,
      data: result,
      meta: { timestamp: new Date().toISOString(), language: 'fr' }
    });
  } catch (error) { next(error); }
});

// Get themes
router.get('/themes', async (req, res, next) => {
  try {
    const userId = (req as any).user.userId;

    const gratitudeService = await import('../services/gratitude.service');
    const result = await gratitudeService.default.getThemes(userId);

    res.json({
      success: true,
      data: result,
      meta: { timestamp: new Date().toISOString(), language: 'fr' }
    });
  } catch (error) { next(error); }
});

// Get categories
router.get('/categories', async (req, res, next) => {
  try {
    const gratitudeService = await import('../services/gratitude.service');
    const result = gratitudeService.default.getCategories();

    res.json({
      success: true,
      data: result,
      meta: { timestamp: new Date().toISOString(), language: 'fr' }
    });
  } catch (error) { next(error); }
});

export default router;
