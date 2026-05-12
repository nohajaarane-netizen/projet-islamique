import dotenv from 'dotenv';
import path from 'path';

// Charger .env au début
dotenv.config();

// Configuration object (sans import.meta)
export const config = {
  // Server
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database
  databaseUrl: process.env.DATABASE_URL || '',
  
  // JWT
  jwtSecret: process.env.JWT_SECRET || 'default-secret-key-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  
  // Weather API
  weather: {
    apiKey: process.env.WEATHER_API_KEY || '',
    baseUrl: process.env.WEATHER_API_URL || 'https://api.openweathermap.org/data/2.5',
  },
  
  // Redis
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
  },
  
  // CORS
  corsOrigin: process.env.CORS_ORIGIN || '*',
  
  // Rate limiting
  rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '15', 10),
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
};

// Validation des variables critiques
if (!config.databaseUrl && config.nodeEnv === 'production') {
  console.error('ERROR: DATABASE_URL is not set in production');
  process.exit(1);
}
if (!config.jwtSecret && config.nodeEnv === 'production') {
  console.error('ERROR: JWT_SECRET is not set in production');
  process.exit(1);
}
if (!config.weather.apiKey) {
  console.warn('WARNING: WEATHER_API_KEY is not set, weather features will be disabled');
}
export default config;