/**
 * Auth Controller
 * Handles authentication HTTP requests
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as authService from '../services/auth.service';
import { ApiError } from '../middleware/error-handler';
import { validateBody } from '../middleware/validate-request';

// Validation schemas
export const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Mot de passe trop court (min 6 caractères)'),
  name: z.string().min(2, 'Nom trop court'),
  preferredLang: z.enum(['fr', 'en', 'ar']).optional(),
  locationLat: z.number().optional(),
  locationLon: z.number().optional(),
  cityName: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token requis'),
});

/**
 * Register new user
 */
export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.register(req.body);

    res.status(201).json({
      success: true,
      message: 'Inscription réussie',
      data: {
        user: result.user,
        tokens: result.tokens,
      },
      meta: {
        timestamp: new Date().toISOString(),
        language: result.user.preferredLang,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Login user
 */
export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.login(req.body);

    res.status(200).json({
      success: true,
      message: 'Connexion réussie',
      data: {
        user: result.user,
        tokens: result.tokens,
      },
      meta: {
        timestamp: new Date().toISOString(),
        language: result.user.preferredLang,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Refresh access token
 */
export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const tokens = await authService.refreshToken(req.body.refreshToken);

    res.status(200).json({
      success: true,
      message: 'Token rafraîchi',
      data: tokens,
      meta: {
        timestamp: new Date().toISOString(),
        language: 'fr',
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get user profile
 */
export async function getProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new ApiError('Non authentifié', 401, 'UNAUTHORIZED');
    }

    const profile = await authService.getProfile(userId);

    res.status(200).json({
      success: true,
      message: 'Profil récupéré',
      data: profile,
      meta: {
        timestamp: new Date().toISOString(),
        language: profile.preferredLang,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update profile
 */
export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new ApiError('Non authentifié', 401, 'UNAUTHORIZED');
    }

    const profile = await authService.updateProfile(userId, req.body);

    res.status(200).json({
      success: true,
      message: 'Profil mis à jour',
      data: profile,
      meta: {
        timestamp: new Date().toISOString(),
        language: profile.preferredLang,
      },
    });
  } catch (error) {
    next(error);
  }
}

export default {
  register,
  login,
  refresh,
  getProfile,
  updateProfile,
};
