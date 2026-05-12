import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class FavoriteService {
  // Récupérer tous les favoris d'un utilisateur
  async getFavorites(userId: string) {
    return await prisma.favorite.findMany({
      where: { userId },
      include: {
        hadith: true,
        dua: true,
        name: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // Ajouter un favori
  async addFavorite(userId: string, type: 'hadith' | 'dua' | 'name', contentId: string) {
    const data: any = { userId };
    
    if (type === 'hadith') data.hadithId = contentId;
    else if (type === 'dua') data.duaId = contentId;
    else if (type === 'name') data.nameId = contentId;
    
    return await prisma.favorite.create({ data });
  }

  // Supprimer un favori
  async removeFavorite(userId: string, favoriteId: string) {
    return await prisma.favorite.deleteMany({
      where: { id: favoriteId, userId }
    });
  }

  // Toggle favorite (ajouter si n'existe pas, supprimer si existe)
  async toggleFavorite(userId: string, type: 'hadith' | 'dua' | 'name', contentId: string) {
    // Vérifier si le favori existe déjà
    const where: any = { userId };
    if (type === 'hadith') where.hadithId = contentId;
    else if (type === 'dua') where.duaId = contentId;
    else if (type === 'name') where.nameId = contentId;
    
    const existing = await prisma.favorite.findFirst({ where });
    
    if (existing) {
      // Supprimer le favori
      await prisma.favorite.delete({ where: { id: existing.id } });
      return { action: 'removed', favorite: null };
    } else {
      // Ajouter le favori
      const data: any = { userId };
      if (type === 'hadith') data.hadithId = contentId;
      else if (type === 'dua') data.duaId = contentId;
      else if (type === 'name') data.nameId = contentId;
      
      const newFavorite = await prisma.favorite.create({ data });
      return { action: 'added', favorite: newFavorite };
    }
  }

  // Vérifier si un contenu est favori
  async checkIfFavorite(userId: string, type: 'hadith' | 'dua' | 'name', contentId: string) {
    const where: any = { userId };
    if (type === 'hadith') where.hadithId = contentId;
    else if (type === 'dua') where.duaId = contentId;
    else if (type === 'name') where.nameId = contentId;
    
    const favorite = await prisma.favorite.findFirst({ where });
    return !!favorite;
  }
}

export default FavoriteService;