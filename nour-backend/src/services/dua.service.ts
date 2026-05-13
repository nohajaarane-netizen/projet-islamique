/**
 * Dua Service
 * Manages dua collection with categories and daily features
 */

import { prisma } from '../config/database';
import { logger } from '../utils/logger';
import { ApiError } from '../middleware/error-handler';
import { DuaDTO } from '../types';

/**
 * Get duas with filtering
 */
export async function getDuas(
  userId: string,
  category?: string,
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<{ duas: DuaDTO[]; total: number }> {
  const skip = (page - 1) * limit;

  let where: any = {};

  if (category && category !== 'Tous') {
    where.category = category;
  }

  if (search) {
    where.OR = [
      { arabicText: { contains: search } },
      { frenchTranslation: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [duas, total] = await Promise.all([
    prisma.dua.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        favorites: {
          where: { userId, contentType: 'DUA' },
          select: { id: true },
        },
      },
    }),
    prisma.dua.count({ where }),
  ]);

  const dtos: DuaDTO[] = duas.map(d => ({
    id: d.id,
    arabicText: d.arabicText,
    translation: d.frenchTranslation,
    transliteration: d.transliteration || undefined,
    category: d.category,
    occasion: d.occasion || undefined,
    audioUrl: d.audioUrl || undefined,
    isFavorite: d.favorites.length > 0,
  }));

  return { duas: dtos, total };
}

/**
 * Get daily featured dua
 */
export async function getDailyDua(userId: string): Promise<DuaDTO | null> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dailyContent = await prisma.dailyContent.findUnique({
    where: { date: today },
  });

  let duaId: string | null = null;

  if (dailyContent?.duaId) {
    duaId = dailyContent.duaId;
  } else {
    const count = await prisma.dua.count();
    const skip = Math.floor(Math.random() * count);
    const randomDua = await prisma.dua.findFirst({
      skip,
      take: 1,
    });

    if (randomDua) {
      duaId = randomDua.id;
      await prisma.dailyContent.upsert({
        where: { date: today },
        update: { duaId },
        create: { date: today, duaId },
      });
    }
  }

  if (!duaId) return null;

  const dua = await prisma.dua.findUnique({
    where: { id: duaId },
    include: {
      favorites: {
        where: { userId, contentType: 'DUA' },
        select: { id: true },
      },
    },
  });

  if (!dua) return null;

  return {
    id: dua.id,
    arabicText: dua.arabicText,
    translation: dua.frenchTranslation,
    transliteration: dua.transliteration || undefined,
    category: dua.category,
    occasion: dua.occasion || undefined,
    audioUrl: dua.audioUrl || undefined,
    isFavorite: dua.favorites.length > 0,
  };
}

/**
 * Get single dua
 */
export async function getDuaById(userId: string, id: string): Promise<DuaDTO> {
  const dua = await prisma.dua.findUnique({
    where: { id },
    include: {
      favorites: {
        where: { userId, contentType: 'DUA' },
        select: { id: true },
      },
    },
  });

  if (!dua) {
    throw new ApiError('Dua non trouvé', 404, 'DUA_NOT_FOUND');
  }

  return {
    id: dua.id,
    arabicText: dua.arabicText,
    translation: dua.frenchTranslation,
    transliteration: dua.transliteration || undefined,
    category: dua.category,
    occasion: dua.occasion || undefined,
    audioUrl: dua.audioUrl || undefined,
    isFavorite: dua.favorites.length > 0,
  };
}

export default {
  getDuas,
  getDailyDua,
  getDuaById,
};
