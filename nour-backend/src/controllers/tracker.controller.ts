/**
 * Tracker Controller
 * Handles prayer tracking HTTP requests
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as trackerService from '../services/tracker.service';
import { ApiError } from '../middleware/error-handler';

export const markPrayerSchema = z.object({
  prayerType: z.enum(['FAJR', 'DHUHR', 'ASR', 'MAGHRIB', 'ISHA']),
  status: z.enum(['COMPLETED', 'MISSED', 'PENDING']),
});

/**
 * Get today's tracking
 */
export async function getToday(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new ApiError('Non authentifi\u00e9', 401, 'UNAUTHORIZED');
    }

    const tracking = await trackerService.getTodayTracking(userId);

    res.status(200).json({
      success: true,
      message: 'Suivi du jour r\u00e9cup\u00e9r\u00e9',
      data: tracking,
      meta: {
        timestamp: new Date().toISOString(),
        language: 'fr',
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Mark prayer status
 */
export async function markPrayer(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new ApiError('Non authentifi\u00e9', 401, 'UNAUTHORIZED');
    }

    const { prayerType, status } = req.body;
    const result = await trackerService.markPrayer(userId, prayerType, status);

    res.status(200).json({
      success: true,
      message: `Prière ${prayerType} marquée ${status}`,
      data: result,
      meta: {
        timestamp: new Date().toISOString(),
        language: 'fr',
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get streaks
 */
export async function getStreaks(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new ApiError('Non authentifi\u00e9', 401, 'UNAUTHORIZED');
    }

    const streaks = await trackerService.getStreaks(userId);

    res.status(200).json({
      success: true,
      message: 'S\u00e9ries r\u00e9cup\u00e9r\u00e9es',
      data: streaks,
      meta: {
        timestamp: new Date().toISOString(),
        language: 'fr',
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get constancy chart
 */
export async function getConstancy(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new ApiError('Non authentifi\u00e9', 401, 'UNAUTHORIZED');
    }

    const days = parseInt(req.query.days as string) || 7;
    const constancy = await trackerService.getConstancy(userId, days);

    res.status(200).json({
      success: true,
      message: 'Constance r\u00e9cup\u00e9r\u00e9e',
      data: constancy,
      meta: {
        timestamp: new Date().toISOString(),
        language: 'fr',
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get monthly heatmap
 */
export async function getHeatmap(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new ApiError('Non authentifi\u00e9', 401, 'UNAUTHORIZED');
    }

    const year = parseInt(req.query.year as string) || new Date().getFullYear();
    const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;

    const heatmap = await trackerService.getMonthlyHeatmap(userId, year, month);

    res.status(200).json({
      success: true,
      message: 'Heatmap r\u00e9cup\u00e9r\u00e9',
      data: heatmap,
      meta: {
        timestamp: new Date().toISOString(),
        language: 'fr',
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get sunnah progress
 */
export async function getSunnah(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new ApiError('Non authentifi\u00e9', 401, 'UNAUTHORIZED');
    }

    const progress = await trackerService.getSunnahProgress(userId);

    res.status(200).json({
      success: true,
      message: 'Progression Sunnah r\u00e9cup\u00e9r\u00e9e',
      data: progress,
      meta: {
        timestamp: new Date().toISOString(),
        language: 'fr',
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get badges
 */
export async function getBadges(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new ApiError('Non authentifi\u00e9', 401, 'UNAUTHORIZED');
    }

    const badges = await trackerService.getBadges(userId);

    res.status(200).json({
      success: true,
      message: 'Badges r\u00e9cup\u00e9r\u00e9s',
      data: badges,
      meta: {
        timestamp: new Date().toISOString(),
        language: 'fr',
      },
    });
  } catch (error) {
    next(error);
  }
}

export default {
  getToday,
  markPrayer,
  getStreaks,
  getConstancy,
  getHeatmap,
  getSunnah,
  getBadges,
};
