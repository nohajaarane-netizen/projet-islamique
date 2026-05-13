/**
 * OpenWeatherMap API Client
 * Fetches weather data with Redis caching
 */

import axios, { AxiosInstance } from 'axios';
import { config } from '../config/env';
import { cache } from '../config/redis';
import { logger } from './logger';
import type { WeatherData, WeatherCurrent, WeatherHourly, WeatherDaily } from '../types';

// Interface for OpenWeatherMap API response
interface OpenWeatherResponse {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg?: number;
  };
  dt: number;
  list?: any[];
  [key: string]: any; // For other properties
}

class WeatherClient {
  private client: AxiosInstance;
  private apiKey: string;
  private baseUrl = 'https://api.openweathermap.org/data/2.5';

  constructor() {
    this.apiKey = config.weather?.apiKey || '';
    
    if (!this.apiKey) {
      logger.warn('OpenWeatherMap API key not configured - weather features will not work');
    }
    
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Get weather icon URL
   */
  getIconUrl(iconCode: string): string {
    if (!iconCode) return '';
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }

  /**
   * Map weather condition to our format
   */
  private mapCondition(condition: string, description: string): string {
    const conditionMap: Record<string, string> = {
      'Clear': 'Ensoleillé',
      'Clouds': 'Partiellement nuageux',
      'Rain': 'Pluvieux',
      'Drizzle': 'Pluie légère',
      'Thunderstorm': 'Orageux',
      'Snow': 'Neige',
      'Mist': 'Brumeux',
      'Fog': 'Brouillard',
      'Smoke': 'Brumeux',
      'Haze': 'Brumeux',
      'Dust': 'Poussiéreux',
      'Sand': 'Sableux',
      'Ash': 'Cendres',
      'Squall': 'Rafales',
      'Tornado': 'Tornade',
    };

    const mapped = conditionMap[condition];
    return mapped || description || 'Inconnu';
  }

  /**
   * Convert wind direction degrees to cardinal
   */
  private windDirection(degrees: number): string {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index] || 'N';
  }

