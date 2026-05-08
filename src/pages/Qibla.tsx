import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../theme/colors';
import { GiCompass } from 'react-icons/gi';

export default function Qibla() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const C = theme === 'light' ? lightTheme : darkTheme;

  // Direction réelle de la Qibla depuis Berrechid (angle en degrés par rapport au nord)
  const qiblaAngle = 245;

  const [heading, setHeading] = useState<number | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Demander la permission sur iOS
  const requestPermission = async () => {
    if (typeof DeviceOrientationEvent !== 'undefined' && 
        typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      // iOS : demande explicite
      try {
        const permissionState = await (DeviceOrientationEvent as any).requestPermission();
        if (permissionState === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation);
          setPermissionGranted(true);
        } else {
          setError(t('qibla.permission_denied', "Permission refusée"));
        }
      } catch (err) {
        setError(t('qibla.permission_error', "Erreur de permission"));
      }
    } else {
      // Android / autres : pas besoin de permission explicite
      window.addEventListener('deviceorientation', handleOrientation);
      setPermissionGranted(true);
    }
  };

  const handleOrientation = (event: DeviceOrientationEvent) => {
    // webkitCompassHeading est l’angle par rapport au nord (0° = nord)
    let compass = (event as any).webkitCompassHeading;
    if (compass === undefined) {
      // Fallback : calcul à partir de l'alpha (angle par rapport au nord)
      if (event.alpha !== null) {
        compass = 360 - event.alpha;
      } else {
        return;
      }
    }
    setHeading(compass);
  };

  useEffect(() => {
    // Vérifier si l’API est disponible
    if (!window.DeviceOrientationEvent) {
      setError(t('qibla.unsupported', "Orientation non supportée par ce navigateur"));
      return;
    }
    // Si ce n'est pas iOS, on écoute directement
    if (typeof (DeviceOrientationEvent as any).requestPermission !== 'function') {
      window.addEventListener('deviceorientation', handleOrientation);
      setPermissionGranted(true);
    }
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  // Calcule l’écart entre la direction de l’appareil et la Qibla
  const diff = heading !== null ? (qiblaAngle - heading + 360) % 360 : null;

  // Traduit l’angle en direction cardinale (pour l’affichage)
  const getDirectionName = (angle: number) => {
    if (angle < 22.5) return t('qibla.north');
    if (angle < 67.5) return t('qibla.north_east');
    if (angle < 112.5) return t('qibla.east');
    if (angle < 157.5) return t('qibla.south_east');
    if (angle < 202.5) return t('qibla.south');
    if (angle < 247.5) return t('qibla.south_west');
    if (angle < 292.5) return t('qibla.west');
    if (angle < 337.5) return t('qibla.north_west');
    return t('qibla.north');
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center' }}>
      <div style={{ background: C.cardBg, borderRadius: 24, padding: 24, border: `1px solid ${C.border}` }}>
        <h2 style={{ marginBottom: 8, color: C.textDark }}>{t('qibla.title')}</h2>
        <p style={{ marginBottom: 20, color: C.textMid }}>{t('qibla.subtitle')}</p>

        {!permissionGranted && !error && (
          <button
            onClick={requestPermission}
            style={{ padding: '10px 20px', background: C.green, color: 'white', border: 'none', borderRadius: 12, cursor: 'pointer' }}
          >
            {t('qibla.allow_permission', "Autoriser l’orientation")}
          </button>
        )}

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {permissionGranted && (
          <>
            <div style={{ margin: '20px 0', position: 'relative', display: 'inline-block' }}>
              {/* Icône de boussole qui tourne */}
              <GiCompass
                style={{
                  fontSize: '120px',
                  color: C.textDark,
                  transition: 'transform 0.1s linear',
                  transform: `rotate(${diff !== null ? diff : 0}deg)`
                }}
              />
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: 14,
                height: 14,
                borderRadius: '50%',
                backgroundColor: C.green,
                transform: 'translate(-50%, -50%)',
                border: `2px solid ${C.cardBg}`,
                boxShadow: '0 0 2px rgba(0,0,0,0.3)'
              }} />
              {/* Points cardinaux autour de l'icône */}
              <div style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', color: C.textDark, fontWeight: 'bold' }}>N</div>
              <div style={{ position: 'absolute', bottom: '-20px', left: '50%', transform: 'translateX(-50%)', color: C.textDark, fontWeight: 'bold' }}>S</div>
              <div style={{ position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)', color: C.textDark, fontWeight: 'bold' }}>W</div>
              <div style={{ position: 'absolute', right: '-20px', top: '50%', transform: 'translateY(-50%)', color: C.textDark, fontWeight: 'bold' }}>E</div>
            </div>
            <div style={{ marginTop: 16 }}>
              <p style={{ fontSize: 18, color: C.textDark }}>
                {diff !== null ? `${Math.round(diff)}°` : '---'}
              </p>
              <p style={{ fontSize: 16, color: C.green }}>
                {diff !== null ? getDirectionName(diff) : '---'}
              </p>
              <p style={{ fontSize: 12, color: C.textLight }}>
                {t('qibla.instruction', "Tournez votre appareil pour aligner l’aiguille verte sur 245° (sud-ouest)")}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}