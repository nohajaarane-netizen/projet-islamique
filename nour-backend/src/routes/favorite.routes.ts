import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { FavoriteService } from '../services/favorite.service.js';

const router = Router();
const favoriteService = new FavoriteService();

// Get user favorites (utilise getFavorites)
router.get('/', authenticateToken, async (req: any, res: any) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    
    const favorites = await favoriteService.getFavorites(userId);
    res.json({ success: true, data: favorites });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Toggle favorite (ajouter/supprimer)
router.post('/toggle', authenticateToken, async (req: any, res: any) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    
    const { type, contentId } = req.body;
    
    if (!type || !contentId) {
      return res.status(400).json({ success: false, message: 'Type and contentId are required' });
    }
    
    const result = await favoriteService.toggleFavorite(userId, type, contentId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add favorite
router.post('/', authenticateToken, async (req: any, res: any) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    
    const { type, contentId } = req.body;
    
    if (!type || !contentId) {
      return res.status(400).json({ success: false, message: 'Type and contentId are required' });
    }
    
    const favorite = await favoriteService.addFavorite(userId, type, contentId);
    res.json({ success: true, data: favorite });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Remove favorite
router.delete('/:id', authenticateToken, async (req: any, res: any) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    
    const result = await favoriteService.removeFavorite(userId, req.params.id);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Check if content is favorited
router.get('/check/:type/:contentId', authenticateToken, async (req: any, res: any) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    
    const { type, contentId } = req.params;
    const isFavorite = await favoriteService.checkIfFavorite(userId, type as any, contentId);
    res.json({ success: true, data: { isFavorite } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;