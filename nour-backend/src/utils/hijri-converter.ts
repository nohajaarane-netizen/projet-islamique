/**
 * Hijri Date Converter and Moon Phase Calculator
 * Converts Gregorian dates to Hijri and calculates moon phases
 */
import type { SupportedLanguage } from '../types/language.js';
import { logger } from './logger';

// Hijri month names in different languages avec type correct
const HIJRI_MONTHS: Record<SupportedLanguage, string[]> = {
  fr: [
    'Muharram', 'Safar', 'Rabi\' al-Awwal', 'Rabi\' al-Thani',
    'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Sha\'ban',
    'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'
  ],
  en: [
    'Muharram', 'Safar', 'Rabi\' al-Awwal', 'Rabi\' al-Thani',
    'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Sha\'ban',
    'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'
  ],
  ar: [
    'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني',
    'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان',
    'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
  ]
};

// Approximate Hijri epoch (July 16, 622 CE)
const HIJRI_EPOCH = 1948440; // Julian day number

/**
 * Convert Gregorian date to approximate Hijri date
 * Uses the standard astronomical approximation formula
 * @param date - Gregorian Date object
 * @returns Hijri date information
 */
export function gregorianToHijri(date: Date): {
  day: number;
  month: number;
  year: number;
  monthName: Record<SupportedLanguage, string>;
  formatted: Record<SupportedLanguage, string>;
} {
  const gregorianYear = date.getFullYear();
  const gregorianMonth = date.getMonth() + 1;
  const gregorianDay = date.getDate();

  // Julian day number calculation
  let julianDay: number;

  if (gregorianMonth > 2) {
    julianDay = gregorianDay + Math.floor((153 * (gregorianMonth - 3) + 2) / 5) + 365 * gregorianYear + 
                Math.floor(gregorianYear / 4) - Math.floor(gregorianYear / 100) + Math.floor(gregorianYear / 400) - 32045;
  } else {
    const adjustedYear = gregorianYear - 1;
    julianDay = gregorianDay + Math.floor((153 * (gregorianMonth + 9) + 2) / 5) + 365 * adjustedYear + 
                Math.floor(adjustedYear / 4) - Math.floor(adjustedYear / 100) + Math.floor(adjustedYear / 400) - 32045;
  }

  // Days since Hijri epoch
  const daysSinceEpoch = julianDay - HIJRI_EPOCH;

  // Approximate Hijri year (354.36707 days per Hijri year)
  const hijriYear = Math.floor((daysSinceEpoch - 1) / 354.36707) + 1;

  // Days into current Hijri year
  const daysIntoYear = daysSinceEpoch - Math.floor((hijriYear - 1) * 354.36707);

  // Determine month (approximate 29.5 days per month)
  let hijriMonth = 1;
  let remainingDays = daysIntoYear;

  const monthLengths = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29]; // Approximate

  for (let i = 0; i < 12; i++) {
    if (remainingDays <= monthLengths[i]) {
      hijriMonth = i + 1;
      break;
    }
    remainingDays -= monthLengths[i];
  }

  const hijriDay = Math.max(1, Math.min(30, Math.floor(remainingDays)));

  // Get month names - avec assertion de type
  const monthNames: Record<SupportedLanguage, string> = {
    fr: HIJRI_MONTHS.fr[hijriMonth - 1],
    en: HIJRI_MONTHS.en[hijriMonth - 1],
    ar: HIJRI_MONTHS.ar[hijriMonth - 1]
  };

  // Format in different languages
  const formatted: Record<SupportedLanguage, string> = {
    fr: `${hijriDay} ${monthNames.fr} ${hijriYear} H`,
    en: `${hijriDay} ${monthNames.en} ${hijriYear} AH`,
    ar: `${hijriDay} ${monthNames.ar} ${hijriYear} هـ`,
  };

  if (logger && logger.debug) {
    logger.debug(`Converted ${date.toISOString()} to Hijri: ${formatted.fr}`);
  }

  return {
    day: hijriDay,
    month: hijriMonth,
    year: hijriYear,
    monthName: monthNames,
    formatted,
  };
}

/**
 * Calculate moon phase for a given date
 * @param date - Date to calculate moon phase for
 * @returns Moon phase information
 */
