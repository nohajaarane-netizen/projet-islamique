
import { checkNewBadges, UserStats, BadgeType, formatBadge } from '../utils/badge-awards.js';
import { logger } from '../utils/logger.js';
import { prisma } from '../config/prisma.js';


export class BadgeService {
  /**
   * Get user statistics for badge calculation
   */
  async getUserStats(userId: string): Promise<UserStats> {
    // Get prayer streak
    const prayerTrackings = await prisma.prayerTracking.findMany({
      where: { userId },
      orderBy: { date: 'desc' }
    });

    // Get gratitude entries
    const gratitudeEntries = await prisma.gratitudeEntry.findMany({
      where: { userId }
    });

    // Get dhikr entries
    const dhikrEntries = await prisma.dhikrEntry.findMany({
      where: { userId }
    });

    // Get learned names
    const learnedNames = await prisma.userNameProgress.findMany({
      where: { 
        userId,
        isLearned: true 
      }
    });

    // Calculate streaks
    const prayerStreak = this.calculatePrayerStreak(prayerTrackings);
    const fajrStreak = this.calculateFajrStreak(prayerTrackings);
    const gratitudeStreak = this.calculateGratitudeStreak(gratitudeEntries);
    const dhikrStreak = this.calculateDhikrStreak(dhikrEntries);

    // Count total prayers completed
    const totalPrayersCompleted = prayerTrackings.filter(p => p.status === 'COMPLETED').length;
    
    // Count total gratitude entries
    const totalGratitudeEntries = gratitudeEntries.length;
    
    // Count total dhikr
    const totalDhikrCount = dhikrEntries.reduce((sum, entry) => sum + entry.count, 0);

    return {
      prayerStreak,
      fajrStreak,
      gratitudeStreak,
      dhikrStreak,
      namesLearned: learnedNames.length,
      totalPrayersCompleted,
      totalGratitudeEntries,
      totalDhikrCount
    };
  }

  /**
   * Check and award new badges
   */
  async checkAndAwardBadges(userId: string): Promise<any[]> {
    // Get current user stats
    const stats = await this.getUserStats(userId);
    
    // Get existing badges
    const existingBadges = await prisma.badge.findMany({
      where: { userId },
      select: { badgeType: true }
    });
    
    const existingBadgeTypes = existingBadges.map(b => b.badgeType as BadgeType);
    
    // Check for new badges
    const newBadges = checkNewBadges(stats, existingBadgeTypes);
    
    // Award new badges
    const awardedBadges = [];
    for (const badge of newBadges) {
      const awarded = await prisma.badge.create({
        data: {
          userId,
          badgeType: badge.type,
          criteria: badge.requirement
        }
      });
      awardedBadges.push(formatBadge(badge, 'fr'));
      logger.info(`Badge awarded to user ${userId}: ${badge.type}`);
    }
    
    return awardedBadges;
  }

  /**
   * Get user's badges
   */
  async getUserBadges(userId: string, language: string = 'fr') {
    const badges = await prisma.badge.findMany({
      where: { userId },
      orderBy: { earnedAt: 'desc' }
    });
    
    // Dynamic import for badge utils
    const { getBadgeDetails, formatBadge } = await import('../utils/badge-awards.js');
    
    return badges.map(badge => {
      const details = getBadgeDetails(badge.badgeType as BadgeType);
      return details ? formatBadge(details, language) : badge;
    });
  }

  private calculatePrayerStreak(trackings: any[]): number {
    // Get unique dates with all prayers completed
    const dates = new Map();
    trackings.forEach(t => {
      const dateStr = t.date.toISOString().split('T')[0];
      if (!dates.has(dateStr)) {
        dates.set(dateStr, { total: 0, completed: 0 });
      }
      if (t.status === 'COMPLETED') {
        dates.get(dateStr).completed++;
      }
      dates.get(dateStr).total++;
    });
    
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const day = dates.get(dateStr);
      if (day && day.completed === 5) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }

  private calculateFajrStreak(trackings: any[]): number {
    const fajrTrackings = trackings.filter(t => t.prayerType === 'FAJR');
    let streak = 0;
    
    for (let i = 0; i < fajrTrackings.length; i++) {
      if (fajrTrackings[i].status === 'COMPLETED') {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }

  private calculateGratitudeStreak(entries: any[]): number {
    const uniqueDates = new Set();
    entries.forEach(e => {
      uniqueDates.add(e.createdAt.toISOString().split('T')[0]);
    });
    
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      if (uniqueDates.has(dateStr)) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }

  private calculateDhikrStreak(entries: any[]): number {
    const uniqueDates = new Set();
    entries.forEach(e => {
      if (e.count > 0) {
        uniqueDates.add(e.date.toISOString().split('T')[0]);
      }
    });
    
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      if (uniqueDates.has(dateStr)) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }
}