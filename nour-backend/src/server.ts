/**
 * Server Entry Point
 * Bootstraps HTTP server, database, Redis, WebSockets, and job queues
 */

import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import createApp from './app';
import { connectDatabase, disconnectDatabase } from './config/database';
import { connectRedis, disconnectRedis } from './config/redis';
import { config } from './config/env';
import { logger } from './utils/logger';
import { initializeWebSockets } from './websockets/prayer-countdown.handler';
import { initializeNotificationWorker } from './jobs/notification.queue';
import { initializeDailyContentWorker, scheduleDailyContentRotation } from './jobs/daily-content.job';

/**
 * Start server
 */
async function startServer(): Promise<void> {
  try {
    // Connect to database
    await connectDatabase();

    // Connect to Redis
    await connectRedis();

    // Create Express app
    const app = createApp();

    // Create HTTP server
    const httpServer = createServer(app);

    // Initialize Socket.IO
    const io = new SocketIOServer(httpServer, {
      cors: {
        origin: config.server.frontendUrl,
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    initializeWebSockets(io);
    logger.info('WebSocket server initialized');

    // Initialize job workers
    initializeNotificationWorker();
    initializeDailyContentWorker();
    await scheduleDailyContentRotation();
    logger.info('Job workers initialized');

    // Start listening
    const port = config.port;
    httpServer.listen(port, () => {
      logger.info(`🚀 NOUR server running on port ${port}`);
      logger.info(`📡 API URL: ${config.server.apiUrl}`);
      logger.info(`🔧 Environment: ${config.isProduction ? 'production' : 'development'}`);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      logger.info(`Received ${signal}, shutting down gracefully...`);

      // Close HTTP server
      httpServer.close(() => {
        logger.info('HTTP server closed');
      });

      // Disconnect from services
      await disconnectDatabase();
      await disconnectRedis();

      logger.info('Graceful shutdown complete');
      process.exit(0);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught errors
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught exception:', error);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason) => {
      logger.error('Unhandled rejection:', reason);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start server
startServer();

export default startServer;
