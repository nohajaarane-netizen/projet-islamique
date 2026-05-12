/**
 * Notification Service
 * Manages prayer time notifications via BullMQ
 */

import { Queue } from 'bullmq';
import { prisma } from '../config/database';
import { getRedisClient } from '../config/redis';
import { logger } from '../utils/logger';

// Notification queue
const notificationQueue = new Queue('prayer-notifications', {
  connection: getRedisClient(),
});

/**
 * Schedule prayer notifications for a user
 */
export async function schedulePrayerNotifications(userId: string): Promise<void> {
  try {
    // Get user settings
    const [user, settings] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { locationLat: true, locationLon: true, timezone: true },
      }),
      prisma.notificationSetting.findMany({
        where: { userId, isEnabled: true },
      }),
    ]);

    if (!user || !user.locationLat || !user.locationLon) {
      logger.warn(`Cannot schedule notifications for user ${userId}: no location`);
      return;
    }

    // Clear existing jobs for this user
    const jobs = await notificationQueue.getJobs(['delayed']);
    for (const job of jobs) {
      if (job.data.userId === userId) {
        await job.remove();
      }
    }

    // Schedule new notifications (simplified - would need actual prayer times)
    for (const setting of settings) {
      const prayerTime = getPrayerTimeForType(setting.prayerType);
      const notifyTime = new Date(prayerTime);
      notifyTime.setMinutes(notifyTime.getMinutes() - setting.minutesBefore);

      if (notifyTime > new Date()) {
        await notificationQueue.add(
          'prayer-reminder',
          {
            userId,
            prayerType: setting.prayerType,
            minutesBefore: setting.minutesBefore,
          },
          {
            delay: notifyTime.getTime() - Date.now(),
          }
        );
      }
    }

    logger.info(`Scheduled ${settings.length} notifications for user ${userId}`);
  } catch (error) {
    logger.error('Failed to schedule notifications:', error);
  }
}

/**
 * Get prayer time for type (placeholder)
 */
function getPrayerTimeForType(type: string): Date {
  const now = new Date();
  const times: Record<string, number> = {
    FAJR: 5,
    DHUHR: 12,
    ASR: 16,
    MAGHRIB: 19,
    ISHA: 20,
  };

  const hour = times[type] || 12;
  now.setHours(hour, 0, 0, 0);

  if (now < new Date()) {
    now.setDate(now.getDate() + 1);
  }

  return now;
}

export default {
  schedulePrayerNotifications,
  notificationQueue,
};
