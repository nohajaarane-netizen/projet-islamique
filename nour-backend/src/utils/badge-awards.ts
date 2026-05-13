/**
 * Badge Award System
 * Automatically awards badges based on user achievements
 */

import { logger } from './logger.js';

export type BadgeType = 'LEVE_TOT' | 'ASSIDU' | 'PERSEVERANT' | 'SABIR' | 'MOUMIN' | 'HAFIZ' | 'MUJAHID';

export interface BadgeCriteria {
  type: BadgeType;
  label: string;
  description: string;
  descriptionEn?: string;  // Optional English description
  descriptionAr?: string;  // Optional Arabic description
  icon: string;
  requirement: string;
  check: (stats: UserStats) => boolean;
}

export interface UserStats {
  prayerStreak: number;
  fajrStreak: number;
  gratitudeStreak: number;
  dhikrStreak: number;
  namesLearned: number;
  totalPrayersCompleted: number;
  totalGratitudeEntries: number;
  totalDhikrCount: number;
}

/**
 * Badge definitions with criteria
 */
export const BADGE_DEFINITIONS: BadgeCriteria[] = [
  {
    type: 'LEVE_TOT',
    label: 'Lève-tôt',
    description: '7 jours de Fajr consécutifs',
    descriptionEn: '7 consecutive Fajr prayers',
    descriptionAr: '7 صلوات فجر متتالية',
    icon: '🌅',
    requirement: 'fajrStreak >= 7',
    check: (stats) => stats.fajrStreak >= 7,
  },
  {
    type: 'ASSIDU',
    label: 'Assidu',
    description: '10 jours de prières complètes consécutifs',
    descriptionEn: '10 consecutive days of complete prayers',
    descriptionAr: '10 أيام صلاة كاملة متتالية',
    icon: '⭐',
    requirement: 'prayerStreak >= 10',
    check: (stats) => stats.prayerStreak >= 10,
  },
  {
    type: 'PERSEVERANT',
    label: 'Persévérant',
    description: '14 jours de prières complètes consécutifs',
    descriptionEn: '14 consecutive days of complete prayers',
    descriptionAr: '14 يوم صلاة كاملة متتالية',
    icon: '🏆',
    requirement: 'prayerStreak >= 14',
    check: (stats) => stats.prayerStreak >= 14,
  },
  {
    type: 'SABIR',
    label: 'Sâbir',
    description: '30 jours de gratitude consécutifs',
    descriptionEn: '30 consecutive days of gratitude',
    descriptionAr: '30 يوم امتنان متتالي',
    icon: '🌿',
    requirement: 'gratitudeStreak >= 30',
    check: (stats) => stats.gratitudeStreak >= 30,
  },
  {
    type: 'MOUMIN',
    label: 'Moumin',
    description: '50 prières complétées',
    descriptionEn: '50 prayers completed',
    descriptionAr: '50 صلاة مكتملة',
    icon: '📖',
    requirement: 'totalPrayersCompleted >= 50',
    check: (stats) => stats.totalPrayersCompleted >= 50,
  },
  {
    type: 'HAFIZ',
    label: 'Hafiz',
    description: '99 Noms d\'Allah appris',
    descriptionEn: 'All 99 Names of Allah learned',
    descriptionAr: '99 اسمًا من أسماء الله محفوظة',
    icon: '✨',
    requirement: 'namesLearned >= 99',
    check: (stats) => stats.namesLearned >= 99,
  },
  {
    type: 'MUJAHID',
    label: 'Mujahid',
    description: '1000 Dhikr complétés',
    descriptionEn: '1000 dhikr completed',
    descriptionAr: '1000 ذكر مكتمل',
    icon: '💪',
    requirement: 'totalDhikrCount >= 1000',
    check: (stats) => stats.totalDhikrCount >= 1000,
  },
];

/**
 * Check which badges a user qualifies for
 * @param stats - User statistics
 * @param existingBadges - Badges user already has
 * @returns Array of new badges to award
 */
export function checkNewBadges(
  stats: UserStats,
  existingBadges: BadgeType[]
): BadgeCriteria[] {
  const newBadges: BadgeCriteria[] = [];

  for (const badge of BADGE_DEFINITIONS) {
    if (!existingBadges.includes(badge.type) && badge.check(stats)) {
      newBadges.push(badge);
      if (logger && logger.info) {
        logger.info(`Badge qualified: ${badge.type} - ${badge.label}`);
      }
    }
  }

  return newBadges;
}

/**
 * Get badge details by type
 */
export function getBadgeDetails(type: BadgeType): BadgeCriteria | undefined {
  return BADGE_DEFINITIONS.find(b => b.type === type);
}

/**
 * Get all badge definitions
 */
export function getAllBadgeDefinitions(): BadgeCriteria[] {
  return BADGE_DEFINITIONS;
}

/**
 * Format badge for response
 */
export function formatBadge(badge: BadgeCriteria, language: string = 'fr') {
  const descriptions: Record<string, string> = {
    fr: badge.description,
    en: badge.descriptionEn || badge.description,
    ar: badge.descriptionAr || badge.description,
  };

  return {
    type: badge.type,
    label: badge.label,
    description: descriptions[language] || descriptions.fr,
    icon: badge.icon,
    requirement: badge.requirement,
  };
}

/**
 * Calculate Fajr streak from prayer tracking data
 * @param dailyPrayers - Array of daily prayer records
 * @returns Number of consecutive Fajr completions
 */
export function calculateFajrStreak(
  dailyPrayers: { date: Date; fajrCompleted: boolean }[]
): number {
  if (dailyPrayers.length === 0) return 0;

  // Sort by date descending (most recent first)
  const sorted = [...dailyPrayers].sort((a, b) => b.date.getTime() - a.date.getTime());

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check each day from most recent backwards
  for (let i = 0; i < sorted.length; i++) {
    const day = sorted[i];
    const dayDate = new Date(day.date);
    dayDate.setHours(0, 0, 0, 0);
    
    // Calculate days difference from today
    const diffDays = Math.floor((today.getTime() - dayDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // If this is the next consecutive day and prayer is completed
    if (diffDays === streak && day.fajrCompleted) {
      streak++;
    } 
    // If this day should be part of the current streak but missing, break
    else if (diffDays === streak && !day.fajrCompleted) {
      break;
    }
    // If we've found a gap in the streak, stop
    else if (diffDays > streak) {
      break;
    }
  }

  return streak;
}

/**
 * Calculate prayer streak from daily prayer records
 * @param dailyPrayers - Array of daily prayer records with all prayers
 * @returns Number of consecutive days with all prayers completed
 */
export function calculatePrayerStreak(
  dailyPrayers: { date: Date; allPrayersCompleted: boolean }[]
): number {
  if (dailyPrayers.length === 0) return 0;

  const sorted = [...dailyPrayers].sort((a, b) => b.date.getTime() - a.date.getTime());
  
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < sorted.length; i++) {
    const day = sorted[i];
    const dayDate = new Date(day.date);
    dayDate.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((today.getTime() - dayDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === streak && day.allPrayersCompleted) {
      streak++;
    } else if (diffDays === streak && !day.allPrayersCompleted) {
      break;
    } else if (diffDays > streak) {
      break;
    }
  }

  return streak;
}

// Supprimer l'export incorrect de SupportedLanguage qui n'existe pas
// Supprimer les exports dupliqués à la fin

export default {
  BADGE_DEFINITIONS,
  checkNewBadges,
  getBadgeDetails,
  getAllBadgeDefinitions,
  formatBadge,
  calculateFajrStreak,
  calculatePrayerStreak,
};