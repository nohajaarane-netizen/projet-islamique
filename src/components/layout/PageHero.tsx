import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { useLanguage } from '../../hooks/useLanguage';
import { lightTheme, darkTheme } from '../../theme/colors';

interface PageHeroProps {
  badge?: string;
  title: string;
  subtitle?: string;
  arabicTitle?: string;
  arabicWatermark?: string;
}

const PageHero: React.FC<PageHeroProps> = ({
  badge,
  title,
  subtitle,
  arabicTitle,
  arabicWatermark,
}) => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const C = theme === 'light' ? lightTheme : darkTheme;

  return (
    <div
      style={{
        marginBottom: 32,
        paddingBottom: 24,
        borderBottom: `1px solid ${C.border}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Watermark text - Arabic behind everything */}
      {arabicWatermark && (
        <div
          style={{
            position: 'absolute',
            top: -20,
            right: language === 'ar' ? -40 : 'auto',
            left: language === 'ar' ? 'auto' : -40,
            fontSize: 96,
            fontWeight: 300,
            opacity: 0.04,
            whiteSpace: 'nowrap',
            zIndex: 0,
            fontFamily: ''Cairo', sans-serif',
          }}
        >
          {arabicWatermark}
        </div>
      )}

      {/* Content container */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Badge */}
        {badge && (
          <div
            style={{
              display: 'inline-block',
              backgroundColor: theme === 'light'
                ? 'rgba(184, 146, 42, 0.1)'
                : 'rgba(212, 168, 64, 0.15)',
              color: C.gold,
              padding: '6px 14px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: 0.5,
              textTransform: 'uppercase',
              marginBottom: 12,
              border: `1px solid ${theme === 'light'
                ? 'rgba(184, 146, 42, 0.2)'
                : 'rgba(212, 168, 64, 0.25)'}`,
            }}
          >
            {badge}
          </div>
        )}

        {/* Main title */}
        <h1
          style={{
            fontSize: 40,
            fontWeight: 700,
            color: C.textDark,
            margin: '8px 0 12px 0',
            lineHeight: 1.2,
          }}
        >
          {title}
        </h1>

        {/* Arabic title if provided */}
        {arabicTitle && language === 'ar' && (
          <h2
            style={{
              fontSize: 24,
              fontWeight: 600,
              color: C.gold,
              margin: '8px 0 0 0',
              lineHeight: 1.4,
            }}
          >
            {arabicTitle}
          </h2>
        )}

        {/* Subtitle */}
        {subtitle && (
          <p
            style={{
              fontSize: 15,
              color: C.textMid,
              margin: '12px 0 0 0',
              lineHeight: 1.5,
              maxWidth: 500,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* Decorative accent line */}
      <div
        style={{
          height: 3,
          width: 60,
          backgroundColor: C.gold,
          marginTop: 16,
          borderRadius: 2,
          position: 'relative',
          zIndex: 1,
        }}
      />
    </div>
  );
};

export default PageHero;
