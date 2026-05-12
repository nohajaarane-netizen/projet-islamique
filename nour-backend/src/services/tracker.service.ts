/**
 * Salat Tracker Service
 * Prayer tracking, streaks, constancy, heatmap, sunnah progress
 */

import { prisma } from '../config/database';
import { logger } from '../utils/logger';
import { ApiError } from '../middleware/error-handler';
import { calculatePrayerStreak, calculateFajrStreak } from '../utils/streak-engine';
import { checkNewBadges, getBadgeDetails } from '../utils/badge-awards';
import {
  TodayTracking,
  StreakInfo,
  ConstancyData,
  HeatmapDay,
  SunnahProgress,
  BadgeInfo,
} from '../types';

const PRAYER_ORDER = ['FAJR', 'DHUHR', 'ASR', 'MAGHRIB', 'ISHA'];

/**
 * Get today's prayer tracking status
 */
export async function getTodayTracking(userId: string): Promise<TodayTracking> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const trackings = await prisma.prayerTracking.findMany({
    where: {
      userId,
      date: today,
      prayerType: { in: PRAYER_ORDER },
    },
    orderBy: { prayerType: 'asc' },
  });

  // Build complete list with defaults
  const prayers = PRAYER_ORDER.map(type => {
    const tracking = trackings.find(t => t.prayerType === type);
    return {
      id: tracking?.id || `${userId}-${type}-${today.toISOString()}`,
      prayerType: type,
      time: getPrayerTime(type),
      status: (tracking?.status || 'PENDING') as 'PENDING' | 'COMPLETED' | 'MISSED',
      completedAt: tracking?.completedAt || undefined,
    };
  });

  const completedCount = prayers.filter(p => p.status === 'COMPLETED').length;

  return {
    date: today.toISOString().split('T')[0],
    prayers,
    completedCount,
    totalCount: PRAYER_ORDER.length,
  };
}

/**
 * Mark prayer status
 */
export async function markPrayer(
  userId: string,
  prayerType: string,
  status: 'COMPLETED' | 'MISSED' | 'PENDING'
) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const updated = await prisma.prayerTracking.upsert({
    where: {
      userId_prayerType_date: {
        userId,
        prayerType: prayerType as any,
        date: today,
      },
    },
    update: {
      status: status as any,
      completedAt: status === 'COMPLETED' ? new Date() : null,
    },
    create: {
      userId,
      prayerType: prayerType as any,
      date: today,
      status: status as any,
      completedAt: status === 'COMPLETED' ? new Date() : null,
    },
  });

  // Update streaks
  await updatePrayerStreak(userId);

  // Check for badges
  await checkAndAwardBadges(userId);

  logger.info(`Prayer ${prayerType} marked ${status} for user ${userId}`);

  return updated;
}

/**
 * Get streak information
 */
export async function getStreaks(userId: string): Promise<StreakInfo[]> {
  const streaks = await prisma.userStreak.findMany({
    where: { userId },
  });

  return streaks.map(s => ({
    currentStreak: s.currentStreak,
    bestRecord: s.bestRecord,
    streakType: s.streakType,
  }));
}

/**
 * Get 7-day constancy chart data
 */
export async function getConstancy(userId: string, days: number = 7): Promise<ConstancyData[]> {
  const endDate = new Date();
  endDate.setHours(0, 0, 0, 0);
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - (days - 1));

  const trackings = await prisma.prayerTracking.groupBy({
    by: ['date', 'status'],
    where: {
      userId,
      date: { gte: startDate, lte: endDate },
      prayerType: { in: PRAYER_ORDER },
    },
    _count: {
      status: true,
    },
  });

  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const result: ConstancyData[] = [];

  for (let i = 0; i < days; i++) {
    const date = new Date(endDate);
    date.setDate(date.getDate() - (days - 1 - i));
    date.setHours(0, 0, 0, 0);

    const dayTrackings = trackings.filter(t => t.date.getTime() === date.getTime());
    const completed = dayTrackings.find(t => t.status === 'COMPLETED')?._count.status || 0;
    const total = PRAYER_ORDER.length;

    result.push({
      day: dayNames[date.getDay()],
      date: date.toISOString().split('T')[0],
      percentage: Math.round((completed / total) * 100),
      completed,
      total,
    });
  }

  return result;
}

/**
 * Get monthly heatmap data
 */
export async function getMonthlyHeatmap(
  userId: string,
  year: number,
  month: number
): Promise<HeatmapDay[]> {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  const trackings = await prisma.prayerTracking.findMany({
    where: {
      userId,
      date: { gte: startDate, lte: endDate },
      prayerType: { in: PRAYER_ORDER },
    },
  });

  const daysInMonth = endDate.getDate();
  const result: HeatmapDay[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    date.setHours(0, 0, 0, 0);

    const dayTrackings = trackings.filter(t => t.date.getTime() === date.getTime());
    const completed = dayTrackings.filter(t => t.status === 'COMPLETED').length;
    const percentage = (completed / PRAYER_ORDER.length) * 100;

    let score: HeatmapDay['score'];
    if (percentage >= 100) score = 'Excellent';
    else if (percentage >= 80) score = 'Bonne';
    else if (percentage >= 60) score = 'Moyenne';
    else if (percentage >= 40) score = 'Faible';
    else score = 'Aucune';

    result.push({
      date: date.toISOString().split('T')[0],
      day,
      score,
      percentage: Math.round(percentage),
    });
  }

  return result;
}

/**
 * Get Sunnah prayer progress
 */
