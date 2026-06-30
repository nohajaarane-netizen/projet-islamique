import React from 'react';

const GOLD = '#C8A84B';
const GOLD_LIGHT = '#E0C870';

/**
 * Motif géométrique islamique intégré (filigrane discret derrière le contenu).
 */
const BannerPattern = ({ opacity = 0.07 }: { opacity?: number }) => (
  <svg
    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <pattern id="page-banner-pattern" x="0" y="0" width="64" height="64" patternUnits="userSpaceOnUse">
        <rect x="8" y="8" width="48" height="48" fill="none" stroke={GOLD} strokeWidth="0.55" opacity={opacity} />
        <rect x="8" y="8" width="48" height="48" fill="none" stroke={GOLD} strokeWidth="0.55" opacity={opacity} transform="rotate(45 32 32)" />
        <circle cx="32" cy="32" r="9" fill="none" stroke={GOLD} strokeWidth="0.45" opacity={opacity * 0.7} />
        <circle cx="32" cy="32" r="2" fill={GOLD} opacity={opacity * 0.5} />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#page-banner-pattern)" />
  </svg>
);

interface PageBannerProps {
  /** Titre principal de la page (grand). */
  title: string;
  /** Sous-titre / description sur une ligne (optionnel). */
  subtitle?: string;
  /** Petit label doré en majuscules au-dessus du titre (optionnel). */
  eyebrow?: string;
  /** Élément placé en haut, côté fin de ligne (ex: pastille localisation, bouton +). */
  badge?: React.ReactNode;
  /** Marge basse (défaut 24px). */
  marginBottom?: number;
}

/**
 * Bannière de page UNIFIÉE — identique sur toutes les pages.
 *
 * Structure fixe : photo de mosquée en fond, dégradé vert sombre, ligne dorée
 * en haut, motif islamique, et un bloc de titre aligné côté lecture (droite en
 * arabe, gauche en latin) avec une barre dorée. Hauteur constante pour garantir
 * la cohérence visuelle d'une page à l'autre.
 */
const PageBanner: React.FC<PageBannerProps> = ({
  title,
  subtitle,
  eyebrow,
  badge,
  marginBottom = 24,
}) => (
  <div
    style={{
      position: 'relative',
      overflow: 'hidden',
      borderRadius: 20,
      marginBottom,
      minHeight: 160,
      padding: '34px 40px',
      display: 'flex',
      alignItems: 'center',
      backgroundImage: `linear-gradient(105deg, rgba(8,20,13,0.93) 0%, rgba(18,44,30,0.80) 42%, rgba(24,54,38,0.42) 72%, rgba(26,58,40,0.20) 100%), url('${import.meta.env.BASE_URL}photomosquee.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center 32%',
      border: '1px solid rgba(200,168,75,0.18)',
      boxShadow: '0 6px 28px rgba(0,0,0,0.22)',
    }}
  >
    {/* Ligne dorée supérieure */}
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        background: `linear-gradient(90deg, transparent, ${GOLD} 20%, ${GOLD_LIGHT} 50%, ${GOLD} 80%, transparent)`,
      }}
    />
    <BannerPattern />

    {/* Badge optionnel — coin haut, côté fin de ligne */}
    {badge && (
      <div style={{ position: 'absolute', top: 18, insetInlineEnd: 24, zIndex: 2 }}>
        {badge}
      </div>
    )}

    {/* Bloc titre — barre dorée + eyebrow + titre + sous-titre */}
    <div
      style={{
        position: 'relative',
        zIndex: 1,
        borderInlineStart: `3px solid ${GOLD}`,
        paddingInlineStart: 18,
        maxWidth: 600,
      }}
    >
      {eyebrow && (
        <p
          style={{
            margin: '0 0 9px',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: GOLD_LIGHT,
          }}
        >
          {eyebrow}
        </p>
      )}
      <h1
        style={{
          margin: 0,
          fontSize: 'clamp(24px, 4vw, 34px)',
          fontWeight: 800,
          color: '#FFFFFF',
          lineHeight: 1.15,
          letterSpacing: '-0.01em',
          fontFamily: "'Cairo', sans-serif",
          textShadow: '0 2px 12px rgba(0,0,0,0.35)',
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          style={{
            margin: '11px 0 0',
            fontSize: 13.5,
            color: 'rgba(255,255,255,0.72)',
            lineHeight: 1.6,
            maxWidth: 540,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  </div>
);

export default PageBanner;
