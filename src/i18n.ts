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
        nav_tasbih: "Tasbih",
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
          subtitle: "Planifiez votre journée autour des heures de prière",
          location: "Berrechid, Maroc",
          day: "Jour",
          loading: "Chargement des horaires...",
          error: "Impossible de récupérer les horaires",
          method: "Méthode de calcul",
          method_name: "MWL (Muslim World League)",
          location_label: "Localisation",
          fajr: "Fajr",
          fajr_sub: "Aube",
          dhuhr: "Dhuhr",
          dhuhr_sub: "Zénith",
          asr: "Asr",
          asr_sub: "Après-midi",
          maghrib: "Maghrib",
          maghrib_sub: "Coucher",
          isha: "Isha",
          isha_sub: "Nuit"
        },

        // QIBLA (avec nouvelles clés pour la boussole interactive)
        qibla: {
          title: "Direction de la Qibla",
          subtitle: "Trouvez la direction de la Kaaba.",
          north: "Nord",
          north_east: "Nord-Est",
          east: "Est",
          south_east: "Sud-Est",
          south: "Sud",
          south_west: "Sud-Ouest",
          west: "Ouest",
          north_west: "Nord-Ouest",
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
          day_wed: "Mer",
          subtitle: "Conditions météorologiques en temps réel",
          pressure: "Pression",
          next_prayer_label: "Prochaine prière",
          prayer_times_hint: "Consultez la page Horaires pour les détails",
          counsel_label: "Conseil islamique",
          counsel_verse: "« C'est Lui qui vous montre l'éclair, source de crainte et d'espoir. » — Coran 13:12",
          counsel_text: "La météo nous rappelle la grandeur d'Allah. Préparez-vous pour chaque prière, quelles que soient les conditions climatiques."
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
          reset: "Réinitialiser toutes les données",
          profile: "Profil",
          language: "Langue",
          prayer_notifs: "Notifications de prière",
          appearance: "Apparence",
          dark_mode_label: "Mode sombre",
          dark_mode_on: "Activé",
          dark_mode_off: "Désactivé",
          text_size: "Taille du texte",
          text_small: "Petit",
          text_large: "Grand",
          data: "Données",
          data_desc: "Supprimer toutes vos données locales et réinitialiser l'application.",
          name_label: "Nom",
          personalize: "Personnalisez votre expérience spirituelle",
          reset_confirm: "Réinitialiser toutes les données ? Cette action est irréversible."
        },

        // TASBIH
        tasbih: {
          title: "Tasbih",
          subtitle: "Compteur de Dhikr",
          quote: "« C'est par l'invocation d'Allah que les cœurs trouvent la paix. » — Coran 13:28",
          other: "Autre",
          reset: "Réinitialiser",
          cycles: "Cycles complétés",
          dhikr_today: "Dhikr aujourd'hui",
          guide_title: "Guide du Dhikr après la prière",
          subhanallah_meaning: "Gloire à Allah",
          alhamdulillah_meaning: "Louange à Allah",
          allahu_akbar_meaning: "Allah est le Plus Grand"
        },

        // ALHAMDULILLAH
        alhamd_extra: {
          journal_label: "Journal de Gratitude",
          quote: "« Chaque bienfait mérite d'être reconnu. »",
          verse_translation: "« Si vous êtes reconnaissants, Je vous accorderai certes davantage. »",
          total_entries: "Entrées totales",
          consecutive_days: "Jours consécutifs",
          categories: "Catégories",
          new_entry: "Nouvelle entrée",
          text_placeholder: "Aujourd'hui, je suis reconnaissant(e) pour...",
          category_label: "Catégorie",
          save_gratitude: "Enregistrer ma gratitude",
          my_entries: "Mes entrées",
          empty_all: "Aucune entrée pour le moment. Commencez par exprimer votre gratitude.",
          empty_category: "Aucune entrée dans cette catégorie.",
          filter_all: "Tous",
          cat_allah: "Allah",
          cat_foi: "Foi",
          cat_famille: "Famille",
          cat_sante: "Santé",
          cat_travail: "Travail",
          cat_autre: "Autre"
        },

        // HORAIRES EXTRA
        horaires_extra: {
          gregorian_date: "Date grégorienne",
          hijri_date: "Date hijri",
          my_location: "Ma localisation",
          permission_denied: "Permission refusée · Cliquer pour réessayer",
          today_label: "Aujourd'hui",
          next_prayer_in: "Prochaine prière dans",
          hours_mins_secs: "heures · minutes · secondes",
          month_schedule: "Horaires du mois",
          show_less: "Réduire",
          show_month: "Voir tout le mois",
          refresh: "Actualiser",
          footer: "Horaires calculés via API Aladhan · Méthode MWL · Position GPS réelle",
          in_progress: "En cours",
          next: "Suivante",
          locating: "Localisation en cours...",
          loading_schedule: "Chargement des horaires...",
          retry: "Réessayer"
        },

        // SALAT TRACKER EXTRA
        salat_extra: {
          prophet_said: "Le Prophète ﷺ a dit :",
          hadith_text: "« Le premier acte dont le serviteur devra rendre compte le Jour du Jugement sera la prière. »",
          hadith_source: "(Sunan an-Nasa'i 465)",
          today_label: "Aujourd'hui",
          completed_count: "accomplies",
          done: "Accomplie",
          missed_status: "Manquée",
          pending: "En attente",
          in_progress: "EN COURS",
          see_schedules: "Voir les horaires →",
          my_streak: "Ma série active",
          verse_patience: "« Cherchez de l'aide dans la patience et la prière. »",
          best_record: "Meilleur record",
          days_label: "jours",
          weekly_title: "Constance — 7 derniers jours",
          percent_prayers: "% de prières",
          month_overview: "Aperçu du mois",
          legend_none: "Aucune",
          legend_partial: "Partielle",
          legend_good: "Bonne",
          legend_complete: "Complète",
          sunnah_title: "Prières Sunnah & Nawafil",
          completed_plural: "accomplie",
          my_badges: "Mes badges",
          obtained: "obtenus",
          badge_dawn_label: "Lève-tôt",
          badge_dawn_desc: "7 jours de Fajr",
          badge_assidu_label: "Assidu",
          badge_assidu_desc: "10 jours consécutifs",
          badge_persevere_label: "Persévérant",
          badge_persevere_desc: "14 jours consécutifs",
          badge_perfect_label: "Parfait",
          badge_perfect_desc: "30 jours consécutifs",
          fajr_sub: "Aube",
          dhuhr_sub: "Zénith",
          asr_sub: "Après-midi",
          maghrib_sub: "Coucher",
          isha_sub: "Nuit"
        },

        // HADITH EXTRA
        hadith_extra: {
          prophetic_label: "Paroles prophétiques & Invocations",
          subtitle_hero: "Une lumière prophétique pour chaque instant de votre vie quotidienne.",
          hadith_of_day_label: "Hadith du Jour",
          search_placeholder: "Rechercher un hadith ou une invocation...",
          no_hadith: "Aucun hadith ne correspond à votre recherche.",
          no_dua: "Aucune invocation ne correspond à votre recherche.",
          tab_hadiths: "Hadiths",
          tab_duas: "Du'as",
          reflection: "Réflexion",
          nav_keyboard: "← → pour naviguer entre les noms",
          copy: "Copier",
          favorite: "Favori",
          filter_all: "Tous",
          theme_quotidien: "Quotidien",
          theme_protection: "Protection",
          theme_gratitude: "Gratitude",
          theme_foi: "Foi",
          theme_connaissance: "Connaissance",
          theme_famille: "Famille"
        },

        // ASMA EXTRA
        asma_extra: {
          names_badge: "99 Noms",
          daily_name: "Nom du Jour",
          search_ph: "Rechercher un nom...",
          learned_label: "Tم الحفظ",
          mark_learned: "Marquer comme appris",
          progress_label: "Votre Progression",
          filter_all: "Tous",
          filter_learned: "Appris",
          filter_to_learn: "À apprendre",
          filter_fav: "Favoris",
          stats_learned: "Appris",
          stats_remaining: "Restants",
          stats_favorites: "Favoris",
          explore_name: "Explorer ce nom",
          no_results: "Aucun nom trouvé pour votre recherche.",
          keyboard_hint: "← → pour naviguer entre les noms",
          verse_quote: "\"À Allah appartiennent les plus beaux noms. Invoquez-Le par eux.\" — Sourate Al-A'raf 7:180"
        },

        // FAVORIS EXTRA
        favoris_extra: {
          hero_subtitle: "Vos versets, dhikrs et duas préférés",
          add_btn: "Ajouter",
          close_btn: "Fermer",
          new_favorite: "Nouveau favori",
          text_label: "Texte",
          text_placeholder: "Entrez un verset, dhikr ou dua...",
          category_label: "Catégorie",
          save_btn: "Enregistrer dans les favoris",
          filter_all: "Tous",
          no_favorites: "Aucun favori enregistré",
          no_results: "Aucun résultat",
          add_first: "+ Ajouter mon premier favori",
          verse_quote: "« Souviens-toi de ton Seigneur en toi-même, avec humilité et crainte. » — Coran 7:205"
        },

        // EVENEMENTS EXTRA
        evenements_extra: {
          hero_subtitle: "Restez informé des prochains événements islamiques",
          add_btn: "Ajouter",
          close_btn: "Fermer",
          new_event: "Nouvel événement",
          title_label: "Titre",
          title_placeholder: "Titre de l'événement",
          date_label: "Date",
          time_label: "Heure",
          location_label: "Lieu",
          location_placeholder: "Lieu de l'événement",
          category_label: "Catégorie",
          save_event: "Enregistrer l'événement",
          no_events_title: "Aucun événement",
          no_events_desc: "Ajoutez votre premier événement islamique.",
          delete_confirm: "Supprimer cet événement ?"
        },

        // QIBLA EXTRA
        qibla_extra: {
          hero_title: "Boussole Qibla",
          hero_subtitle: "Trouvez la direction de la Kaaba depuis n'importe où dans le monde",
          use_my_location: "Utiliser ma position",
          calibrate: "Calibrer",
          compass_active: "Boussole active",
          compass_inactive: "Boussole inactive",
          activate_compass: "Activer la boussole",
          device_heading: "Cap appareil",
          my_current_pos: "Ma position actuelle",
          distance_kaaba: "Distance à la Kaaba",
          qibla_direction: "Direction Qibla",
          refresh_pos: "Actualiser la position",
          qibla_map: "Carte de la Qibla",
          you: "Vous",
          mecca: "Mecca",
          accuracy: "Précision",
          accuracy_high: "Élevée",
          accuracy_calc: "Calculée",
          tip: "Placez votre appareil à plat pour une meilleure précision. Éloignez-vous des objets métalliques.",
          default_pos: "Position par défaut (Berrechid) — géolocalisation refusée.",
          permission_denied_msg: "Permission refusée.",
          permission_error_msg: "Erreur de permission."
        },

        // TEXTES COMMUNS
        common: {
          save: "Enregistrer",
          cancel: "Annuler",
          delete: "Supprimer",
          search: "Rechercher",
          add: "Ajouter",
          yes: "Oui",
          no: "Non",
          page: "Page",
          retry: "Réessayer",
          loading: "Chargement...",
          daily_reminder: "Rappel du jour",
          donate: "Faire un don",
          sidebar_reminder: "« Allah a 99 noms, celui qui les connaît entrera au Paradis. »"
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
        nav_tasbih: "Tasbih",
        nav_reglages: "Settings",

        welcome: "Assalamu alaykum ",
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

        berrechid: "Berrechid, Morocco",

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
          north: "North",
          north_east: "↗ North-East",
          east: "East",
          south_east: "↘ South-East",
          south: "South",
          south_west: "↙ South-West",
          west: "West",
          north_west: "↖ North-West",
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
          day_wed: "Wed",
          subtitle: "Real-time weather conditions",
          pressure: "Pressure",
          next_prayer_label: "Next prayer",
          prayer_times_hint: "Check the Prayer Times page for details",
          counsel_label: "Islamic counsel",
          counsel_verse: '"It is He who shows you lightning, a source of fear and hope." — Quran 13:12',
          counsel_text: "The weather reminds us of the greatness of Allah. Prepare for every prayer, whatever the weather conditions."
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
          reset: "Reset all data",
          profile: "Profile",
          language: "Language",
          prayer_notifs: "Prayer Notifications",
          appearance: "Appearance",
          dark_mode_label: "Dark mode",
          dark_mode_on: "On",
          dark_mode_off: "Off",
          text_size: "Text size",
          text_small: "Small",
          text_large: "Large",
          data: "Data",
          data_desc: "Delete all local data and reset the application.",
          name_label: "Name",
          personalize: "Personalize your spiritual experience",
          reset_confirm: "Reset all data? This action is irreversible."
        },

        tasbih: {
          title: "Tasbih",
          subtitle: "Dhikr Counter",
          quote: "\"It is by the remembrance of Allah that hearts find peace.\" — Quran 13:28",
          other: "Other",
          reset: "Reset",
          cycles: "Completed cycles",
          dhikr_today: "Dhikr today",
          guide_title: "Post-prayer Dhikr Guide",
          subhanallah_meaning: "Glory to Allah",
          alhamdulillah_meaning: "Praise be to Allah",
          allahu_akbar_meaning: "Allah is the Greatest"
        },

        alhamd_extra: {
          journal_label: "Gratitude Journal",
          quote: "\"Every blessing deserves to be acknowledged.\"",
          verse_translation: "\"If you are grateful, I will certainly give you more.\"",
          total_entries: "Total entries",
          consecutive_days: "Consecutive days",
          categories: "Categories",
          new_entry: "New entry",
          text_placeholder: "Today, I am grateful for...",
          category_label: "Category",
          save_gratitude: "Save my gratitude",
          my_entries: "My entries",
          empty_all: "No entries yet. Start by expressing your gratitude.",
          empty_category: "No entries in this category.",
          filter_all: "All",
          cat_allah: "Allah",
          cat_foi: "Faith",
          cat_famille: "Family",
          cat_sante: "Health",
          cat_travail: "Work",
          cat_autre: "Other"
        },

        horaires_extra: {
          gregorian_date: "Gregorian date",
          hijri_date: "Hijri date",
          my_location: "My location",
          permission_denied: "Permission denied · Click to retry",
          today_label: "Today",
          next_prayer_in: "Next prayer in",
          hours_mins_secs: "hours · minutes · seconds",
          month_schedule: "Monthly schedule",
          show_less: "Show less",
          show_month: "Show full month",
          refresh: "Refresh",
          footer: "Times calculated via Aladhan API · MWL method · Real GPS position",
          in_progress: "Active",
          next: "Next",
          locating: "Locating...",
          loading_schedule: "Loading schedule...",
          retry: "Retry"
        },

        salat_extra: {
          prophet_said: "The Prophet ﷺ said:",
          hadith_text: "\"The first act that the servant will be accountable for on the Day of Judgment will be the prayer.\"",
          hadith_source: "(Sunan an-Nasa'i 465)",
          today_label: "Today",
          completed_count: "completed",
          done: "Done",
          missed_status: "Missed",
          pending: "Pending",
          in_progress: "IN PROGRESS",
          see_schedules: "View schedule →",
          my_streak: "My active streak",
          verse_patience: "\"Seek help through patience and prayer.\"",
          best_record: "Best record",
          days_label: "days",
          weekly_title: "Consistency — last 7 days",
          percent_prayers: "% of prayers",
          month_overview: "Month overview",
          legend_none: "None",
          legend_partial: "Partial",
          legend_good: "Good",
          legend_complete: "Complete",
          sunnah_title: "Sunnah & Nawafil Prayers",
          completed_plural: "completed",
          my_badges: "My badges",
          obtained: "obtained",
          badge_dawn_label: "Early Bird",
          badge_dawn_desc: "7 days of Fajr",
          badge_assidu_label: "Consistent",
          badge_assidu_desc: "10 consecutive days",
          badge_persevere_label: "Perseverant",
          badge_persevere_desc: "14 consecutive days",
          badge_perfect_label: "Perfect",
          badge_perfect_desc: "30 consecutive days",
          fajr_sub: "Dawn",
          dhuhr_sub: "Midday",
          asr_sub: "Afternoon",
          maghrib_sub: "Sunset",
          isha_sub: "Night"
        },

        hadith_extra: {
          prophetic_label: "Prophetic Words & Invocations",
          subtitle_hero: "A prophetic light for every moment of your daily life.",
          hadith_of_day_label: "Hadith of the Day",
          search_placeholder: "Search for a hadith or invocation...",
          no_hadith: "No hadith matches your search.",
          no_dua: "No invocation matches your search.",
          tab_hadiths: "Hadiths",
          tab_duas: "Du'as",
          reflection: "Reflection",
          nav_keyboard: "← → arrow keys to navigate",
          copy: "Copy",
          favorite: "Favorite",
          filter_all: "All",
          theme_quotidien: "Daily",
          theme_protection: "Protection",
          theme_gratitude: "Gratitude",
          theme_foi: "Faith",
          theme_connaissance: "Knowledge",
          theme_famille: "Family"
        },

        asma_extra: {
          names_badge: "99 Names",
          daily_name: "Name of the Day",
          search_ph: "Search a name...",
          learned_label: "Learned",
          mark_learned: "Mark as learned",
          progress_label: "Your Progress",
          filter_all: "All",
          filter_learned: "Learned",
          filter_to_learn: "To learn",
          filter_fav: "Favorites",
          stats_learned: "Learned",
          stats_remaining: "Remaining",
          stats_favorites: "Favorites",
          explore_name: "Explore this name",
          no_results: "No names found for your search.",
          keyboard_hint: "← → arrow keys to navigate",
          verse_quote: "\"To Allah belong the Most Beautiful Names, so call upon Him by them.\" — Al-A'raf 7:180"
        },

        favoris_extra: {
          hero_subtitle: "Your favorite verses, dhikrs and duas",
          add_btn: "Add",
          close_btn: "Close",
          new_favorite: "New favorite",
          text_label: "Text",
          text_placeholder: "Enter a verse, dhikr or dua...",
          category_label: "Category",
          save_btn: "Save to favorites",
          filter_all: "All",
          no_favorites: "No saved favorites",
          no_results: "No results",
          add_first: "+ Add my first favorite",
          verse_quote: "\"Remember your Lord within yourself, with humility and reverence.\" — Quran 7:205"
        },

        evenements_extra: {
          hero_subtitle: "Stay informed about upcoming Islamic events",
          add_btn: "Add",
          close_btn: "Close",
          new_event: "New Event",
          title_label: "Title",
          title_placeholder: "Event title",
          date_label: "Date",
          time_label: "Time",
          location_label: "Location",
          location_placeholder: "Event location",
          category_label: "Category",
          save_event: "Save event",
          no_events_title: "No events",
          no_events_desc: "Add your first Islamic event.",
          delete_confirm: "Delete this event?"
        },

        qibla_extra: {
          hero_title: "Qibla Compass",
          hero_subtitle: "Find the direction of the Kaaba from anywhere in the world",
          use_my_location: "Use my location",
          calibrate: "Calibrate",
          compass_active: "Compass active",
          compass_inactive: "Compass inactive",
          activate_compass: "Activate compass",
          device_heading: "Device heading",
          my_current_pos: "My current position",
          distance_kaaba: "Distance to Kaaba",
          qibla_direction: "Qibla direction",
          refresh_pos: "Refresh position",
          qibla_map: "Qibla Map",
          you: "You",
          mecca: "Mecca",
          accuracy: "Accuracy",
          accuracy_high: "High",
          accuracy_calc: "Calculated",
          tip: "Place your device flat for better accuracy. Stay away from metal objects.",
          default_pos: "Default position (Berrechid) — geolocation denied.",
          permission_denied_msg: "Permission denied.",
          permission_error_msg: "Permission error."
        },

        common: {
          save: "Save",
          cancel: "Cancel",
          delete: "Delete",
          search: "Search",
          add: "Add",
          yes: "Yes",
          no: "No",
          page: "Page",
          retry: "Retry",
          loading: "Loading...",
          daily_reminder: "Today's Reminder",
          donate: "Donate",
          sidebar_reminder: "« Allah has 99 names, whoever memorizes them will enter Paradise. »"
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
        nav_tasbih: "التسبيح",
        nav_reglages: "الإعدادات",

        welcome: "السلام عليكم",
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

        berrechid: "برشيد، المغرب",

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
          north: "شمال",
          north_east: "↗ شمال شرق",
          east: "شرق",
          south_east: "↘ جنوب شرق",
          south: "جنوب",
          south_west: "↙ جنوب غرب",
          west: "غرب",
          north_west: "↖ شمال غرب",
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
          day_wed: "الأربعاء",
          subtitle: "الأحوال الجوية في الوقت الفعلي",
          pressure: "الضغط",
          next_prayer_label: "الصلاة القادمة",
          prayer_times_hint: "راجع صفحة مواقيت الصلاة للتفاصيل",
          counsel_label: "نصيحة إسلامية",
          counsel_verse: "« هو الذي يريكم البرق خوفاً وطمعاً » — القرآن 13:12",
          counsel_text: "الطقس يذكرنا بعظمة الله. استعد لكل صلاة مهما كانت الأحوال الجوية."
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
          reset: "إعادة تعيين جميع البيانات",
          profile: "الملف الشخصي",
          language: "اللغة",
          prayer_notifs: "إشعارات الصلاة",
          appearance: "المظهر",
          dark_mode_label: "الوضع المظلم",
          dark_mode_on: "مفعّل",
          dark_mode_off: "غير مفعّل",
          text_size: "حجم النص",
          text_small: "صغير",
          text_large: "كبير",
          data: "البيانات",
          data_desc: "احذف جميع بياناتك المحلية وأعد تعيين التطبيق.",
          name_label: "الاسم",
          personalize: "خصص تجربتك الروحية",
          reset_confirm: "إعادة تعيين جميع البيانات؟ هذا الإجراء لا رجعة فيه."
        },

        tasbih: {
          title: "التسبيح",
          subtitle: "عداد الذكر",
          quote: "«أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ» — الرعد 28",
          other: "أخرى",
          reset: "إعادة تعيين",
          cycles: "الدورات المكتملة",
          dhikr_today: "الذكر اليوم",
          guide_title: "دليل الذكر بعد الصلاة",
          subhanallah_meaning: "تمجيد الله",
          alhamdulillah_meaning: "الحمد والشكر لله",
          allahu_akbar_meaning: "الله أكبر من كل شيء"
        },

        alhamd_extra: {
          journal_label: "مذكرة الامتنان",
          quote: "«كل نعمة تستحق الاعتراف بها.»",
          verse_translation: "«لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ»",
          total_entries: "إجمالي الإدخالات",
          consecutive_days: "أيام متتالية",
          categories: "الفئات",
          new_entry: "إدخال جديد",
          text_placeholder: "اليوم، أنا ممتنّ لـ...",
          category_label: "الفئة",
          save_gratitude: "حفظ امتناني",
          my_entries: "إدخالاتي",
          empty_all: "لا توجد إدخالات حتى الآن. ابدأ بالتعبير عن امتنانك.",
          empty_category: "لا توجد إدخالات في هذه الفئة.",
          filter_all: "الكل",
          cat_allah: "الله",
          cat_foi: "الإيمان",
          cat_famille: "الأسرة",
          cat_sante: "الصحة",
          cat_travail: "العمل",
          cat_autre: "أخرى"
        },

        horaires_extra: {
          gregorian_date: "التاريخ الميلادي",
          hijri_date: "التاريخ الهجري",
          my_location: "موقعي",
          permission_denied: "تم رفض الإذن · انقر للمحاولة مجدداً",
          today_label: "اليوم",
          next_prayer_in: "الصلاة القادمة في",
          hours_mins_secs: "ساعات · دقائق · ثواني",
          month_schedule: "مواقيت الشهر",
          show_less: "تقليص",
          show_month: "عرض الشهر كاملاً",
          refresh: "تحديث",
          footer: "الأوقات محسوبة عبر API Aladhan · طريقة MWL · موقع GPS حقيقي",
          in_progress: "جارٍ",
          next: "التالية",
          locating: "جاري تحديد الموقع...",
          loading_schedule: "جاري تحميل الأوقات...",
          retry: "إعادة المحاولة"
        },

        salat_extra: {
          prophet_said: "قال النبي ﷺ:",
          hadith_text: "«أول ما يحاسب به العبد يوم القيامة من عمله الصلاة.»",
          hadith_source: "(سنن النسائي 465)",
          today_label: "اليوم",
          completed_count: "مؤداة",
          done: "مؤداة",
          missed_status: "فائتة",
          pending: "في الانتظار",
          in_progress: "جارية",
          see_schedules: "عرض الأوقات →",
          my_streak: "سلسلتي الحالية",
          verse_patience: "«وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ»",
          best_record: "أفضل سجل",
          days_label: "أيام",
          weekly_title: "الانتظام — آخر 7 أيام",
          percent_prayers: "% الصلوات",
          month_overview: "نظرة الشهر",
          legend_none: "لا شيء",
          legend_partial: "جزئية",
          legend_good: "جيدة",
          legend_complete: "كاملة",
          sunnah_title: "صلوات السنة والنوافل",
          completed_plural: "مؤداة",
          my_badges: "شاراتي",
          obtained: "محققة",
          badge_dawn_label: "مبكر",
          badge_dawn_desc: "7 أيام من الفجر",
          badge_assidu_label: "منتظم",
          badge_assidu_desc: "10 أيام متتالية",
          badge_persevere_label: "مثابر",
          badge_persevere_desc: "14 يوماً متتالياً",
          badge_perfect_label: "مثالي",
          badge_perfect_desc: "30 يوماً متتالياً",
          fajr_sub: "الفجر",
          dhuhr_sub: "الظهيرة",
          asr_sub: "بعد الظهر",
          maghrib_sub: "الغروب",
          isha_sub: "الليل"
        },

        hadith_extra: {
          prophetic_label: "الكلمات النبوية والأدعية",
          subtitle_hero: "نور نبوي لكل لحظة من حياتك اليومية.",
          hadith_of_day_label: "حديث اليوم",
          search_placeholder: "ابحث عن حديث أو دعاء...",
          no_hadith: "لا يوجد حديث يتطابق مع بحثك.",
          no_dua: "لا توجد دعاء تتطابق مع بحثك.",
          tab_hadiths: "أحاديث",
          tab_duas: "أدعية",
          reflection: "تأمل",
          nav_keyboard: "← → للتنقل بين الأسماء",
          copy: "نسخ",
          favorite: "مفضلة",
          filter_all: "الكل",
          theme_quotidien: "يومي",
          theme_protection: "حماية",
          theme_gratitude: "شكر",
          theme_foi: "إيمان",
          theme_connaissance: "علم",
          theme_famille: "عائلة"
        },

        asma_extra: {
          names_badge: "٩٩ اسماً",
          daily_name: "اسم اليوم",
          search_ph: "ابحث عن اسم...",
          learned_label: "تم الحفظ",
          mark_learned: "حفظ",
          progress_label: "تقدمك",
          filter_all: "الكل",
          filter_learned: "محفوظة",
          filter_to_learn: "للتعلم",
          filter_fav: "المفضلة",
          stats_learned: "محفوظة",
          stats_remaining: "متبقية",
          stats_favorites: "مفضلة",
          explore_name: "استكشف الاسم",
          no_results: "لم يتم العثور على أسماء لبحثك.",
          keyboard_hint: "← → للتنقل بين الأسماء",
          verse_quote: "«وَلِلَّهِ الْأَسْمَاءُ الْحُسْنَى فَادْعُوهُ بِهَا» — الأعراف 180"
        },

        favoris_extra: {
          hero_subtitle: "آياتك وأذكارك وأدعيتك المفضلة",
          add_btn: "إضافة",
          close_btn: "إغلاق",
          new_favorite: "مفضلة جديدة",
          text_label: "النص",
          text_placeholder: "أدخل آية أو ذكراً أو دعاء...",
          category_label: "الفئة",
          save_btn: "حفظ في المفضلة",
          filter_all: "الكل",
          no_favorites: "لا توجد مفضلات محفوظة",
          no_results: "لا توجد نتائج",
          add_first: "+ إضافة مفضلتي الأولى",
          verse_quote: "«وَاذْكُر رَّبَّكَ فِي نَفْسِكَ تَضَرُّعًا وَخِيفَةً» — الأعراف 7:205"
        },

        evenements_extra: {
          hero_subtitle: "ابق على اطلاع بالأحداث الإسلامية القادمة",
          add_btn: "إضافة",
          close_btn: "إغلاق",
          new_event: "حدث جديد",
          title_label: "العنوان",
          title_placeholder: "عنوان الحدث",
          date_label: "التاريخ",
          time_label: "الوقت",
          location_label: "المكان",
          location_placeholder: "مكان الحدث",
          category_label: "الفئة",
          save_event: "حفظ الحدث",
          no_events_title: "لا توجد أحداث",
          no_events_desc: "أضف حدثك الإسلامي الأول.",
          delete_confirm: "حذف هذا الحدث؟"
        },

        qibla_extra: {
          hero_title: "بوصلة القبلة",
          hero_subtitle: "ابحث عن اتجاه الكعبة من أي مكان في العالم",
          use_my_location: "استخدام موقعي",
          calibrate: "معايرة",
          compass_active: "البوصلة نشطة",
          compass_inactive: "البوصلة غير نشطة",
          activate_compass: "تفعيل البوصلة",
          device_heading: "اتجاه الجهاز",
          my_current_pos: "موقعي الحالي",
          distance_kaaba: "المسافة إلى الكعبة",
          qibla_direction: "اتجاه القبلة",
          refresh_pos: "تحديث الموقع",
          qibla_map: "خريطة القبلة",
          you: "أنت",
          mecca: "مكة",
          accuracy: "الدقة",
          accuracy_high: "عالية",
          accuracy_calc: "محسوبة",
          tip: "ضع جهازك بشكل مستوٍ للحصول على دقة أفضل. ابتعد عن الأجسام المعدنية.",
          default_pos: "الموقع الافتراضي (برشيد) — تم رفض تحديد الموقع.",
          permission_denied_msg: "تم رفض الإذن.",
          permission_error_msg: "خطأ في الإذن."
        },

        common: {
          save: "حفظ",
          cancel: "إلغاء",
          delete: "حذف",
          search: "بحث",
          add: "إضافة",
          yes: "نعم",
          no: "لا",
          page: "صفحة",
          retry: "إعادة المحاولة",
          loading: "جاري التحميل...",
          daily_reminder: "تذكير اليوم",
          donate: "تبرع",
          sidebar_reminder: "« إن لله تسعة وتسعين اسما، من أحصاها دخل الجنة »"
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