export async function getSunnahProgress(userId: string): Promise<SunnahProgress[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const sunnahTrackings = await prisma.prayerTracking.findMany({
    where: {
      userId,
      date: { gte: weekAgo, lte: today },
      prayerType: { in: ['TAHAJJUD', 'DUHA', 'WITR'] },
    },
  });

  const sunnahData = [
    { type: 'TAHAJJUD', label: 'Tahajjud', target: 7 },
    { type: 'DUHA', label: 'Duha', target: 7 },
    { type: 'WITR', label: 'Witr', target: 7 },
  ];

  return sunnahData.map(({ type, label, target }) => {
    const completed = sunnahTrackings.filter(
      t => t.prayerType === type && t.status === 'COMPLETED'
    ).length;

    return {
      type,
      label,
      current: completed,
      target,
      percentage: Math.round((completed / target) * 100),
    };
  });
}

/**
 * Get user badges
 */
export async function getBadges(userId: string): Promise<BadgeInfo[]> {
  const badges = await prisma.badge.findMany({
    where: { userId },
    orderBy: { earnedAt: 'desc' },
  });

  return badges.map(b => {
    const details = getBadgeDetails(b.badgeType as any);
    return {
      id: b.id,
      badgeType: b.badgeType,
      label: details?.label || b.badgeType,
      description: details?.description || '',
      earnedAt: b.earnedAt,
      icon: details?.icon || '🏆',
    };
  });
}

// ==================== PRIVATE HELPERS ====================

/**
 * Update prayer streak
 */
async function updatePrayerStreak(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get last 30 days of tracking
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const trackings = await prisma.prayerTracking.findMany({
    where: {
      userId,
      date: { gte: thirtyDaysAgo, lte: today },
      prayerType: { in: PRAYER_ORDER },
    },
    orderBy: [{ date: 'desc' }, { prayerType: 'asc' }],
  });

  // Group by date
  const dailyMap = new Map<string, { completed: number; total: number }>();

  for (const t of trackings) {
    const dateStr = t.date.toISOString().split('T')[0];
    if (!dailyMap.has(dateStr)) {
      dailyMap.set(dateStr, { completed: 0, total: 0 });
    }
    const day = dailyMap.get(dateStr)!;
    day.total++;
    if (t.status === 'COMPLETED') day.completed++;
  }

  const dailyCompletions = Array.from(dailyMap.entries()).map(([date, data]) => ({
    date: new Date(date),
    completedCount: data.completed,
    totalCount: data.total,
  }));

  const streakResult = calculatePrayerStreak(dailyCompletions);

  // Update streak in database
  await prisma.userStreak.upsert({
    where: {
      userId_streakType: {
        userId,
        streakType: 'PRAYER',
      },
    },
    update: {
      currentStreak: streakResult.currentStreak,
      bestRecord: streakResult.bestRecord,
      lastActivityDate: streakResult.lastActivityDate,
    },
    create: {
      userId,
      streakType: 'PRAYER',
      currentStreak: streakResult.currentStreak,
      bestRecord: streakResult.bestRecord,
      lastActivityDate: streakResult.lastActivityDate,
    },
  });
}

/**
 * Check and award badges
 */
async function checkAndAwardBadges(userId: string) {
  // Get user stats
  const [prayerStreak, gratitudeStreak, dhikrStreak, fajrTrackings, namesLearned, totalPrayers, totalGratitude, totalDhikr] = await Promise.all([
    prisma.userStreak.findUnique({ where: { userId_streakType: { userId, streakType: 'PRAYER' } } }),
    prisma.userStreak.findUnique({ where: { userId_streakType: { userId, streakType: 'GRATITUDE' } } }),
    prisma.userStreak.findUnique({ where: { userId_streakType: { userId, streakType: 'DHIKR' } } }),
    prisma.prayerTracking.findMany({ where: { userId, prayerType: 'FAJR', status: 'COMPLETED' } }),
    prisma.userNameProgress.count({ where: { userId, isLearned: true } }),
    prisma.prayerTracking.count({ where: { userId, status: 'COMPLETED' } }),
    prisma.gratitudeEntry.count({ where: { userId } }),
    prisma.dhikrEntry.aggregate({ where: { userId }, _sum: { count: true } }),
  ]);

  const existingBadges = await prisma.badge.findMany({
    where: { userId },
    select: { badgeType: true },
  });
  const existingBadgeTypes = existingBadges.map(b => b.badgeType);

  const stats = {
    prayerStreak: prayerStreak?.currentStreak || 0,
    fajrStreak: calculateFajrStreak(
      fajrTrackings.map(t => ({ date: t.date, fajrCompleted: t.status === 'COMPLETED' }))
    ),
    gratitudeStreak: gratitudeStreak?.currentStreak || 0,
    dhikrStreak: dhikrStreak?.currentStreak || 0,
    namesLearned,
    totalPrayersCompleted: totalPrayers,
    totalGratitudeEntries: totalGratitude,
    totalDhikrCount: totalDhikr._sum.count || 0,
  };

  const newBadges = checkNewBadges(stats, existingBadgeTypes);

  for (const badge of newBadges) {
    await prisma.badge.create({
      data: {
        userId,
        badgeType: badge.type,
        criteria: badge.requirement,
      },
    });
    logger.info(`Badge awarded: ${badge.type} to user ${userId}`);
  }
}

/**
 * Get prayer time string (placeholder - would come from prayer-time service)
 */
function getPrayerTime(prayerType: string): string {
  const times: Record<string, string> = {
    FAJR: '05:15',
    DHUHR: '12:45',
    ASR: '16:30',
    MAGHRIB: '19:35',
    ISHA: '20:55',
  };
  return times[prayerType] || '00:00';
}

export default {
  getTodayTracking,
  markPrayer,
  getStreaks,
  getConstancy,
  getMonthlyHeatmap,
  getSunnahProgress,
  getBadges,
};
