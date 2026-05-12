/**
 * Authentication Service
 * Handles user registration, login, and token management
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { config } from '../config/env';
import { logger } from '../utils/logger';
import { ApiError } from '../middleware/error-handler';
import { RegisterData, LoginCredentials, AuthTokens, JwtPayload } from '../types';

/**
 * Hash password with bcrypt
 */
async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Compare password with hash
 */
async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate JWT access token
 */
function generateAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn || '7d',
  });
}

/**
 * Generate JWT refresh token
 * Using same secret but longer expiration
 */
function generateRefreshToken(payload: JwtPayload): string {
  // Using same jwtSecret but with longer expiration (30 days for refresh)
  return jwt.sign(
    { userId: payload.userId },
    config.jwtSecret,
    {
      expiresIn: '30d', // Refresh token valid for 30 days
    }
  );
}

/**
 * Register new user
 */
export async function register(data: RegisterData) {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new ApiError('Email déjà utilisé', 409, 'EMAIL_EXISTS');
  }

  const passwordHash = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      name: data.name,
      preferredLang: data.preferredLang || 'fr',
      locationLat: data.locationLat,
      locationLon: data.locationLon,
      cityName: data.cityName || 'Berrechid, Maroc',
    },
    select: {
      id: true,
      email: true,
      name: true,
      preferredLang: true,
      cityName: true,
      createdAt: true,
    },
  });

  // Initialize user streaks
  await prisma.userStreak.createMany({
    data: [
      { userId: user.id, streakType: 'PRAYER' },
      { userId: user.id, streakType: 'GRATITUDE' },
      { userId: user.id, streakType: 'DHIKR' },
    ],
  });

  // Initialize notification settings
  await prisma.notificationSetting.createMany({
    data: [
      { userId: user.id, prayerType: 'FAJR' },
      { userId: user.id, prayerType: 'DHUHR' },
      { userId: user.id, prayerType: 'ASR' },
      { userId: user.id, prayerType: 'MAGHRIB' },
      { userId: user.id, prayerType: 'ISHA' },
    ],
  });

  logger.info(`User registered: ${user.email}`);

  const tokens = generateTokens({
    userId: user.id,
    email: user.email,
    preferredLang: user.preferredLang,
  });

  return { user, tokens };
}

/**
 * Login user
 */
export async function login(credentials: LoginCredentials) {
  const user = await prisma.user.findUnique({
    where: { email: credentials.email },
  });

  if (!user) {
    throw new ApiError('Email ou mot de passe incorrect', 401, 'INVALID_CREDENTIALS');
  }

  const isValid = await comparePassword(credentials.password, user.passwordHash);

  if (!isValid) {
    throw new ApiError('Email ou mot de passe incorrect', 401, 'INVALID_CREDENTIALS');
  }

  logger.info(`User logged in: ${user.email}`);

  const tokens = generateTokens({
    userId: user.id,
    email: user.email,
    preferredLang: user.preferredLang,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      preferredLang: user.preferredLang,
      cityName: user.cityName,
    },
    tokens,
  };
}

/**
 * Refresh access token
 */
export async function refreshToken(refreshToken: string) {
  try {
    // Verify the refresh token using the same secret
    const decoded = jwt.verify(refreshToken, config.jwtSecret) as { userId: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, preferredLang: true },
    });

    if (!user) {
      throw new ApiError('Utilisateur non trouvé', 401, 'USER_NOT_FOUND');
    }

    // Generate new tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      preferredLang: user.preferredLang,
    });

    logger.info(`Token refreshed for: ${user.email}`);

    return tokens;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new ApiError('Refresh token expiré', 401, 'REFRESH_EXPIRED');
    }
    throw new ApiError('Token invalide', 401, 'INVALID_REFRESH');
  }
}

/**
 * Generate both tokens
 */
function generateTokens(payload: JwtPayload): AuthTokens {
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // Decode to get expiration time
  const decoded = jwt.decode(accessToken) as { exp: number };
  const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);

  return {
    accessToken,
    refreshToken,
    expiresIn,
  };
}

/**
 * Get user profile
 */
export async function getProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      avatarUrl: true,
      preferredLang: true,
      locationLat: true,
      locationLon: true,
      cityName: true,
      timezone: true,
      darkMode: true,
      fontSize: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new ApiError('Utilisateur non trouvé', 404, 'USER_NOT_FOUND');
  }

  return user;
}

/**
 * Update user profile
 */
export async function updateProfile(userId: string, data: Partial<{
  name: string;
  email: string;
  preferredLang: string;
  locationLat: number;
  locationLon: number;
  cityName: string;
  timezone: string;
}>) {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      email: true,
      name: true,
      preferredLang: true,
      locationLat: true,
      locationLon: true,
      cityName: true,
      timezone: true,
      updatedAt: true,
    },
  });

  logger.info(`Profile updated for: ${user.email}`);
  return user;
}

export default {
  register,
  login,
  refreshToken,
  getProfile,
  updateProfile,
};