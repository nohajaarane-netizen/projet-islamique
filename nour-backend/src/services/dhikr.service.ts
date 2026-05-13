/**
 * Dhikr Counter Service
 * Manages dhikr counts and daily totals
 */

import { prisma } from '../config/database';
import { logger } from '../utils/logger';
import { ApiError } from '../middleware/error-handler';
import { DailyDhikr, DhikrCount } from '../types';

const DHIKR_TYPES = [
  { type: 'SUBHANALLAH', label: 'SubhanAllah', target: 33 },
  { type: 'ALHAMDULILLAH', label: 'Alhamdulillah', target: 33 },
  { type: 'ALLAHUAKBAR', label: 'Allahu Akbar', target: 34 },
  { type: 'LAILAHAILLALLAH', label: 'La ilaha illallah', target: 100 },
  { type: 'ASTAGHFIRULLAH', label: 'Astaghfirullah', target: 100 },
  { type: 'SALAWAT', label: 'Salawat', target: 100 },
];

/**
 * Increment dhikr count
 */
export async function incrementCount(
  userId: string,
  type: string,
  count: number = 1
) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const entry = await prisma.dhikrEntry.upsert({
    where: {
      userId_type_date: {
        userId,
        type: type as any,
        date: today,
      },
    },
    update: {
      count: {
        increment: count,
      },
    },
    create: {
      userId,
      type: type as any,
      date: today,
      count,
    },
  });

  logger.debug(`Dhikr ${type} incremented by ${count} for user ${userId}`);
  return entry;
}

/**
 * Get today's dhikr counts
 */
export async function getTodayDhikr(userId: string): Promise<DailyDhikr> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const entries = await prisma.dhikrEntry.findMany({
    where: {
      userId,
      date: today,
    },
  });

  const totalCount = entries.reduce((sum, e) => sum + e.count, 0);

  const byType: DhikrCount[] = DHIKR_TYPES.map(({ type, label, target }) => {
    const entry = entries.find(e => e.type === type);
    return {
      type,
      label,
      count: entry?.count || 0,
      target,
    };
  });

  return {
    date: today.toISOString().split('T')[0],
    totalCount,
    byType,
  };
}

/**
 * Get dhikr history
 */
export async function getHistory(
  userId: string,
  days: number = 7
): Promise<DailyDhikr[]> {
  const endDate = new Date();
  endDate.setHours(0, 0, 0, 0);
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - (days - 1));

  const entries = await prisma.dhikrEntry.findMany({
    where: {
      userId,
      date: { gte: startDate, lte: endDate },
    },
    orderBy: { date: 'desc' },
  });

  const result: DailyDhikr[] = [];

  for (let i = 0; i < days; i++) {
    const date = new Date(endDate);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const dayEntries = entries.filter(e => e.date.getTime() === date.getTime());
    const totalCount = dayEntries.reduce((sum, e) => sum + e.count, 0);

    const byType: DhikrCount[] = DHIKR_TYPES.map(({ type, label, target }) => {
      const entry = dayEntries.find(e => e.type === type);
      return {
        type,
        label,
        count: entry?.count || 0,
        target,
      };
    });

    result.push({
      date: date.toISOString().split('T')[0],
      totalCount,
      byType,
    });
  }

  return result;
}

export default {
  incrementCount,
  getTodayDhikr,
  getHistory,
};
