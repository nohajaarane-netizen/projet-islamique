import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    fr: {
      translation: {
        "nav_accueil": "Accueil",
        "nav_salat": "SalatTracker",
        "nav_alhamd": "Alhamdulillah",
        "nav_hadith": "Hadith & Du'a",
        "nav_asma": "AsmaUlHusna",
        "nav_horaires": "Horaires",
        "nav_qibla": "Qibla",
        "nav_meteo": "Météo",
        "nav_favoris": "Mes favoris",
        "nav_evenements": "Événements",
        "nav_reglages": "Réglages",
        "welcome": "Assalamu alaykum 👋"
      }
    },
    en: {
      translation: {
        "nav_accueil": "Home",
        "nav_salat": "Prayer Tracker",
        "nav_alhamd": "Alhamdulillah",
        "nav_hadith": "Hadith & Du'a",
        "nav_asma": "AsmaUlHusna",
        "nav_horaires": "Prayer Times",
        "nav_qibla": "Qibla",
        "nav_meteo": "Weather",
        "nav_favoris": "Favorites",
        "nav_evenements": "Events",
        "nav_reglages": "Settings",
        "welcome": "Assalamu alaykum 👋"
      }
    },
    ar: {
      translation: {
        "nav_accueil": "الرئيسية",
        "nav_salat": "تتبع الصلاة",
        "nav_alhamd": "الحمد لله",
        "nav_hadith": "الحديث والدعاء",
        "nav_asma": "أسماء الله الحسنى",
        "nav_horaires": "مواقيت الصلاة",
        "nav_qibla": "القبلة",
        "nav_meteo": "الطقس",
        "nav_favoris": "المفضلة",
        "nav_evenements": "الأحداث",
        "nav_reglages": "الإعدادات",
        "welcome": "السلام عليكم 👋"
      }
    }
  },
  lng: "fr",
  fallbackLng: "fr",
  interpolation: { escapeValue: false }
});

export default i18n;