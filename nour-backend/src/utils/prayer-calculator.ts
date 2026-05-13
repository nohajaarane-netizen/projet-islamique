/**
 * Prayer Time Calculator using adhan-js
 * Calculates Islamic prayer times for any location
 */

import { Coordinates, CalculationMethod, PrayerTimes, SunnahTimes, Madhab } from 'adhan';
import { logger } from './logger';
import { gregorianToHijri, calculateMoonPhase } from './hijri-converter';
import type { CalculationMethod as MethodType, Madhab as MadhabType, DailyPrayerTimes, MonthlyPrayerTimes, NextPrayerInfo } from '../types';

// Map our method names to adhan-js methods
const METHOD_MAP: Record<string, CalculationMethod> = {
  'MWL': CalculationMethod.MuslimWorldLeague,
  'ISNA': CalculationMethod.NorthAmerica,
  'Egypt': CalculationMethod.Egyptian,
  'Makkah': CalculationMethod.UmmAlQura,
  'Karachi': CalculationMethod.Karachi,
  'Tehran': CalculationMethod.Tehran,
  'Jafari': CalculationMethod.Jafari,
};

// Map our madhab names to adhan-js madhabs
const MADHAB_MAP: Record<string, Madhab> = {
  'Shafi': Madhab.Shafi,
  'Hanafi': Madhab.Hanafi,
};

/**
 * Get prayer times for a specific date and location
 * @param lat - Latitude
 * @param lon - Longitude
 * @param date - Date to calculate for (default: today)
 * @param method - Calculation method (default: MWL)
 * @param madhab - Madhab for Asr calculation (default: Shafi)
 * @returns Daily prayer times with Hijri date
 */
export function getPrayerTimes(
  lat: number,
  lon: number,
  date: Date = new Date(),
  method: string = 'MWL',
  madhab: string = 'Shafi'
): DailyPrayerTimes {
  const coordinates = new Coordinates(lat, lon);
  const calculationMethod = METHOD_MAP[method] || METHOD_MAP['MWL'];

  // Set madhab for Asr calculation
  if (madhab === 'Hanafi' && calculationMethod.madhab !== undefined) {
    calculationMethod.madhab = MADHAB_MAP['Hanafi'];
  }

  const prayerTimes = new PrayerTimes(coordinates, date, calculationMethod);
  const sunnahTimes = new SunnahTimes(prayerTimes);

  // Format times to HH:MM
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const hijri = gregorianToHijri(date);
  const moonPhase = calculateMoonPhase(date);

  logger.debug(`Prayer times calculated for [${lat}, ${lon}] on ${date.toDateString()}`);

  return {
    date: date.toISOString().split('T')[0],
    hijriDate: hijri.formatted.fr,
    times: {
      fajr: formatTime(prayerTimes.fajr),
      chourouq: formatTime(prayerTimes.sunrise),
      dhuhr: formatTime(prayerTimes.dhuhr),
      asr: formatTime(prayerTimes.asr),
      maghrib: formatTime(prayerTimes.maghrib),
      isha: formatTime(prayerTimes.isha),
    },
    moonPhase: moonPhase.phase,
  };
}

/**
 * Get monthly prayer times
 * @param lat - Latitude
 * @param lon - Longitude
 * @param month - Month (1-12)
 * @param year - Year
 * @param method - Calculation method
 * @param madhab - Madhab
 * @returns Monthly prayer times table
 */
export function getMonthlyPrayerTimes(
  lat: number,
  lon: number,
  month: number,
  year: number,
  method: string = 'MWL',
  madhab: string = 'Shafi'
): MonthlyPrayerTimes {
  const daysInMonth = new Date(year, month, 0).getDate();
  const days: MonthlyPrayerTimes['days'] = [];

  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dailyTimes = getPrayerTimes(lat, lon, date, method, madhab);

    days.push({
      date: dailyTimes.date,
      dayName: dayNames[date.getDay()],
      fajr: dailyTimes.times.fajr,
      dhuhr: dailyTimes.times.dhuhr,
      asr: dailyTimes.times.asr,
      maghrib: dailyTimes.times.maghrib,
      isha: dailyTimes.times.isha,
    });
  }

  logger.info(`Monthly prayer times generated: ${month}/${year}, ${days.length} days`);

  return {
    month,
    year,
    location: `${lat}, ${lon}`,
    days,
  };
}

/**
 * Get next prayer information
 * @param lat - Latitude
 * @param lon - Longitude
 * @param method - Calculation method
 * @param madhab - Madhab
 * @returns Next prayer name, time, and countdown
 */
