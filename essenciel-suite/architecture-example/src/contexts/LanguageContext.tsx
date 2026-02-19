import React, { createContext, useState } from 'react';
import { setLanguage as setI18nLanguage } from '../i18n';

export type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const LanguageContext =
  createContext<LanguageContextType>(
    {} as LanguageContextType
  );

export const LanguageProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [language, setLanguageState] =
    useState<Language>('fr');

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);     // 🔁 déclenche re-render
    setI18nLanguage(lang);      // 🌍 met à jour i18n
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
