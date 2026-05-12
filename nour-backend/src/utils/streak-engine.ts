/**
 * Streak Calculation Engine
 * Calculates consecutive day streaks for prayers, gratitude, and dhikr
 */

import { logger } from './logger';

export interface StreakResult {
  currentStreak: number;
  bestRecord: number;
  lastActivityDate: Date | null;
  isActiveToday: boolean;
}

/**
 * Calculate prayer streak
 * A streak is maintained when ALL 5 daily prayers (Fajr, Dhuhr, Asr, Maghrib, Isha) are completed
 * @param dailyCompletions - Array of daily completion records
 * @returns Streak information
 */
export function calculatePrayerStreak(
  dailyCompletions: { date: Date; completedCount: number; totalCount: number }[]
): StreakResult {
  if (dailyCompletions.length === 0) {
    return { currentStreak: 0, bestRecord: 0, lastActivityDate: null, isActiveToday: false };
  }

  // Sort by date descending (most recent first)
  const sorted = [...dailyCompletions].sort((a, b) => b.date.getTime() - a.date.getTime());

  let currentStreak = 0;
  let bestRecord = 0;
  let tempStreak = 0;
  let lastActivityDate: Date | null = null;
  let isActiveToday = false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if streak is active today
  const todayRecord = sorted.find(r => {
    const rDate = new Date(r.date);
    rDate.setHours(0, 0, 0, 0);
    return rDate.getTime() === today.getTime();
  });

  if (todayRecord && todayRecord.completedCount === todayRecord.totalCount && todayRecord.totalCount > 0) {
    isActiveToday = true;
    lastActivityDate = today;
  }

  // Calculate consecutive days from today backwards
  let expectedDate = today;
  let streakCount = 0;
  
  for (const record of sorted) {
    const recordDate = new Date(record.date);
    recordDate.setHours(0, 0, 0, 0);
    
    const isComplete = record.completedCount === record.totalCount && record.totalCount > 0;
    
    // Calculate days difference from expected date
    const diffDays = Math.floor((expectedDate.getTime() - recordDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0 && isComplete) {
      // Same day, count it
      streakCount++;
      if (streakCount > bestRecord) bestRecord = streakCount;
    } 
    else if (diffDays === 1 && isComplete) {
      // Next consecutive day
      streakCount++;
      if (streakCount > bestRecord) bestRecord = streakCount;
      expectedDate = recordDate;
    }
    else if (diffDays > 1) {
      // Gap found, stop counting
      break;
    }
    else if (diffDays === 0 && !isComplete) {
      // Today not completed, streak is 0
      streakCount = 0;
      break;
    }
    else if (diffDays === 1 && !isComplete) {
      // Yesterday missing, break streak
      break;
    }
  }
  
  currentStreak = streakCount;

  logger.debug(`Prayer streak calculated: current=${currentStreak}, best=${bestRecord}`);

  return {
    currentStreak: isActiveToday ? currentStreak : 0,
    bestRecord,
    lastActivityDate,
    isActiveToday,
  };
}

/**
 * Calculate gratitude streak
 * A streak is maintained when at least one gratitude entry is made per day
 * @param entries - Array of gratitude entry dates
 * @returns Streak information
 */
export function calculateGratitudeStreak(entries: { createdAt: Date }[]): StreakResult {
  if (entries.length === 0) {
    return { currentStreak: 0, bestRecord: 0, lastActivityDate: null, isActiveToday: false };
  }

  // Extract unique dates
  const dateSet = new Set<string>();
  entries.forEach(entry => {
    const dateStr = entry.createdAt.toISOString().split('T')[0];
    dateSet.add(dateStr);
  });

  const uniqueDates = Array.from(dateSet)
    .map(d => new Date(d))
    .sort((a, b) => b.getTime() - a.getTime());

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayStr = today.toISOString().split('T')[0];
  const isActiveToday = dateSet.has(todayStr);

  let currentStreak = 0;
  let bestRecord = 0;
  let tempStreak = 0;
  let lastActivityDate: Date | null = uniqueDates[0] || null;

  // Calculate streak from most recent backwards
  for (let i = 0; i < uniqueDates.length; i++) {
    const current = new Date(uniqueDates[i]);
    current.setHours(0, 0, 0, 0);
    
    if (i === 0) {
      tempStreak = 1;
      continue;
    }
    
    const previous = new Date(uniqueDates[i - 1]);
    previous.setHours(0, 0, 0, 0);
    
    const diffDays = (previous.getTime() - current.getTime()) / (1000 * 60 * 60 * 24);
    
    if (diffDays === 1) {
      tempStreak++;
      if (tempStreak > bestRecord) bestRecord = tempStreak;
    } else {
      // Break in streak
      if (currentStreak === 0) {
        currentStreak = tempStreak;
      }
      tempStreak = 1;
    }
  }
  
  if (currentStreak === 0) {
    currentStreak = tempStreak;
  }
  if (tempStreak > bestRecord) {
    bestRecord = tempStreak;
  }

  logger.debug(`Gratitude streak calculated: current=${currentStreak}, best=${bestRecord}`);

  return {
    currentStreak: isActiveToday ? currentStreak : 0,
    bestRecord,
    lastActivityDate,
    isActiveToday,
  };
}

/**
 * Calculate dhikr streak
 * A streak is maintained when any dhikr count > 0 per day
 * @param entries - Array of dhikr entry dates
 * @returns Streak information
 */
export function calculateDhikrStreak(entries: { date: Date; count: number }[]): StreakResult {
  const activeEntries = entries.filter(e => e.count > 0);
  
  // Convert to format expected by calculateGratitudeStreak
  const gratitudeEntries = activeEntries.map(e => ({ createdAt: e.date }));
  
  // Remove duplicates by date
  const uniqueDates = new Map<string, Date>();
  gratitudeEntries.forEach(entry => {
    const dateStr = entry.createdAt.toISOString().split('T')[0];
    if (!uniqueDates.has(dateStr)) {
      uniqueDates.set(dateStr, entry.createdAt);
    }
  });
  
  const uniqueEntries = Array.from(uniqueDates.values()).map(date => ({ createdAt: date }));
  
  const result = calculateGratitudeStreak(uniqueEntries);
  
  logger.debug(`Dhikr streak calculated: current=${result.currentStreak}, best=${result.bestRecord}`);
  
  return result;
}

/**
 * Check if streak should be broken
 * Called at midnight to check if user missed a day
 * @param lastActivityDate - Last recorded activity
 * @returns Boolean indicating if streak is broken
 */
export function isStreakBroken(lastActivityDate: Date | null): boolean {
  if (!lastActivityDate) return true;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const last = new Date(lastActivityDate);
  last.setHours(0, 0, 0, 0);

  const diffDays = (today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24);

  return diffDays > 1; // More than 1 day gap breaks streak
}

/**
 * Get streak status with human-readable message
 */
export function getStreakStatus(streak: StreakResult, language: string = 'fr'): {
  status: string;
  message: string;
  isActive: boolean;
} {
  const messages: Record<string, Record<string, string>> = {
    fr: {
      active: 'Série en cours ! 🔥',
      broken: 'Série interrompue',
      new: 'Commencez votre série aujourd\'hui',
      milestone: 'Nouveau record ! 🏆',
    },
    en: {
      active: 'Streak active! 🔥',
      broken: 'Streak broken',
      new: 'Start your streak today',
      milestone: 'New record! 🏆',
    },
    ar: {
      active: 'السلسلة مستمرة! 🔥',
      broken: 'انقطعت السلسلة',
      new: 'ابدأ سلسلتك اليوم',
      milestone: 'رقم قياسي جديد! 🏆',
    },
  };

  const msgs = messages[language] || messages.fr;

  if (streak.currentStreak === 0 && streak.bestRecord === 0) {
    return { status: 'new', message: msgs.new, isActive: false };
  }

  if (streak.currentStreak === 0 && streak.bestRecord > 0) {
    return { status: 'broken', message: msgs.broken, isActive: false };
  }

  if (streak.currentStreak > streak.bestRecord) {
    return { status: 'milestone', message: msgs.milestone, isActive: true };
  }

  return { status: 'active', message: msgs.active, isActive: true };
}

/**
 * Update streak based on new activity
 * @param currentStreak - Current streak object
 * @param wasActiveToday - Was the user active today?
 * @returns Updated streak information
 */
export function updateStreak(
  currentStreak: StreakResult,
  wasActiveToday: boolean
): StreakResult {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let newCurrentStreak = currentStreak.currentStreak;
  let newBestRecord = currentStreak.bestRecord;
  
  if (wasActiveToday && !currentStreak.isActiveToday) {
    // New activity today
    newCurrentStreak = currentStreak.currentStreak + 1;
    if (newCurrentStreak > newBestRecord) {
      newBestRecord = newCurrentStreak;
    }
  } else if (!wasActiveToday && currentStreak.lastActivityDate) {
    // Check if streak should be broken
    const lastDate = new Date(currentStreak.lastActivityDate);
    lastDate.setHours(0, 0, 0, 0);
    const diffDays = (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
    
    if (diffDays > 1) {
      newCurrentStreak = 0;
    }
  }
  
  return {
    currentStreak: newCurrentStreak,
    bestRecord: newBestRecord,
    lastActivityDate: wasActiveToday ? today : currentStreak.lastActivityDate,
    isActiveToday: wasActiveToday,
  };
}

export default {
  calculatePrayerStreak,
  calculateGratitudeStreak,
  calculateDhikrStreak,
  isStreakBroken,
  getStreakStatus,
  updateStreak,
};