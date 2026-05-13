/**
 * Hadith Service
 * Manages hadith collection with categories and daily features
 */

import { prisma } from '../config/database';
import { logger } from '../utils/logger';
import { ApiError } from '../middleware/error-handler';
import { HadithDTO } from '../types';

/**
 * Get hadiths with filtering
 */
export async function getHadiths(
  userId: string,
  category?: string,
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<{ hadiths: HadithDTO[]; total: number }> {
  const skip = (page - 1) * limit;

  let where: any = {};

  if (category && category !== 'Tous') {
    where.category = category;
  }

  if (search) {
    where.OR = [
      { arabicText: { contains: search } },
      { frenchTranslation: { contains: search, mode: 'insensitive' } },
      { sourceBook: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [hadiths, total] = await Promise.all([
    prisma.hadith.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        favorites: {
          where: { userId, contentType: 'HADITH' },
          select: { id: true },
        },
      },
    }),
    prisma.hadith.count({ where }),
  ]);

  const dtos: HadithDTO[] = hadiths.map(h => ({
    id: h.id,
    arabicText: h.arabicText,
    translation: h.frenchTranslation,
    transliteration: h.transliteration || undefined,
    sourceBook: h.sourceBook,
    sourceNumber: h.sourceNumber,
    category: h.category,
    audioUrl: h.audioUrl || undefined,
    isFavorite: h.favorites.length > 0,
  }));

  return { hadiths: dtos, total };
}

/**
 * Get daily featured hadith
 */
export async function getDailyHadith(userId: string): Promise<HadithDTO | null> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dailyContent = await prisma.dailyContent.findUnique({
    where: { date: today },
  });

  let hadithId: string | null = null;

  if (dailyContent?.hadithId) {
    hadithId = dailyContent.hadithId;
  } else {
    // Pick random hadith
    const count = await prisma.hadith.count();
    const skip = Math.floor(Math.random() * count);
    const randomHadith = await prisma.hadith.findFirst({
      skip,
      take: 1,
    });

    if (randomHadith) {
      hadithId = randomHadith.id;
      await prisma.dailyContent.upsert({
        where: { date: today },
        update: { hadithId },
        create: { date: today, hadithId },
      });
    }
  }

  if (!hadithId) return null;

  const hadith = await prisma.hadith.findUnique({
    where: { id: hadithId },
    include: {
      favorites: {
        where: { userId, contentType: 'HADITH' },
        select: { id: true },
      },
    },
  });

  if (!hadith) return null;

  return {
    id: hadith.id,
    arabicText: hadith.arabicText,
    translation: hadith.frenchTranslation,
    transliteration: hadith.transliteration || undefined,
    sourceBook: hadith.sourceBook,
    sourceNumber: hadith.sourceNumber,
    category: hadith.category,
    audioUrl: hadith.audioUrl || undefined,
    isFavorite: hadith.favorites.length > 0,
  };
}

/**
 * Get single hadith
 */
export async function getHadithById(userId: string, id: string): Promise<HadithDTO> {
  const hadith = await prisma.hadith.findUnique({
    where: { id },
    include: {
      favorites: {
        where: { userId, contentType: 'HADITH' },
        select: { id: true },
      },
    },
  });

  if (!hadith) {
    throw new ApiError('Hadith non trouvé', 404, 'HADITH_NOT_FOUND');
  }

  return {
    id: hadith.id,
    arabicText: hadith.arabicText,
    translation: hadith.frenchTranslation,
    transliteration: hadith.transliteration || undefined,
    sourceBook: hadith.sourceBook,
    sourceNumber: hadith.sourceNumber,
    category: hadith.category,
    audioUrl: hadith.audioUrl || undefined,
    isFavorite: hadith.favorites.length > 0,
  };
}

export default {
  getHadiths,
  getDailyHadith,
  getHadithById,
};
