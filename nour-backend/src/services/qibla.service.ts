/**
 * Qibla Service
 * Provides Qibla direction calculations
 */

import { calculateQibla } from '../utils/qibla-math';
import { logger } from '../utils/logger';
import { QiblaInfo, LocationInfo } from '../types';

/**
 * Get Qibla information for a location
 */
export async function getQiblaInfo(
  lat: number,
  lon: number,
  language: string = 'fr'
): Promise<QiblaInfo> {
  const result = calculateQibla(lat, lon, language);

  return {
    direction: {
      angle: result.bearing,
      direction: result.cardinalDirection,
      cardinalDirection: result.directionDescription,
      precision: result.precision,
    },
    distance: result.distance,
    distanceUnit: 'km',
    kaabaCoordinates: result.kaabaCoordinates,
  };
}

/**
 * Get location information
 */
export async function getLocationInfo(
  lat: number,
  lon: number,
  cityName?: string
): Promise<LocationInfo> {
  const now = new Date();

  return {
    city: cityName || 'Localisation inconnue',
    country: 'Maroc',
    coordinates: {
      lat,
      lon,
    },
    localTime: now.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    timezone: 'Africa/Casablanca',
  };
}

export default {
  getQiblaInfo,
  getLocationInfo,
};
