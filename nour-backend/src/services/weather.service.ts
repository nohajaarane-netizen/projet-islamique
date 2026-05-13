import { weatherClient } from '../utils/weather-client.js';
import { logger } from '../utils/logger.js';

// Importer Prisma
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class WeatherService {
  async getUserWeather(userId: string, language: string = 'fr') {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { locationLat: true, locationLon: true, cityName: true }
      });
      
      if (!user?.locationLat || !user?.locationLon) {
        throw new Error('User location not set');
      }
      
      return await weatherClient.getCompleteWeather(
        user.locationLat, 
        user.locationLon, 
        user.cityName || 'Unknown', 
        language
      );
    } catch (error) {
      logger.error('Error in getUserWeather:', error);
      throw error;
    }
  }

  async getWeatherByCoords(lat: number, lon: number, locationName: string, language: string = 'fr') {
    try {
      return await weatherClient.getCompleteWeather(lat, lon, locationName, language);
    } catch (error) {
      logger.error('Error in getWeatherByCoords:', error);
      throw error;
    }
  }

  async updateUserLocation(userId: string, lat: number, lon: number, cityName: string) {
    try {
      return await prisma.user.update({
        where: { id: userId },
        data: { locationLat: lat, locationLon: lon, cityName }
      });
    } catch (error) {
      logger.error('Error in updateUserLocation:', error);
      throw error;
    }
  }
}

// Export par défaut aussi
export default WeatherService;