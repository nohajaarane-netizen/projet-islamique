/**
 * Qibla Direction Mathematical Calculations
 * Calculates bearing and distance to Kaaba from any location on Earth
 */

import { logger } from './logger';

// Kaaba coordinates (Masjid al-Haram, Makkah)
export const KAABA_LAT = 21.4225;
export const KAABA_LON = 39.8262;

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Convert radians to degrees
 */
function toDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

/**
 * Calculate Qibla bearing from a location to Kaaba
 * Uses the great circle formula for initial bearing
 * @param lat - Latitude of user location
 * @param lon - Longitude of user location
 * @returns Bearing in degrees (0-360)
 */
export function calculateQiblaBearing(lat: number, lon: number): number {
  const latRad = toRadians(lat);
  const lonRad = toRadians(lon);
  const kaabaLatRad = toRadians(KAABA_LAT);
  const kaabaLonRad = toRadians(KAABA_LON);

  const deltaLon = kaabaLonRad - lonRad;

  const y = Math.sin(deltaLon) * Math.cos(kaabaLatRad);
  const x =
    Math.cos(latRad) * Math.sin(kaabaLatRad) -
    Math.sin(latRad) * Math.cos(kaabaLatRad) * Math.cos(deltaLon);

  let bearing = toDegrees(Math.atan2(y, x));
  bearing = (bearing + 360) % 360;

  logger.debug(`Qibla bearing calculated: ${bearing.toFixed(2)}° from [${lat}, ${lon}]`);
  return bearing;
}

/**
 * Calculate distance to Kaaba using Haversine formula
 * @param lat - Latitude of user location
 * @param lon - Longitude of user location
 * @returns Distance in kilometers
 */
export function calculateDistanceToKaaba(lat: number, lon: number): number {
  const R = 6371; // Earth's radius in kilometers
  const latRad = toRadians(lat);
  const kaabaLatRad = toRadians(KAABA_LAT);
  const deltaLat = toRadians(KAABA_LAT - lat);
  const deltaLon = toRadians(KAABA_LON - lon);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(latRad) * Math.cos(kaabaLatRad) *
    Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  logger.debug(`Distance to Kaaba: ${distance.toFixed(2)} km from [${lat}, ${lon}]`);
  return distance;
}

/**
 * Convert bearing to cardinal direction string
 * Supports French, English, and Arabic
 * @param bearing - Bearing in degrees (0-360)
 * @param language - Language code (fr/en/ar)
 * @returns Cardinal direction string
 */
export function bearingToCardinal(bearing: number, language: string = 'fr'): string {
  const directions: Record<string, string[]> = {
    fr: ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO'],
    en: ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'],
    ar: ['شمال', 'شمال شمال شرق', 'شمال شرق', 'شرق شمال شرق', 'شرق', 'شرق جنوب شرق', 'جنوب شرق', 'جنوب جنوب شرق', 
         'جنوب', 'جنوب جنوب غرب', 'جنوب غرب', 'غرب جنوب غرب', 'غرب', 'غرب شمال غرب', 'شمال غرب', 'شمال شمال غرب'],
  };

  const dirs = directions[language] || directions['fr'];
  const index = Math.round(bearing / 22.5) % 16;
  return dirs[index];
}

/**
 * Get full direction description in user's language
 * @param bearing - Bearing in degrees
 * @param language - Language code
 * @returns Full direction string (e.g., "Sud-Ouest", "South-West", "جنوب غرب")
 */
export function getDirectionDescription(bearing: number, language: string = 'fr'): string {
  const descriptions: Record<string, Record<string, string>> = {
    fr: {
      N: 'Nord', NE: 'Nord-Est', E: 'Est', SE: 'Sud-Est',
      S: 'Sud', SW: 'Sud-Ouest', W: 'Ouest', NW: 'Nord-Ouest',
    },
    en: {
      N: 'North', NE: 'North-East', E: 'East', SE: 'South-East',
      S: 'South', SW: 'South-West', W: 'West', NW: 'North-West',
    },
    ar: {
      N: 'شمال', NE: 'شمال شرقي', E: 'شرق', SE: 'جنوب شرقي',
      S: 'جنوب', SW: 'جنوب غربي', W: 'غرب', NW: 'شمال غربي',
    },
  };

  // Simplified 8-direction mapping
  const normalized = ((bearing + 360) % 360);
  let key: string;

  if (normalized >= 337.5 || normalized < 22.5) key = 'N';
  else if (normalized >= 22.5 && normalized < 67.5) key = 'NE';
  else if (normalized >= 67.5 && normalized < 112.5) key = 'E';
  else if (normalized >= 112.5 && normalized < 157.5) key = 'SE';
  else if (normalized >= 157.5 && normalized < 202.5) key = 'S';
  else if (normalized >= 202.5 && normalized < 247.5) key = 'SW';
  else if (normalized >= 247.5 && normalized < 292.5) key = 'W';
  else key = 'NW';

  const langDesc = descriptions[language] || descriptions['fr'];
  return langDesc[key] || langDesc['S'];
}

/**
 * Calculate precision level based on location accuracy
 * @param accuracy - Location accuracy in meters (optional)
 * @returns Precision level
 */
export function calculatePrecision(accuracy?: number): 'élevée' | 'moyenne' | 'faible' {
  if (!accuracy || accuracy < 100) return 'élevée';
  if (accuracy < 1000) return 'moyenne';
  return 'faible';
}

/**
 * Complete Qibla calculation result
 */
export interface QiblaCalculationResult {
  bearing: number;
  cardinalDirection: string;
  directionDescription: string;
  distance: number;
  distanceFormatted: string;
  precision: 'élevée' | 'moyenne' | 'faible';
  kaabaCoordinates: {
    lat: number;
    lon: number;
  };
}

/**
 * Complete Qibla calculation from user coordinates
 * @param lat - User latitude
 * @param lon - User longitude
 * @param language - Response language
 * @param accuracy - GPS accuracy in meters
 * @returns Complete Qibla information
 */
export function calculateQibla(
  lat: number,
  lon: number,
  language: string = 'fr',
  accuracy?: number
): QiblaCalculationResult {
  const bearing = calculateQiblaBearing(lat, lon);
  const distance = calculateDistanceToKaaba(lat, lon);
  const cardinal = bearingToCardinal(bearing, language);
  const description = getDirectionDescription(bearing, language);
  const precision = calculatePrecision(accuracy);

  logger.info(`Qibla calculated for [${lat}, ${lon}]: ${bearing.toFixed(1)}° ${description}, ${distance.toFixed(0)} km`);

  return {
    bearing,
    cardinalDirection: cardinal,
    directionDescription: description,
    distance,
    distanceFormatted: `${distance.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} km`,
    precision,
    kaabaCoordinates: {
      lat: KAABA_LAT,
      lon: KAABA_LON,
    },
  };
}

export default {
  calculateQiblaBearing,
  calculateDistanceToKaaba,
  bearingToCardinal,
  getDirectionDescription,
  calculatePrecision,
  calculateQibla,
  KAABA_LAT,
  KAABA_LON,
};
