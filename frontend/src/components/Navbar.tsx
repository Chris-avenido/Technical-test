'use client';

import React from 'react';
import { useI18n } from '../i18n/I18nContext';
import { LanguageSelector } from './LanguageSelector';
import { DemoUserStatus } from '../lib/types';
import { Sparkles, Utensils, ShieldCheck, ArrowUpRight } from 'lucide-react';

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
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-zinc-900/90 border-b border-zinc-200/80 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#009668] flex items-center justify-center text-white shadow-sm shrink-0">
            <Utensils className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="min-w-0 flex flex-col justify-center">
            <span className="text-base sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 truncate block leading-tight">
              {t.appName}
            </span>
            <a
              href="https://world.openfoodfacts.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] sm:text-xs font-semibold text-[#009668] dark:text-emerald-400 hover:underline inline-flex items-center gap-0.5 leading-none mt-0.5 shrink-0"
            >
              <span>Open Food Facts</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Subscription Action / Status Badge */}
          {isSubscribed ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-[#009668] dark:text-emerald-400 text-xs font-bold border border-emerald-500/20 shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="hidden sm:inline">{t.proSubscriber}</span>
              <span className="sm:hidden text-[11px] font-bold">PRO</span>
            </div>
          ) : (
            <button
              onClick={onSubscribeClick}
              disabled={subscribing}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#009668] hover:bg-[#008259] active:scale-95 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all disabled:opacity-50 cursor-pointer shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="hidden sm:inline">
                {subscribing ? t.subscribing : t.subscribeButton}
              </span>
              <span className="sm:hidden font-bold">
                {subscribing ? '...' : 'Pro'}
              </span>
            </button>
          )}

          {/* Language Selector Dropdown */}
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
};
