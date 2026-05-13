/**
 * Prayer Time Controller
 * Handles prayer time HTTP requests
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as prayerTimeService from '../services/prayer-time.service';
import { ApiError } from '../middleware/error-handler';

export const dateQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export const monthQuerySchema = z.object({
  month: z.string().regex(/^\d{1,2}$/).transform(Number),
  year: z.string().regex(/^\d{4}$/).transform(Number),
});

/**
 * Get daily prayer times
 */
export async function getDaily(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new ApiError('Non authentifié', 401, 'UNAUTHORIZED');
    }

    const date = req.query.date ? new Date(req.query.date as string) : new Date();
    const times = await prayerTimeService.getDailyTimes(userId, date);

    res.status(200).json({
      success: true,
      message: 'Horaires du jour récupérés',
      data: times,
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
 * Get monthly prayer times
 */
export async function getMonthly(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new ApiError('Non authentifié', 401, 'UNAUTHORIZED');
    }

    const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year as string) || new Date().getFullYear();

    const times = await prayerTimeService.getMonthlyTimes(userId, month, year);

    res.status(200).json({
      success: true,
      message: 'Horaires du mois récupérés',
      data: times,
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
 * Get next prayer
 */
export async function getNext(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new ApiError('Non authentifié', 401, 'UNAUTHORIZED');
    }

    const nextPrayer = await prayerTimeService.getNextPrayerInfo(userId);

    res.status(200).json({
      success: true,
      message: 'Prochaine prière récupérée',
      data: nextPrayer,
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
 * Get notification settings
 */
export async function getNotifications(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new ApiError('Non authentifié', 401, 'UNAUTHORIZED');
    }

    const settings = await prayerTimeService.getNotificationSettings(userId);

    res.status(200).json({
      success: true,
      message: 'Paramètres de notification récupérés',
      data: settings,
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
 * Update notification setting
 */
export async function updateNotification(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new ApiError('Non authentifié', 401, 'UNAUTHORIZED');
    }

    const { prayerType, isEnabled, minutesBefore } = req.body;
    const setting = await prayerTimeService.updateNotificationSetting(
      userId,
      prayerType,
      isEnabled,
      minutesBefore
    );

    res.status(200).json({
      success: true,
      message: 'Paramètre de notification mis à jour',
      data: setting,
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
  getDaily,
  getMonthly,
  getNext,
  getNotifications,
  updateNotification,
};
