'use client';

import React from 'react';
import { useI18n } from '../i18n/I18nContext';
import { LanguageSelector } from './LanguageSelector';
import { DemoUserStatus } from '../lib/types';
import { Sparkles, Utensils, ShieldCheck, Lock } from 'lucide-react';

interface NavbarProps {
  userStatus: DemoUserStatus | null;
  onSubscribeClick: () => void;
  subscribing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  userStatus,
  onSubscribeClick,
  subscribing,
}) => {
  const { t } = useI18n();
  const isSubscribed = userStatus?.isSubscribed ?? false;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-zinc-900/80 border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Brand */}
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 shrink-0">
            <Utensils className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-base sm:text-xl font-bold tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-300 bg-clip-text text-transparent truncate block">
              {t.appName}
            </span>
            <span className="hidden md:inline-block text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              Open Food Facts
            </span>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Subscription Status Badge */}
          {isSubscribed ? (
            <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20 shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="hidden sm:inline">{t.proSubscriber}</span>
              <span className="sm:hidden text-[11px] font-bold">PRO</span>
            </div>
          ) : (
            <button
              onClick={onSubscribeClick}
              disabled={subscribing}
              className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-sm transition-all hover:shadow-emerald-500/20 active:scale-95 disabled:opacity-50 cursor-pointer shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">{subscribing ? t.subscribing : t.subscribeButton}</span>
              <span className="sm:hidden font-bold">{subscribing ? '...' : 'Pro'}</span>
            </button>
          )}

          {/* Language Selector Dropdown */}
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
};
