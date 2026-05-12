/**
 * Gratitude (Alhamdulillah) Service
 * Manages gratitude journal entries and statistics
 */

import { prisma } from '../config/database';
import { logger } from '../utils/logger';
import { ApiError } from '../middleware/error-handler';
import { calculateGratitudeStreak } from '../utils/streak-engine';
import { GratitudeEntryDTO, GratitudeStats, GratitudeTheme } from '../types';

/**
 * Create gratitude entry
 */
export async function createEntry(
  userId: string,
  text: string,
  category: string
): Promise<GratitudeEntryDTO> {
  if (text.length > 300) {
    throw new ApiError('Texte trop long (max 300 caractères)', 400, 'TEXT_TOO_LONG');
  }

  const entry = await prisma.gratitudeEntry.create({
    data: {
      userId,
      text,
      category: category as any,
    },
  });

  // Update gratitude streak
  await updateGratitudeStreak(userId);

  logger.info(`Gratitude entry created for user ${userId}`);

  return {
    id: entry.id,
    text: entry.text,
    category: entry.category,
    createdAt: entry.createdAt,
  };
}

/**
 * Get recent gratitude entries
 */
export async function getRecentEntries(
  userId: string,
  limit: number = 10,
  offset: number = 0
): Promise<GratitudeEntryDTO[]> {
  const entries = await prisma.gratitudeEntry.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    skip: offset,
    take: limit,
  });

  return entries.map(e => ({
    id: e.id,
    text: e.text,
    category: e.category,
    createdAt: e.createdAt,
  }));
}

/**
 * Get gratitude statistics
 */
export async function getStats(userId: string): Promise<GratitudeStats> {
  const [totalEntries, streakData] = await Promise.all([
    prisma.gratitudeEntry.count({ where: { userId } }),
    prisma.gratitudeEntry.findMany({
      where: { userId },
      select: { createdAt: true },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const streakResult = calculateGratitudeStreak(streakData);

  return {
    totalEntries,
    currentStreak: streakResult.currentStreak,
    longestStreak: streakResult.bestRecord,
  };
}

/**
 * Get gratitude themes (word cloud data)
 */
export async function getThemes(userId: string): Promise<GratitudeTheme[]> {
  const categories = await prisma.gratitudeEntry.groupBy({
    by: ['category'],
    where: { userId },
    _count: {
      category: true,
    },
  });

  const total = categories.reduce((sum, c) => sum + c._count.category, 0);

  return categories.map(c => ({
    category: c.category,
    count: c._count.category,
    percentage: total > 0 ? Math.round((c._count.category / total) * 100) : 0,
  })).sort((a, b) => b.count - a.count);
}

/**
 * Get predefined categories
 */
export function getCategories(): string[] {
  return [
    'ALLAH', 'FAITH', 'FAMILY', 'HEALTH', 'SABR',
    'FRIENDS', 'FOOD', 'KNOWLEDGE', 'GUIDANCE', 'HOME',
    'TIME', 'WORK', 'NATURE', 'PEACE', 'FORGIVENESS',
  ];
}

/**
 * Update gratitude streak
 */
async function updateGratitudeStreak(userId: string) {
  const entries = await prisma.gratitudeEntry.findMany({
    where: { userId },
    select: { createdAt: true },
    orderBy: { createdAt: 'desc' },
  });

  const streakResult = calculateGratitudeStreak(entries);

  await prisma.userStreak.upsert({
    where: {
      userId_streakType: {
        userId,
        streakType: 'GRATITUDE',
      },
    },
    update: {
      currentStreak: streakResult.currentStreak,
      bestRecord: streakResult.bestRecord,
      lastActivityDate: streakResult.lastActivityDate,
    },
    create: {
      userId,
      streakType: 'GRATITUDE',
      currentStreak: streakResult.currentStreak,
      bestRecord: streakResult.bestRecord,
      lastActivityDate: streakResult.lastActivityDate,
    },
  });
}

export default {
  createEntry,
  getRecentEntries,
  getStats,
  getThemes,
  getCategories,
};
