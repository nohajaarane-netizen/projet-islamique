/**
 * Content Routes
 * Hadith and Dua endpoints combined
 */

import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

// ============== HADITH ENDPOINTS ==============

// Get hadiths
router.get('/hadiths', async (req, res, next) => {
  try {
    const { category, page = '1', limit = '10', search } = req.query;
    const userId = (req as any).user.userId;

    const hadithService = await import('../services/hadith.service');
    const result = await hadithService.default.getHadiths(
      userId,
      category as string,
      parseInt(page as string),
      parseInt(limit as string),
      search as string
    );

    res.json({
      success: true,
      data: result,
      meta: { timestamp: new Date().toISOString(), language: 'fr' }
    });
  } catch (error) { next(error); }
});

// Get daily hadith
router.get('/hadiths/daily', async (req, res, next) => {
  try {
    const userId = (req as any).user.userId;

    const hadithService = await import('../services/hadith.service');
    const result = await hadithService.default.getDailyHadith(userId);

    res.json({
      success: true,
      data: result,
      meta: { timestamp: new Date().toISOString(), language: 'fr' }
    });
  } catch (error) { next(error); }
});

// Get single hadith
router.get('/hadiths/:id', async (req, res, next) => {
  try {
    const userId = (req as any).user.userId;
    const hadithId = req.params.id;

    const hadithService = await import('../services/hadith.service');
    const result = await hadithService.default.getHadithById(userId, hadithId);

    res.json({
      success: true,
      data: result,
      meta: { timestamp: new Date().toISOString(), language: 'fr' }
    });
  } catch (error) { next(error); }
});

// ============== DUA ENDPOINTS ==============

// Get duas
router.get('/duas', async (req, res, next) => {
  try {
    const { category, page = '1', limit = '10', search } = req.query;
    const userId = (req as any).user.userId;

    const duaService = await import('../services/dua.service');
    const result = await duaService.default.getDuas(
      userId,
      category as string,
      parseInt(page as string),
      parseInt(limit as string),
      search as string
    );

    res.json({
      success: true,
      data: result,
      meta: { timestamp: new Date().toISOString(), language: 'fr' }
    });
  } catch (error) { next(error); }
});

// Get daily dua
router.get('/duas/daily', async (req, res, next) => {
  try {
    const userId = (req as any).user.userId;

    const duaService = await import('../services/dua.service');
    const result = await duaService.default.getDailyDua(userId);

    res.json({
      success: true,
      data: result,
      meta: { timestamp: new Date().toISOString(), language: 'fr' }
    });
  } catch (error) { next(error); }
});

// Get single dua
router.get('/duas/:id', async (req, res, next) => {
  try {
    const userId = (req as any).user.userId;
    const duaId = req.params.id;

    const duaService = await import('../services/dua.service');
    const result = await duaService.default.getDuaById(userId, duaId);

    res.json({
      success: true,
      data: result,
      meta: { timestamp: new Date().toISOString(), language: 'fr' }
    });
  } catch (error) { next(error); }
});

// ============== SEARCH ==============

// Search across content
router.get('/search', async (req, res, next) => {
  try {
    const { q } = req.query;
    const userId = (req as any).user.userId;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Query parameter required',
        code: 'MISSING_QUERY'
      });
    }

    const [hadithService, duaService] = await Promise.all([
      import('../services/hadith.service'),
      import('../services/dua.service')
    ]);

    const [hadiths, duas] = await Promise.all([
      hadithService.default.getHadiths(userId, undefined, 1, 5, q as string),
      duaService.default.getDuas(userId, undefined, 1, 5, q as string)
    ]);

    res.json({
      success: true,
      data: {
        hadiths: hadiths.hadiths,
        duas: duas.duas,
        total: hadiths.total + duas.total
      },
      meta: { timestamp: new Date().toISOString(), language: 'fr' }
    });
  } catch (error) { next(error); }
});

export default router;
