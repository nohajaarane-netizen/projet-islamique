/**
 * Daily Content Job
 * Rotates daily hadith, dua, and name at midnight per timezone
 */

import { Queue, Worker, Job } from 'bullmq';
import { getRedisClient } from '../config/redis';
import { logger } from '../utils/logger';
import { prisma } from '../config/database';

// Create queue
export const dailyContentQueue = new Queue('daily-content', {
  connection: getRedisClient(),
});

/**
 * Schedule daily content rotation
 */
export async function scheduleDailyContentRotation(): Promise<void> {
  // Run every day at midnight
  await dailyContentQueue.add(
    'rotate-content',
    {},
    {
      repeat: {
        pattern: '0 0 * * *', // Every day at midnight
      },
      jobId: 'daily-content-rotation',
    }
  );

  logger.info('Daily content rotation scheduled');
}

/**
 * Initialize daily content worker
 */
export function initializeDailyContentWorker(): Worker {
  const worker = new Worker(
    'daily-content',
    async (_job: Job) => {
      logger.info('Rotating daily content...');

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Get random hadith
      const hadithCount = await prisma.hadith.count();
      const hadithSkip = Math.floor(Math.random() * hadithCount);
      const randomHadith = await prisma.hadith.findFirst({
        skip: hadithSkip,
        take: 1,
      });

      // Get random dua
      const duaCount = await prisma.dua.count();
      const duaSkip = Math.floor(Math.random() * duaCount);
      const randomDua = await prisma.dua.findFirst({
        skip: duaSkip,
        take: 1,
      });

      // Get random unlearned name or fallback
      const unlearnedNames = await prisma.nameOfAllah.findMany({
        where: {
          userProgress: {
            none: {
              isLearned: true,
            },
          },
        },
        take: 1,
      });

      const randomName = unlearnedNames.length > 0 
        ? unlearnedNames[0] 
        : await prisma.nameOfAllah.findFirst({
            skip: Math.floor(Math.random() * await prisma.nameOfAllah.count()),
            take: 1,
          });

      // Update daily content
      await prisma.dailyContent.upsert({
        where: { date: today },
        update: {
          hadithId: randomHadith?.id || null,
          duaId: randomDua?.id || null,
          nameId: randomName?.id || null,
        },
        create: {
          date: today,
          hadithId: randomHadith?.id || null,
          duaId: randomDua?.id || null,
          nameId: randomName?.id || null,
        },
      });

      logger.info('Daily content rotated successfully');
      return { rotated: true };
    },
    {
      connection: getRedisClient(),
    }
  );

  worker.on('completed', (job) => {
    logger.debug(`Daily content job completed: ${job.id}`);
  });

  worker.on('failed', (job, err) => {
    logger.error(`Daily content job failed: ${job?.id}`, err);
  });

  return worker;
}

export default {
  dailyContentQueue,
  scheduleDailyContentRotation,
  initializeDailyContentWorker,
};
