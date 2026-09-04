'use client';

import React from 'react';
import { useI18n } from '../i18n/I18nContext';
import { SupportedLanguage } from '../lib/types';
import { Globe } from 'lucide-react';

const LANGUAGES: { code: SupportedLanguage; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'nl', label: 'Nederlands', flag: '🇳🇱' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
];

export const LanguageSelector: React.FC = () => {
  const { lang, setLang } = useI18n();

  return (
    <div className="relative inline-flex items-center shrink-0">
      <div className="flex items-center gap-1 sm:gap-1.5 bg-white/80 dark:bg-zinc-800/80 backdrop-blur border border-zinc-200 dark:border-zinc-700 rounded-full px-2 sm:px-3 py-1 sm:py-1.5 shadow-sm">
        <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-500 dark:text-zinc-400 shrink-0" />
        <select
          aria-label="Select Language"
          value={lang}
          onChange={(e) => setLang(e.target.value as SupportedLanguage)}
          className="bg-transparent text-xs sm:text-sm font-medium text-zinc-800 dark:text-zinc-200 outline-none cursor-pointer pr-1"
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code} className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
              {l.flag} {l.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