export function getNextPrayer(
  lat: number,
  lon: number,
  method: string = 'MWL',
  madhab: string = 'Shafi'
): NextPrayerInfo {
  const now = new Date();
  const coordinates = new Coordinates(lat, lon);
  const calculationMethod = METHOD_MAP[method] || METHOD_MAP['MWL'];

  if (madhab === 'Hanafi') {
    calculationMethod.madhab = MADHAB_MAP['Hanafi'];
  }

  const prayerTimes = new PrayerTimes(coordinates, now, calculationMethod);

  // Get all prayer times for today
  const prayers = [
    { name: 'Fajr', time: prayerTimes.fajr },
    { name: 'Chourouq', time: prayerTimes.sunrise },
    { name: 'Dhuhr', time: prayerTimes.dhuhr },
    { name: 'Asr', time: prayerTimes.asr },
    { name: 'Maghrib', time: prayerTimes.maghrib },
    { name: 'Isha', time: prayerTimes.isha },
  ];

  // Find next prayer
  let nextPrayer = prayers.find(p => p.time > now);

  // If no prayer left today, get Fajr for tomorrow
  if (!nextPrayer) {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowTimes = new PrayerTimes(coordinates, tomorrow, calculationMethod);
    nextPrayer = { name: 'Fajr', time: tomorrowTimes.fajr };
  }

  // Calculate countdown
  const diffMs = nextPrayer.time.getTime() - now.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  const countdown = `${String(diffHours).padStart(2, '0')}:${String(diffMinutes).padStart(2, '0')}:${String(diffSeconds).padStart(2, '0')}`;

  logger.debug(`Next prayer: ${nextPrayer.name} at ${nextPrayer.time.toLocaleTimeString('fr-FR')}`);

  return {
    name: nextPrayer.name,
    time: nextPrayer.time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    countdown,
    countdownSeconds: Math.floor(diffMs / 1000),
  };
}

/**
 * Get current prayer (the one that should be performed now)
 * @param lat - Latitude
 * @param lon - Longitude
 * @param method - Calculation method
 * @param madhab - Madhab
 * @returns Current prayer name
 */
export function getCurrentPrayer(
  lat: number,
  lon: number,
  method: string = 'MWL',
  madhab: string = 'Shafi'
): string {
  const now = new Date();
  const coordinates = new Coordinates(lat, lon);
  const calculationMethod = METHOD_MAP[method] || METHOD_MAP['MWL'];

  if (madhab === 'Hanafi') {
    calculationMethod.madhab = MADHAB_MAP['Hanafi'];
  }

  const prayerTimes = new PrayerTimes(coordinates, now, calculationMethod);

  if (now >= prayerTimes.fajr && now < prayerTimes.sunrise) return 'Fajr';
  if (now >= prayerTimes.sunrise && now < prayerTimes.dhuhr) return 'Chourouq';
  if (now >= prayerTimes.dhuhr && now < prayerTimes.asr) return 'Dhuhr';
  if (now >= prayerTimes.asr && now < prayerTimes.maghrib) return 'Asr';
  if (now >= prayerTimes.maghrib && now < prayerTimes.isha) return 'Maghrib';
  if (now >= prayerTimes.isha || now < prayerTimes.fajr) return 'Isha';

  return 'Unknown';
}

/**
 * Get Sunnah prayer times (Tahajjud, Duha)
 * @param lat - Latitude
 * @param lon - Longitude
 * @param date - Date
 * @param method - Calculation method
 * @returns Sunnah prayer times
 */
export function getSunnahTimes(
  lat: number,
  lon: number,
  date: Date = new Date(),
  method: string = 'MWL'
): { tahajjud: string; duha: string; lastThird: string } {
  const coordinates = new Coordinates(lat, lon);
  const calculationMethod = METHOD_MAP[method] || METHOD_MAP['MWL'];
  const prayerTimes = new PrayerTimes(coordinates, date, calculationMethod);
  const sunnahTimes = new SunnahTimes(prayerTimes);

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  return {
    tahajjud: formatTime(sunnahTimes.lastThirdOfTheNight),
    duha: formatTime(sunnahTimes.duha),
    lastThird: formatTime(sunnahTimes.lastThirdOfTheNight),
  };
}

export default {
  getPrayerTimes,
  getMonthlyPrayerTimes,
  getNextPrayer,
  getCurrentPrayer,
  getSunnahTimes,
};
