'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLanguage } from '../lib/types';
import { translations, TranslationDictionary } from './translations';

interface I18nContextType {
  lang: SupportedLanguage;
  setLang: (newLang: SupportedLanguage) => void;
  t: TranslationDictionary;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<SupportedLanguage>('en');

  // Load saved language preference from localStorage if available
  useEffect(() => {
    const saved = localStorage.getItem('food_finder_lang') as SupportedLanguage | null;
    if (saved && (saved === 'en' || saved === 'nl' || saved === 'de' || saved === 'fr')) {
      setLangState(saved);
    }
  }, []);

  // Keep <html lang="..."> in sync with the active language for correct semantics & accessibility
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const setLang = (newLang: SupportedLanguage) => {
    setLangState(newLang);
    localStorage.setItem('food_finder_lang', newLang);
  };

  const t = translations[lang] || translations.en;

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
