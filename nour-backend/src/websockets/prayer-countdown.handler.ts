/**
 * Prayer Countdown WebSocket Handler
 * Real-time prayer countdown and alerts
 */

import { Server, Socket } from 'socket.io';
import { getRedisClient } from '../config/redis';
import { logger } from '../utils/logger';
import { getNextPrayer } from '../utils/prayer-calculator';

// Active countdown intervals
const activeIntervals = new Map<string, NodeJS.Timeout>();

/**
 * Initialize WebSocket handlers
 */
export function initializeWebSockets(io: Server): void {
  io.on('connection', (socket: Socket) => {
    logger.info(`Client connected: ${socket.id}`);

    // Join user room
    socket.on('join', (userId: string) => {
      socket.join(`user:${userId}`);
      logger.debug(`User ${userId} joined room`);

      // Start countdown for this user
      startCountdown(socket, userId);
    });

    // Leave user room
    socket.on('leave', (userId: string) => {
      socket.leave(`user:${userId}`);
      stopCountdown(userId);
      logger.debug(`User ${userId} left room`);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      logger.info(`Client disconnected: ${socket.id}`);
    });
  });
}

/**
 * Start countdown interval for user
 */
function startCountdown(socket: Socket, userId: string): void {
  // Clear existing interval
  stopCountdown(userId);

  const interval = setInterval(async () => {
    try {
      // Get user location from database
      const { prisma } = await import('../config/database');
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { locationLat: true, locationLon: true }
      });

      if (!user?.locationLat || !user?.locationLon) return;

      const nextPrayer = getNextPrayer(user.locationLat, user.locationLon);

      // Emit to user's room
      socket.to(`user:${userId}`).emit('prayer-countdown', {
        nextPrayer: nextPrayer.name,
        time: nextPrayer.time,
        countdown: nextPrayer.countdown,
        countdownSeconds: nextPrayer.countdownSeconds,
      });

      // Also emit to the socket that triggered it
      socket.emit('prayer-countdown', {
        nextPrayer: nextPrayer.name,
        time: nextPrayer.time,
        countdown: nextPrayer.countdown,
        countdownSeconds: nextPrayer.countdownSeconds,
      });

      // Check if prayer alert needed (15 min before)
      if (nextPrayer.countdownSeconds === 15 * 60) {
        socket.emit('prayer-alert', {
          prayer: nextPrayer.name,
          time: nextPrayer.time,
          minutesBefore: 15,
          message: `La prière ${nextPrayer.name} commence dans 15 minutes`,
        });
      }

    } catch (error) {
      logger.error('Countdown error:', error);
    }
  }, 1000); // Update every second

  activeIntervals.set(userId, interval);
}

/**
 * Stop countdown for user
 */
function stopCountdown(userId: string): void {
  const interval = activeIntervals.get(userId);
  if (interval) {
    clearInterval(interval);
    activeIntervals.delete(userId);
  }
}

/**
 * Broadcast prayer alert to all connected users
 */
export async function broadcastPrayerAlert(
  io: Server,
  userId: string,
  prayerName: string,
  time: string
): Promise<void> {
  io.to(`user:${userId}`).emit('prayer-alert', {
    prayer: prayerName,
    time,
    minutesBefore: 15,
    message: `La prière ${prayerName} commence bientôt`,
  });
}

export default {
  initializeWebSockets,
  broadcastPrayerAlert,
};
