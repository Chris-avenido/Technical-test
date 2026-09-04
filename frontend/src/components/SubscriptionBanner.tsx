'use client';

import React from 'react';
import { useI18n } from '../i18n/I18nContext';
import { Lock, Sparkles, Shield, CheckCircle2 } from 'lucide-react';

interface SubscriptionBannerProps {
  onSubscribe: () => void;
  subscribing: boolean;
}

export const SubscriptionBanner: React.FC<SubscriptionBannerProps> = ({
  onSubscribe,
  subscribing,
}) => {
  const { t } = useI18n();

  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent p-4 sm:p-6 md:p-8 backdrop-blur">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold tracking-wide">
            <Lock className="w-3.5 h-3.5 shrink-0" />
            <span>{t.lockedNutritionTitle}</span>
          </div>
          <h4 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">
            {t.lockedNutritionDesc}
          </h4>
          <div className="flex flex-col xs:flex-row flex-wrap items-start xs:items-center gap-2 sm:gap-4 text-xs text-zinc-600 dark:text-zinc-400 pt-1">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Macronutrient & Energy breakdown</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Nutri-Score calculation & grades</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Full ingredient & allergen analysis</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto shrink-0">
          <button
            onClick={onSubscribe}
            disabled={subscribing}
            className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{subscribing ? t.subscribing : t.subscribeButton}</span>
          </button>
          <div className="flex items-center justify-center sm:justify-end gap-1.5 text-[11px] text-zinc-400 dark:text-zinc-500">
            <Shield className="w-3.5 h-3.5 shrink-0" />
            <span>Secured by Stripe Checkout (Test Mode)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
