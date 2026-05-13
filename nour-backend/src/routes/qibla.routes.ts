/**
 * Qibla Routes
 * Qibla direction endpoints
 */

import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

// Get Qibla direction
router.get('/', async (req, res, next) => {
  try {
    const userId = (req as any).user.userId;
    const { lat, lon } = req.query;

    let latitude: number;
    let longitude: number;

    if (lat && lon) {
      latitude = parseFloat(lat as string);
      longitude = parseFloat(lon as string);
    } else {
      // Use user's saved location
      const { prisma } = await import('../config/database');
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { locationLat: true, locationLon: true }
      });

      if (!user?.locationLat || !user?.locationLon) {
        return res.status(400).json({
          success: false,
          message: 'Localisation requise',
          code: 'NO_LOCATION'
        });
      }

      latitude = user.locationLat;
      longitude = user.locationLon;
    }

    const qiblaService = await import('../services/qibla.service');
    const result = await qiblaService.default.getQiblaInfo(latitude, longitude, 'fr');

    res.json({
      success: true,
      data: result,
      meta: { timestamp: new Date().toISOString(), language: 'fr' }
    });
  } catch (error) { next(error); }
});

// Get location info
router.get('/location', async (req, res, next) => {
  try {
    const userId = (req as any).user.userId;

    const { prisma } = await import('../config/database');
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { locationLat: true, locationLon: true, cityName: true }
    });

    if (!user?.locationLat || !user?.locationLon) {
      return res.status(400).json({
        success: false,
        message: 'Localisation non configurée',
        code: 'NO_LOCATION'
      });
    }

    const qiblaService = await import('../services/qibla.service');
    const result = await qiblaService.default.getLocationInfo(
      user.locationLat,
      user.locationLon,
      user.cityName || undefined
    );

    res.json({
      success: true,
      data: result,
      meta: { timestamp: new Date().toISOString(), language: 'fr' }
    });
  } catch (error) { next(error); }
});

export default router;
