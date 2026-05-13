/**
 * AsmaUlHusna Routes
 * 99 Names of Allah endpoints
 */

import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

// Get all names with pagination
router.get('/', async (req, res, next) => {
  try {
    const { page = '1', limit = '12', filter = 'all', search } = req.query;
    const userId = (req as any).user.userId;

    const asmaulhusnaService = await import('../services/asmaulhusna.service');
    const result = await asmaulhusnaService.default.getNames(
      userId,
      parseInt(page as string),
      parseInt(limit as string),
      filter as any,
      search as string
    );

    res.json({
      success: true,
      data: result,
      meta: { timestamp: new Date().toISOString(), language: 'fr' }
    });
  } catch (error) { next(error); }
});

// Get name detail
router.get('/:id', async (req, res, next) => {
  try {
    const userId = (req as any).user.userId;
    const nameId = parseInt(req.params.id);

    const asmaulhusnaService = await import('../services/asmaulhusna.service');
    const result = await asmaulhusnaService.default.getNameDetail(userId, nameId);

    res.json({
      success: true,
      data: result,
      meta: { timestamp: new Date().toISOString(), language: 'fr' }
    });
  } catch (error) { next(error); }
});

// Mark as learned
router.post('/:id/learn', async (req, res, next) => {
  try {
    const userId = (req as any).user.userId;
    const nameId = parseInt(req.params.id);
    const { learned = true } = req.body;

    const asmaulhusnaService = await import('../services/asmaulhusna.service');
    const result = await asmaulhusnaService.default.markLearned(userId, nameId, learned);

    res.json({
      success: true,
      message: learned ? 'Nom marqué comme appris' : 'Nom marqué non appris',
      data: result,
      meta: { timestamp: new Date().toISOString(), language: 'fr' }
    });
  } catch (error) { next(error); }
});

// Toggle favorite
router.post('/:id/favorite', async (req, res, next) => {
  try {
    const userId = (req as any).user.userId;
    const nameId = parseInt(req.params.id);

    const asmaulhusnaService = await import('../services/asmaulhusna.service');
    const result = await asmaulhusnaService.default.toggleFavorite(userId, nameId);

    res.json({
      success: true,
      message: result.isFavorite ? 'Ajouté aux favoris' : 'Retiré des favoris',
      data: result,
      meta: { timestamp: new Date().toISOString(), language: 'fr' }
    });
  } catch (error) { next(error); }
});

// Get progress
router.get('/progress', async (req, res, next) => {
  try {
    const userId = (req as any).user.userId;

    const asmaulhusnaService = await import('../services/asmaulhusna.service');
    const result = await asmaulhusnaService.default.getProgress(userId);

    res.json({
      success: true,
      data: result,
      meta: { timestamp: new Date().toISOString(), language: 'fr' }
    });
  } catch (error) { next(error); }
});

// Get daily name
router.get('/daily/today', async (req, res, next) => {
  try {
    const userId = (req as any).user.userId;

    const asmaulhusnaService = await import('../services/asmaulhusna.service');
    const result = await asmaulhusnaService.default.getDailyName(userId);

    res.json({
      success: true,
      data: result,
      meta: { timestamp: new Date().toISOString(), language: 'fr' }
    });
  } catch (error) { next(error); }
});

export default router;