  /**
   * Get current weather
   */
  async getCurrentWeather(lat: number, lon: number): Promise<WeatherCurrent> {
    const cacheKey = `weather:current:${lat.toFixed(2)}:${lon.toFixed(2)}`;

    // Check cache
    const cached = await cache.get<WeatherCurrent>(cacheKey);
    if (cached) {
      logger.debug('Weather current cache hit');
      return cached;
    }

    if (!this.apiKey) {
      throw new Error('Weather API key not configured. Please check your environment variables.');
    }

    try {
      const response = await this.client.get<OpenWeatherResponse>('/weather', {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          units: 'metric',
          lang: 'fr',
        },
      });

      const data = response.data;
      const weatherMain = data.weather?.[0]?.main || '';
      const weatherDesc = data.weather?.[0]?.description || '';
      
      const current: WeatherCurrent = {
        temp: Math.round(data.main.temp),
        condition: this.mapCondition(weatherMain, weatherDesc),
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
        windDirection: this.windDirection(data.wind.deg || 0),
        uvIndex: 0, // Not available in free tier current weather
        pressure: data.main.pressure,
        feelsLike: Math.round(data.main.feels_like),
      };

      // Cache for 1 hour (3600 seconds)
      await cache.set(cacheKey, current, 3600);
      logger.info(`Current weather fetched for [${lat}, ${lon}]: ${current.temp}°C`);

      return current;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          logger.error('Invalid OpenWeatherMap API key');
          throw new Error('Invalid weather API key');
        } else if (error.response?.status === 404) {
          logger.error(`Location not found: ${lat}, ${lon}`);
          throw new Error('Location not found for weather data');
        }
      }
      logger.error('Failed to fetch current weather:', error);
      throw new Error('Unable to fetch weather data. Please try again later.');
    }
  }

  /**
   * Get hourly forecast (next 24 hours, 3-hour intervals)
   */
  async getHourlyForecast(lat: number, lon: number): Promise<WeatherHourly[]> {
    const cacheKey = `weather:hourly:${lat.toFixed(2)}:${lon.toFixed(2)}`;

    const cached = await cache.get<WeatherHourly[]>(cacheKey);
    if (cached) {
      logger.debug('Weather hourly cache hit');
      return cached;
    }

    if (!this.apiKey) {
      throw new Error('Weather API key not configured');
    }

    try {
      const response = await this.client.get<any>('/forecast', {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          units: 'metric',
          lang: 'fr',
          cnt: 8, // 8 timestamps = 24 hours (3-hour intervals)
        },
      });

      const list = response.data.list || [];
      
      const hourly: WeatherHourly[] = list.map((item: any) => {
        const date = new Date(item.dt * 1000);
        return {
          time: date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          temp: Math.round(item.main.temp),
          condition: this.mapCondition(item.weather?.[0]?.main || '', item.weather?.[0]?.description || ''),
          icon: this.getIconUrl(item.weather?.[0]?.icon || ''),
        };
      });

      await cache.set(cacheKey, hourly, 3600);
      logger.info(`Hourly forecast fetched: ${hourly.length} periods`);

      return hourly;
    } catch (error) {
      logger.error('Failed to fetch hourly forecast:', error);
      // Return empty array instead of throwing to avoid breaking the app
      return [];
    }
  }

  /**
   * Get daily forecast (5 days - OpenWeatherMap free tier limit)
   * @param lat - Latitude
   * @param lon - Longitude
   * @param language - Language for day names (fr/en/ar)
   */
  async getDailyForecast(lat: number, lon: number, language: string = 'fr'): Promise<WeatherDaily[]> {
    const cacheKey = `weather:daily:${lat.toFixed(2)}:${lon.toFixed(2)}:${language}`;

    const cached = await cache.get<WeatherDaily[]>(cacheKey);
    if (cached) {
      logger.debug('Weather daily cache hit');
      return cached;
    }

    if (!this.apiKey) {
      throw new Error('Weather API key not configured');
    }

    try {
      // Using 5-day forecast API (free tier limitation)
      const response = await this.client.get<any>('/forecast', {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          units: 'metric',
          lang: 'fr',
        },
      });

      // Group by day and get max/min temps
      const dailyMap = new Map<string, any[]>();
      const list = response.data.list || [];

      list.forEach((item: any) => {
        const date = new Date(item.dt * 1000);
        const dateStr = date.toISOString().split('T')[0];
        if (!dailyMap.has(dateStr)) {
          dailyMap.set(dateStr, []);
        }
        dailyMap.get(dateStr)!.push(item);
      });

      // Day names in different languages
      const dayNamesLong: Record<string, string[]> = {
        fr: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
        en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        ar: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
      };
      
      const dayNamesShort: Record<string, string[]> = {
        fr: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
        en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        ar: ['أحد', 'إثن', 'ثلاث', 'أربع', 'خميس', 'جمعة', 'سبت']
      };

      const daily: WeatherDaily[] = [];

      let count = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (const [dateStr, items] of dailyMap) {
        if (count >= 7) break;

        const temps = items.map((i: any) => i.main.temp);
        const maxTemp = Math.round(Math.max(...temps));
        const minTemp = Math.round(Math.min(...temps));

        // Use midday item for condition (approx index 2-3)
        const middayItem = items[Math.floor(items.length / 2)] || items[0];
        const dateObj = new Date(dateStr);
        
        // Determine if it's today
        const isToday = dateObj.getTime() === today.getTime();
        
        let dayName: string;
        if (isToday) {
          dayName = language === 'fr' ? 'Aujourd\'hui' : (language === 'en' ? 'Today' : 'اليوم');
        } else {
          dayName = dayNamesShort[language]?.[dateObj.getDay()] || dayNamesShort.fr[dateObj.getDay()];
        }

        daily.push({
          date: dateStr,
          dayName: dayName,
          condition: this.mapCondition(middayItem.weather?.[0]?.main || '', middayItem.weather?.[0]?.description || ''),
          icon: this.getIconUrl(middayItem.weather?.[0]?.icon || ''),
          maxTemp,
          minTemp,
        });

        count++;
      }

      await cache.set(cacheKey, daily, 3600);
      logger.info(`Daily forecast fetched: ${daily.length} days for language ${language}`);

      return daily;
    } catch (error) {
      logger.error('Failed to fetch daily forecast:', error);
      // Return empty array instead of throwing
      return [];
    }
  }

  /**
   * Get complete weather data
   * @param lat - Latitude
   * @param lon - Longitude
   * @param locationName - Name of the location
   * @param language - Language for day names (default: 'fr')
   */
  async getCompleteWeather(lat: number, lon: number, locationName: string, language: string = 'fr'): Promise<WeatherData> {
    try {
      const [current, hourly, daily] = await Promise.allSettled([
        this.getCurrentWeather(lat, lon),
        this.getHourlyForecast(lat, lon),
        this.getDailyForecast(lat, lon, language),
      ]);

      // Handle partial failures gracefully
      const weatherData: WeatherData = {
        location: locationName,
        current: current.status === 'fulfilled' ? current.value : this.getDefaultCurrentWeather(),
        hourly: hourly.status === 'fulfilled' ? hourly.value : [],
        daily: daily.status === 'fulfilled' ? daily.value : [],
      };

      // Log partial failures
      if (current.status === 'rejected') {
        logger.warn(`Failed to fetch current weather: ${current.reason}`);
      }
      if (hourly.status === 'rejected') {
        logger.warn(`Failed to fetch hourly forecast: ${hourly.reason}`);
      }
      if (daily.status === 'rejected') {
        logger.warn(`Failed to fetch daily forecast: ${daily.reason}`);
      }

      return weatherData;
    } catch (error) {
      logger.error('Failed to fetch complete weather data:', error);
      // Return default weather data
      return {
        location: locationName,
        current: this.getDefaultCurrentWeather(),
        hourly: [],
        daily: [],
      };
    }
  }

  /**
   * Get default current weather (for fallback)
   */
  private getDefaultCurrentWeather(): WeatherCurrent {
    return {
      temp: 0,
      condition: 'Non disponible',
      humidity: 0,
      windSpeed: 0,
      windDirection: 'N',
      uvIndex: 0,
      pressure: 0,
      feelsLike: 0,
    };
  }

  /**
   * Check if API key is configured
   */
  isConfigured(): boolean {
    return !!this.apiKey && this.apiKey !== '';
  }
}

export const weatherClient = new WeatherClient();
export default weatherClient;