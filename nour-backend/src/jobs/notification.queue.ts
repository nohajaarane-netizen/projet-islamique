/**
 * Notification Queue
 * BullMQ queue for prayer time notifications
 */

import { Queue, Worker, Job } from 'bullmq';
import { getRedisClient } from '../config/redis';
import { logger } from '../utils/logger';
import { prisma } from '../config/database';

// Create queue
export const notificationQueue = new Queue('prayer-notifications', {
  connection: getRedisClient(),
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  },
});

/**
 * Schedule prayer notification
 */
export async function scheduleNotification(
  userId: string,
  prayerType: string,
  prayerTime: Date,
  minutesBefore: number = 15
): Promise<void> {
  const notifyTime = new Date(prayerTime);
  notifyTime.setMinutes(notifyTime.getMinutes() - minutesBefore);

  const delay = notifyTime.getTime() - Date.now();

  if (delay > 0) {
    await notificationQueue.add(
      'prayer-reminder',
      {
        userId,
        prayerType,
        prayerTime: prayerTime.toISOString(),
        minutesBefore,
      },
      {
        delay,
        jobId: `${userId}-${prayerType}-${prayerTime.toISOString().split('T')[0]}`,
      }
    );

    logger.info(`Scheduled ${prayerType} notification for user ${userId} in ${Math.round(delay / 1000 / 60)} minutes`);
  }
}

/**
 * Initialize notification worker
 */
export function initializeNotificationWorker(): Worker {
  const worker = new Worker(
    'prayer-notifications',
    async (job: Job) => {
      const { userId, prayerType, prayerTime, minutesBefore } = job.data;

      logger.info(`Sending notification: ${prayerType} for user ${userId}`);

      // Here you would integrate with:
      // - Firebase Cloud Messaging for push notifications
      // - Email service
      // - WebSocket emit

      // Example: Get user's notification settings
      const settings = await prisma.notificationSetting.findUnique({
        where: {
          userId_prayerType: {
            userId,
            prayerType,
          },
        },
      });

      if (settings?.isEnabled) {
        // Send notification (implementation depends on your notification provider)
        logger.info(`Notification sent: ${prayerType} for user ${userId}`);
      }

      return { sent: true };
    },
    {
      connection: getRedisClient(),
    }
  );

  worker.on('completed', (job) => {
    logger.debug(`Notification job completed: ${job.id}`);
  });

  worker.on('failed', (job, err) => {
    logger.error(`Notification job failed: ${job?.id}`, err);
  });

  return worker;
}

export default {
  notificationQueue,
  scheduleNotification,
  initializeNotificationWorker,
};
