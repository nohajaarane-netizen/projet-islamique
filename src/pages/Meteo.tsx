import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../theme/colors';
import axios from 'axios';
import { config } from '../config';

export default function Meteo() {
  const { t } = useTranslation();        // pour les traductions
  const { theme } = useTheme();
  const C = theme === 'light' ? lightTheme : darkTheme;

  // États : weather stocke les données, loading affiche un message de chargement, error gère les erreurs
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fonction pour récupérer la météo
    const fetchWeather = async () => {
      // 1. Vérifier que la clé API existe
      if (!config.OPENWEATHER_API_KEY || config.OPENWEATHER_API_KEY === "ta_clé_ici") {
        setError(t('meteo.missing_key', "Clé API manquante"));
        setLoading(false);
        return;
      }

      // 2. Demander la position géographique à l'utilisateur
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            // 3. Construire l'URL de l'API avec nos coordonnées
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=fr&appid=${config.OPENWEATHER_API_KEY}`;
            // 4. Envoyer la requête
            const response = await axios.get(url);
            // 5. Stocker les données reçues
            setWeather(response.data);
            setError('');
          } catch (err) {
            console.error(err);
            setError(t('meteo.error', "Erreur chargement météo"));
          } finally {
            setLoading(false);
          }
        },
        () => {
          // 6. Si l'utilisateur refuse la géolocalisation, on utilise Berrechid par défaut
          const defaultUrl = `https://api.openweathermap.org/data/2.5/weather?q=Berrechid,MA&units=metric&lang=fr&appid=${config.OPENWEATHER_API_KEY}`;
          axios.get(defaultUrl)
            .then(res => {
              setWeather(res.data);
              setError('');
            })
            .catch(() => setError(t('meteo.geo_denied', "Géolocalisation refusée")))
            .finally(() => setLoading(false));
        }
      );
    };

    fetchWeather();
  }, [t]);  // le tableau de dépendances : on relance si la langue change

  // Affichage pendant le chargement
  if (loading) return <div style={{ textAlign: 'center', padding: 40 }}>{t('meteo.loading')}</div>;
  // Affichage d'une erreur
  if (error) return <div style={{ textAlign: 'center', color: 'red' }}>{error}</div>;
  // Si pas de données, on ne rend rien
  if (!weather) return null;

  // Extraire les données utiles
  const temp = Math.round(weather.main.temp);
  const feelsLike = Math.round(weather.main.feels_like);
  const humidity = weather.main.humidity;
  const wind = weather.wind.speed;
  const condition = weather.weather[0].description;
  const city = weather.name;
  const country = weather.sys.country;

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <div style={{ background: C.cardBg, borderRadius: 24, padding: 24, border: `1px solid ${C.border}` }}>
        <h2 style={{ marginBottom: 8, color: C.textDark }}>{t('meteo.title')}</h2>
        <p style={{ marginBottom: 20, color: C.textMid }}>{city}, {country}</p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          {/* Tu pourras remplacer l'emoji par une icône dynamique plus tard */}
          <div style={{ fontSize: 60 }}>🌤️</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, fontWeight: 700, color: C.textDark }}>{temp}°C</div>
            <div style={{ color: C.textMid }}>{condition}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
          <div><strong>{t('meteo.feels_like')}</strong><br />{feelsLike}°C</div>
          <div><strong>{t('meteo.humidity')}</strong><br />{humidity}%</div>
          <div><strong>{t('meteo.wind')}</strong><br />{wind} km/h</div>
        </div>
      </div>
    </div>
  );
}