export function calculateMoonPhase(date: Date): {
  phase: string;
  phaseEn: string;
  phaseAr: string;
  illumination: number;
  age: number;
} {
  // Known new moon: January 6, 2000 at 18:14 UTC
  const knownNewMoon = new Date(Date.UTC(2000, 0, 6, 18, 14, 0));
  const synodicMonth = 29.53058867; // Days in a lunar month

  // Days since known new moon
  const diffTime = date.getTime() - knownNewMoon.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  // Current lunar age (0 to synodicMonth)
  let lunarAge = diffDays % synodicMonth;
  if (lunarAge < 0) lunarAge += synodicMonth;

  // Moon illumination percentage (0 = new moon, 1 = full moon)
  const illumination = (1 - Math.cos((lunarAge / synodicMonth) * 2 * Math.PI)) / 2;

  // Determine phase
  let phase: string;
  let phaseEn: string;
  let phaseAr: string;

  if (lunarAge < 1) {
    phase = 'Nouvelle lune';
    phaseEn = 'New Moon';
    phaseAr = 'هلال جديد';
  } else if (lunarAge < 7.4) {
    phase = 'Premier croissant';
    phaseEn = 'Waxing Crescent';
    phaseAr = 'هلال متزايد';
  } else if (lunarAge < 8.4) {
    phase = 'Premier quartier';
    phaseEn = 'First Quarter';
    phaseAr = 'تربيع أول';
  } else if (lunarAge < 14.8) {
    phase = 'Lune gibbeuse croissante';
    phaseEn = 'Waxing Gibbous';
    phaseAr = 'أحدب متزايد';
  } else if (lunarAge < 15.8) {
    phase = 'Pleine lune';
    phaseEn = 'Full Moon';
    phaseAr = 'بدر';
  } else if (lunarAge < 22.1) {
    phase = 'Lune gibbeuse décroissante';
    phaseEn = 'Waning Gibbous';
    phaseAr = 'أحدب متناقص';
  } else if (lunarAge < 23.1) {
    phase = 'Dernier quartier';
    phaseEn = 'Last Quarter';
    phaseAr = 'تربيع ثاني';
  } else if (lunarAge < 29.5) {
    phase = 'Dernier croissant';
    phaseEn = 'Waning Crescent';
    phaseAr = 'هلال متناقص';
  } else {
    phase = 'Nouvelle lune';
    phaseEn = 'New Moon';
    phaseAr = 'هلال جديد';
  }

  if (logger && logger.debug) {
    logger.debug(`Moon phase for ${date.toISOString()}: ${phase}, age: ${lunarAge.toFixed(1)} days`);
  }

  return {
    phase,
    phaseEn,
    phaseAr,
    illumination: Math.round(illumination * 100),
    age: Math.round(lunarAge * 10) / 10,
  };
}

/**
 * Get formatted Hijri date string
 * @param date - Gregorian date
 * @param language - Language code (fr/en/ar)
 * @returns Formatted Hijri date
 */
export function getHijriDateString(date: Date, language: SupportedLanguage = 'fr'): string {
  const hijri = gregorianToHijri(date);
  return hijri.formatted[language] || hijri.formatted.fr;
}

/**
 * Check if date is during Ramadan
 * @param date - Date to check
 * @returns Boolean indicating if date is in Ramadan
 */
export function isRamadan(date: Date): boolean {
  const hijri = gregorianToHijri(date);
  return hijri.month === 9; // Ramadan is the 9th month
}

/**
 * Get days until next Ramadan
 * @param date - Current date
 * @returns Days until Ramadan starts
 */
export function daysUntilRamadan(date: Date): number {
  // Create a copy of the date
  let ramadanStartApprox = new Date(date);
  
  // Move forward day by day until we find Ramadan
  let days = 0;
  let maxDays = 365; // Safety limit
  
  while (!isRamadan(ramadanStartApprox) && days < maxDays) {
    ramadanStartApprox.setDate(ramadanStartApprox.getDate() + 1);
    days++;
  }
  
  return days;
}

/**
 * Get Islamic day of week (Friday is special in Islam)
 * @param date - Date to check
 * @returns Islamic day information
 */
export function getIslamicDayOfWeek(date: Date): {
  dayOfWeek: number;
  name: Record<SupportedLanguage, string>;
  isJummah: boolean;
} {
  const daysOfWeek: Record<SupportedLanguage, string[]> = {
    fr: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    ar: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
  };
  
  const dayIndex = date.getDay();
  const isJummah = dayIndex === 5; // Friday (5 in JavaScript getDay)
  
  const name: Record<SupportedLanguage, string> = {
    fr: daysOfWeek.fr[dayIndex],
    en: daysOfWeek.en[dayIndex],
    ar: daysOfWeek.ar[dayIndex]
  };
  
  return {
    dayOfWeek: dayIndex,
    name,
    isJummah
  };
}

// Exporter le type pour utilisation externe
export type { SupportedLanguage };

export default {
  gregorianToHijri,
  calculateMoonPhase,
  getHijriDateString,
  isRamadan,
  daysUntilRamadan,
  getIslamicDayOfWeek,
};