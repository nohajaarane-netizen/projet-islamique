import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

/**
 * FICHIER DE CONFIGURATION i18n
 * 
 * Structure :
 *   resources.{langue}.translation.{section}.{sous-section}
 * 
 * Pour modifier un texte :
 *   1. Trouver la clé correspondante (ex: "nav_accueil")
 *   2. Changer la valeur dans la langue souhaitée (fr, en, ar)
 * 
 * Pour ajouter une nouvelle langue :
 *   1. Copier tout le bloc d'une langue existante (par exemple "fr")
 *   2. Renommer le code de la langue (ex: "es" pour espagnol)
 *   3. Traduire toutes les valeurs
 *   4. Ne pas modifier les clés (les parties à gauche du ":")
 */

i18n.use(initReactI18next).init({
  resources: {
    // -------------------- FRANÇAIS --------------------
    fr: {
      translation: {
        // MENU PRINCIPAL
        nav_accueil: "Accueil",
        nav_salat: "SalatTracker",
        nav_alhamdulillah: "Alhamdulillah",
        nav_hadith: "Hadith & Du'a",
        nav_asma: "AsmaUlHusna",
        nav_horaires: "Horaires",
        nav_qibla: "Qibla",
        nav_meteo: "Météo",
        nav_favoris: "Mes favoris",
        nav_evenements: "Événements",
        nav_reglages: "Réglages",

        // PAGE D'ACCUEIL (Hero)
        welcome: "Assalamu Alaykum !",
        hero_title: "Ta lumière spirituelle quotidienne",
        hero_desc: "Avance chaque jour vers Allah avec des outils pensés pour ton cœur et ton esprit.",
        btn_start: "▶ Commencer",
        btn_explore: "✦ Explorer",
        next_prayer: "Prochaine prière",
        remaining: "Restant",
        today: "Aujourd'hui",
        qibla_compass: "Boussole Qibla",
        direction: "Direction",
        my_position: "Ma position",

        // CARTES STATISTIQUES
        stats: {
          prayers_today: "Prières aujourd'hui",
          current_streak: "Série actuelle",
          dhikr_today: "Dhikr aujourd'hui",
          spiritual_score: "Score spirituel",
          completed: "Accomplies",
          days: "jours",
          repetitions: "répétitions",
          excellent: "Excellent"
        },

        // OUTILS SPIRITUELS
        tools: {
          salat_title: "SalatTracker",
          salat_desc: "Suis tes prières\net rappels intelligents",
          alhamd_title: "Alhamdulillah",
          alhamd_desc: "Compteur de gratitude\net bienfaits",
          hadith_title: "Hadith & Du'a",
          hadith_desc: "Hadiths authentiques\net invocations",
          asma_title: "AsmaUlHusna",
          asma_desc: "Les 99 Noms d'Allah\net leurs significations"
        },

        berrechid: " Berrechid, Maroc",

        // ÉVÉNEMENTS
        event_dua_title: "Dua Tawwassoul",
        event_dua_date: "24 Mai 2025 • 17:30",
        event_dua_location: "Convention City",
        event_ramadan_title: "Ramadan Prep",
        event_ramadan_date: "31 Mai 2025 • 17:30",
        event_ramadan_location: "Convention City",
        event_conf_title: "Conférence Islamique",
        event_conf_date: "07 Juin 2025 • 10:00",
        event_conf_location: "Centre Culturel",

        // SECTIONS GÉNÉRALES
        spiritual_tools: "Outils spirituels",
        see_all: "Voir tout",
        open: "Ouvrir",
        prayer_times: "Horaires des prières",
        upcoming_events: "Événements à venir",
        hadith_of_day: "Hadith du jour",
        weather: "Météo",
        partly_cloudy: "Partiellement nuageux",
        feels_like: "Ressenti",
        humidity: "Humidité",
        wind: "Vent",
        asma_progress: "Progression AsmaUlHusna",
        names_learned: "Noms appris",
        the_most_merciful: "Le Tout Miséricordieux",
        see_full_list: "Voir la liste complète",

        // JOURS DE LA SEMAINE
        days: {
          saturday: "Samedi",
          sunday: "Dimanche",
          monday: "Lundi",
          tuesday: "Mardi",
          wednesday: "Mercredi",
          thursday: "Jeudi",
          friday: "Vendredi"
        },

        // SALAT TRACKER
        salat: {
          title: "Suivi des prières",
          subtitle: "Suivez vos prières quotidiennes",
          today_progress: "Progression aujourd'hui",
          missed: "Manquées",
          mark: "Marquer",
          completed_action: "Accomplie",
          mark_action: "Marquer",
          today_prayers: "Prières aujourd'hui",
          streak: "Série actuelle",
          badges: "Badges",
          fajr: "Fajr",
          dhuhr: "Dhuhr",
          asr: "Asr",
          maghrib: "Maghrib",
          isha: "Isha"
        },

        // ALHAMDULILLAH
        alhamd: {
          title: "Alhamdulillah",
          subtitle: "Cultivez la gratitude au quotidien.",
          placeholder: "Aujourd'hui, je suis reconnaissant pour...",
          save: "Enregistrer",
          total: "Total bénédictions",
          streak: "Série actuelle (jours)",
          export: "Exporter CSV",
          category: "Catégorie",
          new_category: "Nouvelle catégorie",
          empty: "Aucune gratitude enregistrée."
        },

        // HADITH & DU'A
        hadith: {
          title: "Hadith & Du'a",
          subtitle: "Nourrissez votre cœur avec les paroles du Prophète et les invocations.",
          search_placeholder: "Rechercher un hadith, une invocation...",
          tabs_hadith: "Hadiths",
          tabs_dua: "Du'as",
          tabs_asma: "AsmaUlHusna",
          no_result: "Aucun résultat",
          asma_placeholder: "Voir la page dédiée AsmaUlHusna pour les 99 noms."
        },

        // ASMAUL HUSNA
        asma: {
          title: "AsmaUlHusna — Les 99 noms d'Allah",
          subtitle: "Apprenez et méditez les noms divins.",
          search_placeholder: "Rechercher un nom..."
        },

        // HORAIRES
        horaires: {
          title: "Horaires des prières",
          subtitle: "Planifiez votre journée autour des prières (Berrechid, Maroc)",
          day: "Jour",
          fajr: "Fajr",
          dhuhr: "Dhuhr",
          asr: "Asr",
          maghrib: "Maghrib",
          isha: "Isha"
        },

        // QIBLA (avec nouvelles clés pour la boussole interactive)
        qibla: {
          title: "Direction de la Qibla",
          subtitle: "Trouvez la direction de la Kaaba.",
          north: "⬆️ Nord",
          north_east: "↗️ Nord-Est",
          east: "➡️ Est",
          south_east: "↘️ Sud-Est",
          south: "⬇️ Sud",
          south_west: "↙️ Sud-Ouest",
          west: "⬅️ Ouest",
          north_west: "↖️ Nord-Ouest",
          instruction: "Tournez votre appareil pour que l'aiguille verte pointe vers le sud-ouest (245°).",
          unsupported: "Orientation non supportée sur ce navigateur.",
          // Clés ajoutées pour la demande de permission (iOS)
          permission_denied: "Permission refusée pour l'orientation",   // ✅ AJOUT
          permission_error: "Erreur lors de la demande de permission",  // ✅ AJOUT
          allow_permission: "Autoriser l'orientation"                   // ✅ AJOUT
        },

        // MÉTÉO (toutes les clés utilisées dans Meteo.tsx sont ici)
        meteo: {
          title: "Météo",
          feels_like: "Ressenti",
          humidity: "Humidité",
          wind: "Vent",
          loading: "Chargement météo...",
          missing_key: "Clé API météo manquante",
          error: "Erreur chargement météo",
          geo_denied: "Géolocalisation refusée",
          day_sat: "Sam",
          day_sun: "Dim",
          day_mon: "Lun",
          day_tue: "Mar",
          day_wed: "Mer"
        },

        // FAVORIS
        favoris: {
          title: "Mes favoris",
          subtitle: "Gardez vos invocations, hadiths ou noms préférés.",
          add_placeholder: "Nouveau favori...",
          add_button: "Ajouter",
          empty: "Aucun favori. Ajoutez-en un !"
        },

        // ÉVÉNEMENTS
        evenements: {
          title: "Événements",
          add: "Ajouter",
          no_events: "Aucun événement",
          title_label: "Titre",
          date_label: "Date",
          time_label: "Heure",
          location_label: "Lieu"
        },

        // RÉGLAGES
        reglages: {
          title: "Réglages",
          name: "Nom complet",
          notifications: "Notifications de prière",
          dark_mode: "Mode sombre (expérimental)",
          reset: "Réinitialiser toutes les données"
        },

        // TEXTES COMMUNS
        common: {
          save: "Enregistrer",
          cancel: "Annuler",
          delete: "Supprimer",
          search: "Rechercher",
          add: "Ajouter",
          yes: "Oui",
          no: "Non"
        }
      }
    },

    // -------------------- ANGLAIS --------------------
    en: {
      translation: {
        nav_accueil: "Home",
        nav_salat: "Prayer Tracker",
        nav_alhamdulillah: "Alhamdulillah",
        nav_hadith: "Hadith & Du'a",
        nav_asma: "AsmaUlHusna",
        nav_horaires: "Prayer Times",
        nav_qibla: "Qibla",
        nav_meteo: "Weather",
        nav_favoris: "My Favorites",
        nav_evenements: "Events",
        nav_reglages: "Settings",

        welcome: "Assalamu alaykum 👋",
        hero_title: "Your daily spiritual light",
        hero_desc: "Move closer to Allah each day with tools designed for your heart and mind.",
        btn_start: "▶ Start",
        btn_explore: "✦ Explore",
        next_prayer: "Next prayer",
        remaining: "Remaining",
        today: "Today",
        qibla_compass: "Qibla Compass",
        direction: "Direction",
        my_position: "My position",

        stats: {
          prayers_today: "Prayers today",
          current_streak: "Current streak",
          dhikr_today: "Dhikr today",
          spiritual_score: "Spiritual score",
          completed: "Completed",
          days: "days",
          repetitions: "repetitions",
          excellent: "Excellent"
        },

        tools: {
          salat_title: "SalatTracker",
          salat_desc: "Track your prayers\nwith smart reminders",
          alhamd_title: "Alhamdulillah",
          alhamd_desc: "Gratitude counter\nand blessings",
          hadith_title: "Hadith & Du'a",
          hadith_desc: "Authentic hadiths\nand supplications",
          asma_title: "AsmaUlHusna",
          asma_desc: "The 99 Names of Allah\nand their meanings"
        },

        berrechid: "📍 Berrechid, Morocco",

        event_dua_title: "Dua Tawwassoul",
        event_dua_date: "May 24, 2025 • 17:30",
        event_dua_location: "Convention City",
        event_ramadan_title: "Ramadan Prep",
        event_ramadan_date: "May 31, 2025 • 17:30",
        event_ramadan_location: "Convention City",
        event_conf_title: "Islamic Conference",
        event_conf_date: "Jun 07, 2025 • 10:00",
        event_conf_location: "Cultural Center",

        spiritual_tools: "Spiritual tools",
        see_all: "See all",
        open: "Open",
        prayer_times: "Prayer times",
        upcoming_events: "Upcoming events",
        hadith_of_day: "Hadith of the day",
        weather: "Weather",
        partly_cloudy: "Partly cloudy",
        feels_like: "Feels like",
        humidity: "Humidity",
        wind: "Wind",
        asma_progress: "AsmaUlHusna progress",
        names_learned: "Names learned",
        the_most_merciful: "The Most Merciful",
        see_full_list: "See full list",

        days: {
          saturday: "Saturday",
          sunday: "Sunday",
          monday: "Monday",
          tuesday: "Tuesday",
          wednesday: "Wednesday",
          thursday: "Thursday",
          friday: "Friday"
        },

        salat: {
          title: "Prayer Tracker",
          subtitle: "Track your daily prayers",
          today_progress: "Today's progress",
          missed: "Missed",
          mark: "Mark",
          completed_action: "Done",
          mark_action: "Mark",
          today_prayers: "Today's prayers",
          streak: "Current streak",
          badges: "Badges",
          fajr: "Fajr",
          dhuhr: "Dhuhr",
          asr: "Asr",
          maghrib: "Maghrib",
          isha: "Isha"
        },

        alhamd: {
          title: "Alhamdulillah",
          subtitle: "Cultivate gratitude daily.",
          placeholder: "Today I am grateful for...",
          save: "Save",
          total: "Total blessings",
          streak: "Current streak (days)",
          export: "Export CSV",
          category: "Category",
          new_category: "New category",
          empty: "No gratitude recorded."
        },

        hadith: {
          title: "Hadith & Du'a",
          subtitle: "Nourish your heart with the words of the Prophet and authentic invocations.",
          search_placeholder: "Search for a hadith, invocation...",
          tabs_hadith: "Hadiths",
          tabs_dua: "Du'as",
          tabs_asma: "AsmaUlHusna",
          no_result: "No result",
          asma_placeholder: "See the dedicated AsmaUlHusna page for the 99 names."
        },

        asma: {
          title: "AsmaUlHusna — The 99 Names of Allah",
          subtitle: "Learn and meditate the divine names.",
          search_placeholder: "Search for a name..."
        },

        horaires: {
          title: "Prayer Times",
          subtitle: "Plan your day around prayers (Berrechid, Morocco)",
          day: "Day",
          fajr: "Fajr",
          dhuhr: "Dhuhr",
          asr: "Asr",
          maghrib: "Maghrib",
          isha: "Isha"
        },

        qibla: {
          title: "Qibla Direction",
          subtitle: "Find the direction of the Kaaba.",
          north: "⬆️ North",
          north_east: "↗️ North-East",
          east: "➡️ East",
          south_east: "↘️ South-East",
          south: "⬇️ South",
          south_west: "↙️ South-West",
          west: "⬅️ West",
          north_west: "↖️ North-West",
          instruction: "Turn your device to point the green needle towards south-west (245°).",
          unsupported: "Orientation not supported on this browser.",
          permission_denied: "Orientation permission denied",       // ✅ AJOUT
          permission_error: "Error requesting permission",          // ✅ AJOUT
          allow_permission: "Allow orientation"                    // ✅ AJOUT
        },

        meteo: {
          title: "Weather",
          feels_like: "Feels like",
          humidity: "Humidity",
          wind: "Wind",
          loading: "Loading weather...",
          missing_key: "Missing weather API key",
          error: "Error loading weather",
          geo_denied: "Geolocation denied",
          day_sat: "Sat",
          day_sun: "Sun",
          day_mon: "Mon",
          day_tue: "Tue",
          day_wed: "Wed"
        },

        favoris: {
          title: "My Favorites",
          subtitle: "Keep your favorite invocations, hadiths or names.",
          add_placeholder: "New favorite...",
          add_button: "Add",
          empty: "No favorites. Add one!"
        },

        evenements: {
          title: "Events",
          add: "Add",
          no_events: "No events",
          title_label: "Title",
          date_label: "Date",
          time_label: "Time",
          location_label: "Location"
        },

        reglages: {
          title: "Settings",
          name: "Full name",
          notifications: "Prayer notifications",
          dark_mode: "Dark mode (experimental)",
          reset: "Reset all data"
        },

        common: {
          save: "Save",
          cancel: "Cancel",
          delete: "Delete",
          search: "Search",
          add: "Add",
          yes: "Yes",
          no: "No"
        }
      }
    },

    // -------------------- ARABE --------------------
    ar: {
      translation: {
        nav_accueil: "الرئيسية",
        nav_salat: "تتبع الصلاة",
        nav_alhamdulillah: "الحمد لله",
        nav_hadith: "الحديث والدعاء",
        nav_asma: "أسماء الله الحسنى",
        nav_horaires: "مواقيت الصلاة",
        nav_qibla: "القبلة",
        nav_meteo: "الطقس",
        nav_favoris: "المفضلة",
        nav_evenements: "الأحداث",
        nav_reglages: "الإعدادات",

        welcome: "السلام عليكم 👋",
        hero_title: "نورك الروحي اليومي",
        hero_desc: "تقدم كل يوم نحو الله بأدوات صممت لقلبك وروحك.",
        btn_start: "▶ ابدأ",
        btn_explore: "✦ استكشف",
        next_prayer: "الصلاة القادمة",
        remaining: "المتبقي",
        today: "اليوم",
        qibla_compass: "بوصلة القبلة",
        direction: "الاتجاه",
        my_position: "موقعي",

        stats: {
          prayers_today: "صلوات اليوم",
          current_streak: "السلسلة الحالية",
          dhikr_today: "الذكر اليوم",
          spiritual_score: "الدرجة الروحية",
          completed: "مؤداة",
          days: "أيام",
          repetitions: "تكرارات",
          excellent: "ممتاز"
        },

        tools: {
          salat_title: "تتبع الصلاة",
          salat_desc: "تتبع صلواتك\nمع تذكيرات ذكية",
          alhamd_title: "الحمد لله",
          alhamd_desc: "عداد الامتنان\nوالنعم",
          hadith_title: "الحديث والدعاء",
          hadith_desc: "أحاديث صحيحة\nوأدعية",
          asma_title: "أسماء الله الحسنى",
          asma_desc: "أسماء الله الـ 99\nومعانيها"
        },

        berrechid: "📍 برشيد، المغرب",

        event_dua_title: "دعاء التوسل",
        event_dua_date: "24 مايو 2025 • 17:30",
        event_dua_location: "Convention City",
        event_ramadan_title: "الاستعداد لرمضان",
        event_ramadan_date: "31 مايو 2025 • 17:30",
        event_ramadan_location: "Convention City",
        event_conf_title: "المؤتمر الإسلامي",
        event_conf_date: "07 يونيو 2025 • 10:00",
        event_conf_location: "المركز الثقافي",

        spiritual_tools: "الأدوات الروحية",
        see_all: "عرض الكل",
        open: "فتح",
        prayer_times: "مواقيت الصلاة",
        upcoming_events: "الأحداث القادمة",
        hadith_of_day: "حديث اليوم",
        weather: "الطقس",
        partly_cloudy: "غائم جزئياً",
        feels_like: "ملمس الحرارة",
        humidity: "الرطوبة",
        wind: "الرياح",
        asma_progress: "تقدم أسماء الله الحسنى",
        names_learned: "الأسماء المتعلمة",
        the_most_merciful: "الرحمن",
        see_full_list: "عرض القائمة الكاملة",

        days: {
          saturday: "السبت",
          sunday: "الأحد",
          monday: "الاثنين",
          tuesday: "الثلاثاء",
          wednesday: "الأربعاء",
          thursday: "الخميس",
          friday: "الجمعة"
        },

        salat: {
          title: "تتبع الصلاة",
          subtitle: "تتبع صلواتك اليومية",
          today_progress: "تقدم اليوم",
          missed: "فائتة",
          mark: "تسجيل",
          completed_action: "مؤداة",
          mark_action: "تسجيل",
          today_prayers: "صلوات اليوم",
          streak: "السلسلة الحالية",
          badges: "الشارات",
          fajr: "الفجر",
          dhuhr: "الظهر",
          asr: "العصر",
          maghrib: "المغرب",
          isha: "العشاء"
        },

        alhamd: {
          title: "الحمد لله",
          subtitle: "زرع الامتنان يوميًا.",
          placeholder: "اليوم أنا ممتن لـ...",
          save: "حفظ",
          total: "إجمالي النعم",
          streak: "السلسلة الحالية (أيام)",
          export: "تصدير CSV",
          category: "الفئة",
          new_category: "فئة جديدة",
          empty: "لم يتم تسجيل أي نعمة."
        },

        hadith: {
          title: "الحديث والدعاء",
          subtitle: "غذِّ قلبك بكلمات النبي والأدعية الصحيحة.",
          search_placeholder: "ابحث عن حديث، دعاء...",
          tabs_hadith: "أحاديث",
          tabs_dua: "أدعية",
          tabs_asma: "أسماء الله الحسنى",
          no_result: "لا توجد نتائج",
          asma_placeholder: "انظر صفحة أسماء الله الحسنى المخصصة للأسماء الـ 99."
        },

        asma: {
          title: "أسماء الله الحسنى — 99 اسماً",
          subtitle: "تعلم وأتأمل الأسماء الإلهية.",
          search_placeholder: "ابحث عن اسم..."
        },

        horaires: {
          title: "مواقيت الصلاة",
          subtitle: "خطط ليومك حول أوقات الصلاة (برشيد، المغرب)",
          day: "اليوم",
          fajr: "الفجر",
          dhuhr: "الظهر",
          asr: "العصر",
          maghrib: "المغرب",
          isha: "العشاء"
        },

        qibla: {
          title: "اتجاه القبلة",
          subtitle: "ابحث عن اتجاه الكعبة.",
          north: "⬆️ شمال",
          north_east: "↗️ شمال شرق",
          east: "➡️ شرق",
          south_east: "↘️ جنوب شرق",
          south: "⬇️ جنوب",
          south_west: "↙️ جنوب غرب",
          west: "⬅️ غرب",
          north_west: "↖️ شمال غرب",
          instruction: "أدر جهازك بحيث يشير الإبرة الخضراء نحو الجنوب الغربي (245 درجة).",
          unsupported: "الاتجاه غير مدعوم على هذا المتصفح.",
          permission_denied: "تم رفض إذن الاتجاه",        // ✅ AJOUT
          permission_error: "خطأ في طلب الإذن",          // ✅ AJOUT
          allow_permission: "السماح بالاتجاه"            // ✅ AJOUT
        },

        meteo: {
          title: "الطقس",
          feels_like: "درجة الحرارة المحسوسة",
          humidity: "الرطوبة",
          wind: "الرياح",
          loading: "جاري تحميل الطقس...",
          missing_key: "مفتاح API الطقس مفقود",
          error: "خطأ في تحميل الطقس",
          geo_denied: "تم رفض تحديد الموقع",
          day_sat: "السبت",
          day_sun: "الأحد",
          day_mon: "الاثنين",
          day_tue: "الثلاثاء",
          day_wed: "الأربعاء"
        },

        favoris: {
          title: "المفضلة",
          subtitle: "احتفظ بدعواتك أو أحاديثك أو أسمائك المفضلة.",
          add_placeholder: "مفضلة جديدة...",
          add_button: "إضافة",
          empty: "لا توجد مفضلات. أضف واحدة!"
        },

        evenements: {
          title: "الأحداث",
          add: "إضافة",
          no_events: "لا توجد أحداث",
          title_label: "العنوان",
          date_label: "التاريخ",
          time_label: "الوقت",
          location_label: "المكان"
        },

        reglages: {
          title: "الإعدادات",
          name: "الاسم الكامل",
          notifications: "إشعارات الصلاة",
          dark_mode: "الوضع المظلم (تجريبي)",
          reset: "إعادة تعيين جميع البيانات"
        },

        common: {
          save: "حفظ",
          cancel: "إلغاء",
          delete: "حذف",
          search: "بحث",
          add: "إضافة",
          yes: "نعم",
          no: "لا"
        }
      }
    }
  },
  lng: "fr",               // langue par défaut
  fallbackLng: "fr",       // langue de repli si une clé est manquante
  interpolation: {
    escapeValue: false     // React échappe déjà les valeurs
  }
});

export default i18n;