import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { BadgeService } from '../services/badge.service';

const badgeService = new BadgeService();

export class BadgeController {
  /**
   * Get user's badges
   */
  async getUserBadges(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }
      
      const language = req.query.language as string || 'fr';
      
      const badges = await badgeService.getUserBadges(userId, language);
      
      res.json({
        success: true,
        data: badges
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch badges',
        error: error.message
      });
    }
  }
  
  /**
   * Check and award new badges
   */
  async checkNewBadges(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }
      
      const newBadges = await badgeService.checkAndAwardBadges(userId);
      
      res.json({
        success: true,
        data: newBadges,
        message: newBadges.length ? 'New badges awarded!' : 'No new badges'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to check badges',
        error: error.message
      });
    }
  }
}