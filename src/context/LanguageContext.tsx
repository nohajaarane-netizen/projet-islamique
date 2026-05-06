
import React, { createContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

type Language = 'fr' | 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'en' || saved === 'ar' ? saved : 'fr') as Language;
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    i18n.changeLanguage(language);
    if (language === 'ar') {
      document.body.dir = 'rtl';
      document.body.classList.add('rtl');
    } else {
      document.body.dir = 'ltr';
      document.body.classList.remove('rtl');
    }
  }, [language, i18n]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export { LanguageContext };