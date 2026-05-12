import { Request, Response } from 'express';
import { FavoriteService } from '../services/favorite.service';

const favoriteService = new FavoriteService();

// Interface pour les requêtes authentifiées
interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export const favoriteController = {
  
  // GET /api/favorites - Get all favorites for authenticated user
  getAll: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }
      
      const favorites = await favoriteService.getFavorites(userId);
      res.json({ success: true, data: favorites });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  // POST /api/favorites - Add a favorite
  create: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }
      
      const { type, contentId } = req.body;
      
      if (!type || !contentId) {
        return res.status(400).json({ error: 'Type and contentId are required' });
      }
      
      const favorite = await favoriteService.addFavorite(userId, type, contentId);
      res.status(201).json({ success: true, data: favorite });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  },

  // POST /api/favorites/toggle - Toggle favorite (add or remove)
  toggle: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }
      
      const { type, contentId } = req.body;
      
      if (!type || !contentId) {
        return res.status(400).json({ error: 'Type and contentId are required' });
      }
      
      const result = await favoriteService.toggleFavorite(userId, type, contentId);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  },

  // DELETE /api/favorites/:id - Remove a favorite by ID
  delete: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }
      
      const { id } = req.params;
      await favoriteService.removeFavorite(userId, id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  },

  // DELETE /api/favorites - Remove a favorite by type and contentId
  deleteByContent: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }
      
      const { type, contentId } = req.body;
      
      if (!type || !contentId) {
        return res.status(400).json({ error: 'Type and contentId are required' });
      }
      
      // Find and delete the favorite
      const where: any = { userId };
      if (type === 'hadith') where.hadithId = contentId;
      else if (type === 'dua') where.duaId = contentId;
      else if (type === 'name') where.nameId = contentId;
      
      const favoriteServiceAny = favoriteService as any;
      const existing = await favoriteServiceAny.prisma?.favorite.findFirst({ where });
      
      if (existing) {
        await favoriteService.removeFavorite(userId, existing.id);
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  },

  // GET /api/favorites/check/:type/:contentId - Check if content is favorited
  check: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }
      
      const { type, contentId } = req.params;
      const isFavorite = await favoriteService.checkIfFavorite(userId, type as any, contentId);
      res.json({ success: true, data: { isFavorite } });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
};