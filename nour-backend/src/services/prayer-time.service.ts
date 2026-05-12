/**
 * Prayer Time Service
 * Calculates and manages prayer times with caching
 */

import { prisma } from '../config/database';
import { cache } from '../config/redis';
import { logger } from '../utils/logger';
import { ApiError } from '../middleware/error-handler';
import { getPrayerTimes, getMonthlyPrayerTimes, getNextPrayer } from '../utils/prayer-calculator';
import { DailyPrayerTimes, MonthlyPrayerTimes, NextPrayerInfo } from '../types';

/**
 * Get daily prayer times for a user
 */
export async function getDailyTimes(
  userId: string,
  date?: Date
): Promise<DailyPrayerTimes> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { locationLat: true, locationLon: true },
  });

  if (!user || !user.locationLat || !user.locationLon) {
    throw new ApiError('Localisation non configurée', 400, 'NO_LOCATION');
  }

  const targetDate = date || new Date();
  const dateStr = targetDate.toISOString().split('T')[0];
  const cacheKey = `prayer:${userId}:${dateStr}`;

  // Check cache
  const cached = await cache.get<DailyPrayerTimes>(cacheKey);
  if (cached) {
    logger.debug('Prayer times cache hit');
    return cached;
  }

  // Calculate fresh
  const times = getPrayerTimes(
    user.locationLat,
    user.locationLon,
    targetDate,
    'MWL',
    'Shafi'
  );

  // Cache for 24 hours
  await cache.set(cacheKey, times, 86400);

  // Store in database for record
  await prisma.prayerTime.upsert({
    where: {
      userId_date: {
        userId,
        date: targetDate,
      },
    },
    update: {
      fajr: new Date(`${dateStr}T${times.times.fajr}`),
      chourouq: new Date(`${dateStr}T${times.times.chourouq}`),
      dhuhr: new Date(`${dateStr}T${times.times.dhuhr}`),
      asr: new Date(`${dateStr}T${times.times.asr}`),
      maghrib: new Date(`${dateStr}T${times.times.maghrib}`),
      isha: new Date(`${dateStr}T${times.times.isha}`),
      hijriDate: times.hijriDate,
    },
    create: {
      userId,
      date: targetDate,
      fajr: new Date(`${dateStr}T${times.times.fajr}`),
      chourouq: new Date(`${dateStr}T${times.times.chourouq}`),
      dhuhr: new Date(`${dateStr}T${times.times.dhuhr}`),
      asr: new Date(`${dateStr}T${times.times.asr}`),
      maghrib: new Date(`${dateStr}T${times.times.maghrib}`),
      isha: new Date(`${dateStr}T${times.times.isha}`),
      hijriDate: times.hijriDate,
    },
  });

  return times;
}

/**
 * Get monthly prayer times
 */
export async function getMonthlyTimes(
  userId: string,
  month: number,
  year: number
): Promise<MonthlyPrayerTimes> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { locationLat: true, locationLon: true },
  });

  if (!user || !user.locationLat || !user.locationLon) {
    throw new ApiError('Localisation non configurée', 400, 'NO_LOCATION');
  }

  const cacheKey = `prayer:monthly:${userId}:${year}:${month}`;

  const cached = await cache.get<MonthlyPrayerTimes>(cacheKey);
  if (cached) {
    return cached;
  }

  const times = getMonthlyPrayerTimes(
    user.locationLat,
    user.locationLon,
    month,
    year,
    'MWL',
    'Shafi'
  );

  await cache.set(cacheKey, times, 86400);

  return times;
}

/**
 * Get next prayer information
 */
export async function getNextPrayerInfo(userId: string): Promise<NextPrayerInfo> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { locationLat: true, locationLon: true },
  });

  if (!user || !user.locationLat || !user.locationLon) {
    throw new ApiError('Localisation non configurée', 400, 'NO_LOCATION');
  }

  return getNextPrayer(user.locationLat, user.locationLon, 'MWL', 'Shafi');
}

/**
 * Get notification settings
 */
export async function getNotificationSettings(userId: string) {
  const settings = await prisma.notificationSetting.findMany({
    where: { userId },
    select: {
      prayerType: true,
      isEnabled: true,
      minutesBefore: true,
    },
  });

  return settings;
}

/**
 * Update notification settings
 */
export async function updateNotificationSetting(
  userId: string,
  prayerType: string,
  isEnabled: boolean,
  minutesBefore?: number
) {
  const updated = await prisma.notificationSetting.upsert({
    where: {
      userId_prayerType: {
        userId,
        prayerType: prayerType as any,
      },
    },
    update: {
      isEnabled,
      ...(minutesBefore !== undefined && { minutesBefore }),
    },
    create: {
      userId,
      prayerType: prayerType as any,
      isEnabled,
      ...(minutesBefore !== undefined && { minutesBefore }),
    },
  });

  return updated;
}

export default {
  getDailyTimes,
  getMonthlyTimes,
  getNextPrayerInfo,
  getNotificationSettings,
  updateNotificationSetting,
};
