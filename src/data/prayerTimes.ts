import { PrayerTime } from '../types';

export const PRAYER_TIMES: PrayerTime[] = [
  { name: "Fajr",    time: "05:15", completed: true  },
  { name: "Dhuhr",   time: "12:45", completed: true  },
  { name: "Asr",     time: "16:30", isCurrent: true  },
  { name: "Maghrib", time: "19:35"                   },
  { name: "Isha",    time: "20:55"                   },
];