/**
 * AsmaUlHusna Service
 * Manages the 99 Names of Allah with learning progress
 */

import { prisma } from '../config/prisma.js';
import { logger } from '../utils/logger.js';

// Custom error class
class ApiError extends Error {
  constructor(message: string, public statusCode: number, public code: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Types
export interface NameOfAllahDTO {
  id: string;  // Changé de number à string
  orderNumber: number;
  arabic: string;
  transliteration: string;
  meaning: string;
  audioUrl?: string;
  isLearned: boolean;
  isFavorite: boolean;
}

export interface NameDetailDTO {
  id: string;  // Changé de number à string
  orderNumber: number;
  arabic: string;
  transliteration: string;
  meaning: string;
  audioUrl?: string;
  isLearned: boolean;
  isFavorite: boolean;
  reflection: string;
}

export interface AsmaProgress {
  total: number;
  learned: number;
  toLearn: number;
  favorites: number;
  percentage: number;
}

/**
 * Get paginated names with user progress
 */
export async function getNames(
  userId: string,
  page: number = 1,
  limit: number = 12,
  filter: 'all' | 'learned' | 'unlearned' | 'favorites' = 'all',
  search?: string
): Promise<{ names: NameOfAllahDTO[]; total: number }> {
  const skip = (page - 1) * limit;

  // Build where clause
  let where: any = {};

  if (search) {
    where = {
      OR: [
        { arabic: { contains: search } },
        { transliteration: { contains: search, mode: 'insensitive' } },
        { frenchMeaning: { contains: search, mode: 'insensitive' } },
      ],
    };
  }

  // Get all names with user progress
  const names = await prisma.nameOfAllah.findMany({
    where,
    orderBy: { orderNumber: 'asc' },
    skip,
    take: limit,
    include: {
      userProgress: {
        where: { userId },
        select: { isLearned: true, isFavorite: true },
      },
    },
  });

  const total = await prisma.nameOfAllah.count({ where });

  // Filter based on user progress
  let filteredNames = names;
  if (filter === 'learned') {
    filteredNames = names.filter(n => n.userProgress[0]?.isLearned);
  } else if (filter === 'unlearned') {
    filteredNames = names.filter(n => !n.userProgress[0]?.isLearned);
  } else if (filter === 'favorites') {
    filteredNames = names.filter(n => n.userProgress[0]?.isFavorite);
  }

  const dtos: NameOfAllahDTO[] = filteredNames.map(n => ({
    id: n.id,  // String, pas number
    orderNumber: n.orderNumber,
    arabic: n.arabic,
    transliteration: n.transliteration,
    meaning: n.frenchMeaning,
    audioUrl: n.audioUrl || undefined,
    isLearned: n.userProgress[0]?.isLearned || false,
    isFavorite: n.userProgress[0]?.isFavorite || false,
  }));

  return { names: dtos, total: filter === 'all' ? total : dtos.length };
}

/**
 * Get single name detail
 */
export async function getNameDetail(userId: string, nameId: string): Promise<NameDetailDTO> {  // nameId est string
  const name = await prisma.nameOfAllah.findUnique({
    where: { id: nameId },  // String, pas number
    include: {
      userProgress: {
        where: { userId },
        select: { isLearned: true, isFavorite: true },
      },
    },
  });

  if (!name) {
    throw new ApiError('Nom non trouvé', 404, 'NAME_NOT_FOUND');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { preferredLang: true },
  });

  const lang = user?.preferredLang || 'fr';
  const reflections: Record<string, string> = {
    fr: name.reflectionFr,
    en: name.reflectionEn,
    ar: name.reflectionAr,
  };

  return {
    id: name.id,
    orderNumber: name.orderNumber,
    arabic: name.arabic,
    transliteration: name.transliteration,
    meaning: lang === 'en' ? name.englishMeaning : name.frenchMeaning,
    audioUrl: name.audioUrl || undefined,
    isLearned: name.userProgress[0]?.isLearned || false,
    isFavorite: name.userProgress[0]?.isFavorite || false,
    reflection: reflections[lang] || name.reflectionFr,
  };
}

/**
 * Mark name as learned
 */
export async function markLearned(userId: string, nameId: string, learned: boolean) {  // nameId est string
  const progress = await prisma.userNameProgress.upsert({
    where: {
      userId_nameId: {
        userId,
        nameId,  // String
      },
    },
    update: {
      isLearned: learned,
      learnedAt: learned ? new Date() : null,
    },
    create: {
      userId,
      nameId,
      isLearned: learned,
      learnedAt: learned ? new Date() : null,
    },
  });

  logger.info(`Name ${nameId} marked ${learned ? 'learned' : 'unlearned'} for user ${userId}`);
  return progress;
}

/**
 * Toggle favorite
 */
export async function toggleFavorite(userId: string, nameId: string) {  // nameId est string
  const existing = await prisma.userNameProgress.findUnique({
    where: {
      userId_nameId: {
        userId,
        nameId,
      },
    },
  });

  const newFavorite = !existing?.isFavorite;

  const progress = await prisma.userNameProgress.upsert({
    where: {
      userId_nameId: {
        userId,
        nameId,
      },
    },
    update: {
      isFavorite: newFavorite,
    },
    create: {
      userId,
      nameId,
      isFavorite: newFavorite,
    },
  });

  return { isFavorite: newFavorite, progress };
}

/**
 * Get user progress statistics
 */
export async function getProgress(userId: string): Promise<AsmaProgress> {
  const [total, learned, favorites] = await Promise.all([
    prisma.nameOfAllah.count(),
    prisma.userNameProgress.count({ where: { userId, isLearned: true } }),
    prisma.userNameProgress.count({ where: { userId, isFavorite: true } }),
  ]);

  return {
    total,
    learned,
    toLearn: total - learned,
    favorites,
    percentage: Math.round((learned / total) * 100),
  };
}

/**
 * Get daily featured name
 */
export async function getDailyName(userId: string): Promise<NameDetailDTO | null> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if we have a daily content set
  const dailyContent = await prisma.dailyContent.findUnique({
    where: { date: today },
  });

  let nameId: string;  // Changé de number à string

  if (dailyContent?.nameId) {
    nameId = dailyContent.nameId;
  } else {
    // Pick a random unlearned name, or fallback to random
    const unlearned = await prisma.nameOfAllah.findMany({
      where: {
        userProgress: {
          none: {
            userId,
            isLearned: true,
          },
        },
      },
      orderBy: { orderNumber: 'asc' },
      take: 1,
    });

    if (unlearned.length > 0) {
      nameId = unlearned[0].id;
    } else {
      // All learned, pick random
      const allNames = await prisma.nameOfAllah.findMany({
        orderBy: { orderNumber: 'asc' },
      });
      nameId = allNames[Math.floor(Math.random() * allNames.length)].id;
    }

    // Save to daily content
    await prisma.dailyContent.upsert({
      where: { date: today },
      update: { nameId },
      create: { date: today, nameId },
    });
  }

  return getNameDetail(userId, nameId);
}

export default {
  getNames,
  getNameDetail,
  markLearned,
  toggleFavorite,
  getProgress,
  getDailyName,
};