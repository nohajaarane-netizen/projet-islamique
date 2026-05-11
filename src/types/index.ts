export interface PrayerTime {
  name: string;
  time: string;
  completed?: boolean;
  isCurrent?: boolean;
}

export interface StatCard {
  label: string;
  value: string;
  sub: string;
  icon?: string;
  progress?: number;
  iconBg: string;
}

export interface SpiritualTool {
  id: string;
  title: string;
  subtitle: string;
  icon?: string;
}

export interface AppEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category?: string;
  icon?: string;
}

export interface NavItem {
  id: string;
  label: string;
  icon?: string;
}
