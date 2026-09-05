'use client';

import React from 'react';
import { useI18n } from '../i18n/I18nContext';
import { SupportedLanguage } from '../lib/types';
import { Globe, ChevronDown } from 'lucide-react';

const LANGUAGES: { code: SupportedLanguage; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'nl', label: 'Nederlands' },
  { code: 'de', label: 'Deutsch' },
  { code: 'fr', label: 'Français' },
];

export const LanguageSelector: React.FC = () => {
  const { lang, setLang } = useI18n();
  const currentLang = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  return (
    <div className="relative inline-flex items-center shrink-0">
      {/* Visual Pill UI matching reference design */}
      <div className="flex items-center gap-1.5 sm:gap-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full px-3 sm:px-3.5 py-1.5 sm:py-2 shadow-sm text-xs sm:text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors pointer-events-none">
        <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-500 dark:text-zinc-400 shrink-0" />
        <span className="truncate">{currentLang.label}</span>
        <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-400 dark:text-zinc-500 shrink-0 ml-0.5" />
      </div>

      {/* Full-pill interactive HTML select ensuring 100% accessibility, native interaction, and test compatibility */}
      <select
        aria-label="Select Language"
        value={lang}
        onChange={(e) => setLang(e.target.value as SupportedLanguage)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      >
        {LANGUAGES.map((l) => (
          <option
            key={l.code}
            value={l.code}
            className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
          >
            {l.label}
          </option>
        ))}
      </select>
    </div>
  );
};
