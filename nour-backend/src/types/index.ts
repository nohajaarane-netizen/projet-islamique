/**
 * NOUR Backend - Core Type Definitions
 * Islamic Spiritual Companion API
 */

// ==================== USER TYPES ====================

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  preferredLang: 'fr' | 'en' | 'ar';
  locationLat?: number;
  locationLon?: number;
  cityName: string;
  timezone: string;
  darkMode: boolean;
  fontSize: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  preferredLang: string;
  cityName: string;
  timezone: string;
  darkMode: boolean;
  fontSize: number;
}

export interface UserSettings {
  preferredLang: 'fr' | 'en' | 'ar';
  darkMode: boolean;
  fontSize: number;
  locationLat?: number;
  locationLon?: number;
  cityName: string;
  timezone: string;
}

// ==================== AUTH TYPES ====================

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  preferredLang?: 'fr' | 'en' | 'ar';
  locationLat?: number;
  locationLon?: number;
  cityName?: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
  preferredLang: string;
  iat?: number;
  exp?: number;
}

// ==================== PRAYER TIME TYPES ====================

export interface PrayerTimeData {
  fajr: string;
  chourouq: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export interface DailyPrayerTimes {
  date: string;
  hijriDate: string;
  times: PrayerTimeData;
  moonPhase: string;
}

export interface MonthlyPrayerTimes {
  month: number;
  year: number;
  location: string;
  days: MonthlyDayEntry[];
}

export interface MonthlyDayEntry {
  date: string;
  dayName: string;
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export interface NextPrayerInfo {
  name: string;
  time: string;
  countdown: string;
  countdownSeconds: number;
}

export type CalculationMethod = 'MWL' | 'ISNA' | 'Egypt' | 'Makkah' | 'Karachi' | 'Tehran' | 'Jafari';
export type Madhab = 'Shafi' | 'Hanafi';

// ==================== TRACKER TYPES ====================

export interface PrayerTrackingEntry {
  id: string;
  prayerType: string;
  time: string;
  status: 'PENDING' | 'COMPLETED' | 'MISSED';
  completedAt?: Date;
}

export interface TodayTracking {
  date: string;
  prayers: PrayerTrackingEntry[];
  completedCount: number;
  totalCount: number;
}

export interface StreakInfo {
  currentStreak: number;
  bestRecord: number;
  streakType: string;
}

export interface ConstancyData {
  day: string;
  date: string;
  percentage: number;
  completed: number;
  total: number;
}

export interface HeatmapDay {
  date: string;
  day: number;
  score: 'Excellent' | 'Bonne' | 'Moyenne' | 'Faible' | 'Aucune';
  percentage: number;
}

export interface SunnahProgress {
  type: string;
  label: string;
  current: number;
  target: number;
  percentage: number;
}

export interface BadgeInfo {
  id: string;
  badgeType: string;
  label: string;
  description: string;
  earnedAt: Date;
  icon: string;
}

// ==================== ASMAULHUSNA TYPES ====================

export interface NameOfAllahDTO {
  id: number;
  orderNumber: number;
  arabic: string;
  transliteration: string;
  meaning: string;
  audioUrl?: string;
  isLearned: boolean;
  isFavorite: boolean;
}

export interface NameDetailDTO extends NameOfAllahDTO {
  reflection: string;
}

export interface AsmaProgress {
  total: number;
  learned: number;
  toLearn: number;
  favorites: number;
  percentage: number;
}

// ==================== HADITH & DUA TYPES ====================

export interface HadithDTO {
  id: string;
  arabicText: string;
  translation: string;
  transliteration?: string;
  sourceBook: string;
  sourceNumber: string;
  category: string;
  audioUrl?: string;
  isFavorite: boolean;
}

export interface DuaDTO {
  id: string;
  arabicText: string;
  translation: string;
  transliteration?: string;
  category: string;
  occasion?: string;
  audioUrl?: string;
  isFavorite: boolean;
}

export type ContentCategory = 'DAILY' | 'PROTECTION' | 'GRATITUDE' | 'PATIENCE' | 'FAITH' | 'REPENTANCE' | 'FAMILY' | 'TRAVEL' | 'KNOWLEDGE' | 'HEALTH';

// ==================== GRATITUDE TYPES ====================

export interface GratitudeEntryDTO {
  id: string;
  text: string;
  category: string;
  createdAt: Date;
}

export interface GratitudeStats {
  totalEntries: number;
  currentStreak: number;
  longestStreak: number;
}

export interface GratitudeTheme {
  category: string;
  count: number;
  percentage: number;
}

// ==================== DHIKR TYPES ====================

export interface DhikrCount {
  type: string;
  label: string;
  count: number;
  target: number;
}

export interface DailyDhikr {
  date: string;
  totalCount: number;
  byType: DhikrCount[];
}

// ==================== QIBLA TYPES ====================

export interface QiblaDirection {
  angle: number;
  direction: string;
  cardinalDirection: string;
  precision: 'élevée' | 'moyenne' | 'faible';
}

export interface QiblaInfo {
  direction: QiblaDirection;
  distance: number;
  distanceUnit: string;
  kaabaCoordinates: {
    lat: number;
    lon: number;
  };
}

export interface LocationInfo {
  city: string;
  country: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  localTime: string;
  timezone: string;
}

// ==================== WEATHER TYPES ====================

export interface WeatherCurrent {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  uvIndex: number;
  pressure: number;
  feelsLike: number;
}

export interface WeatherHourly {
  time: string;
  temp: number;
  condition: string;
  icon: string;
}

export interface WeatherDaily {
  date: string;
  dayName: string;
  condition: string;
  icon: string;
  maxTemp: number;
  minTemp: number;
}

export interface WeatherData {
  location: string;
  current: WeatherCurrent;
  hourly: WeatherHourly[];
  daily: WeatherDaily[];
}

// ==================== FAVORITE TYPES ====================

export interface FavoriteItem {
  id: string;
  contentType: 'HADITH' | 'DUA' | 'NAME';
  contentId: string;
  content: HadithDTO | DuaDTO | NameOfAllahDTO;
  createdAt: Date;
}

// ==================== NOTIFICATION TYPES ====================

export interface NotificationSettingDTO {
  prayerType: string;
  isEnabled: boolean;
  minutesBefore: number;
}

// ==================== EVENT TYPES ====================

export interface IslamicEvent {
  id: string;
  title: string;
  date: Date;
  time?: string;
  location?: string;
  description?: string;
  category: string;
}

// ==================== API RESPONSE TYPES ====================

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
  meta?: {
    timestamp: string;
    language: string;
    page?: number;
    limit?: number;
    total?: number;
  };
}

export interface ApiError {
  success: false;
  message: string;
  code: string;
  data: null;
  meta: {
    timestamp: string;
    language: string;
  };
}

// ==================== WEBSOCKET TYPES ====================

export interface PrayerCountdownUpdate {
  nextPrayer: string;
  time: string;
  countdown: string;
  countdownSeconds: number;
}

export interface PrayerAlert {
  prayer: string;
  time: string;
  minutesBefore: number;
  message: string;
}

// ==================== MOON PHASE ====================

export type MoonPhase = 
  | 'Nouvelle lune'
  | 'Premier croissant'
  | 'Premier quartier'
  | 'Lune gibbeuse croissante'
  | 'Pleine lune'
  | 'Lune gibbeuse décroissante'
  | 'Dernier quartier'
  | 'Dernier croissant';
