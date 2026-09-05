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
    <div className="relative overflow-hidden rounded-3xl border border-[#FDE6D2] dark:border-amber-900/40 bg-[#FFF9F2] dark:bg-amber-950/20 p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
        {/* Left: Text & Features List */}
        <div className="space-y-3.5 max-w-md text-left w-full">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF0DC] dark:bg-amber-900/40 text-[#C05621] dark:text-amber-400 text-xs font-bold tracking-wide border border-amber-300/40">
            <Lock className="w-3.5 h-3.5 shrink-0" />
            <span>{t.lockedNutritionTitle}</span>
          </div>

          <h4 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
            {t.lockedNutritionDesc}
          </h4>

          <div className="space-y-2 pt-1 text-xs text-zinc-700 dark:text-zinc-300 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Macronutrient & Energy breakdown</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Nutri-Score calculation & grades</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Full ingredient & allergen analysis</span>
            </div>
          </div>
        </div>

        {/* Center: Mint Circular Disc Graphic with Tilted Sheet & 3D Padlock */}
        <div className="flex items-center justify-center shrink-0 my-2 lg:my-0">
          <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-[#E5F7EE] dark:bg-emerald-950/40 relative flex items-center justify-center shadow-inner">
            {/* Sparkle star accents */}
            <span className="absolute top-3 left-4 text-emerald-500/80 text-sm select-none">✦</span>
            <span className="absolute bottom-4 right-5 text-emerald-500/80 text-xs select-none">✦</span>
            <span className="absolute top-5 right-7 text-emerald-400/60 text-[10px] select-none">✦</span>

            {/* Tilted Nutrition Facts sheet */}
            <div className="w-28 sm:w-32 bg-white dark:bg-zinc-800 rounded-xl shadow-md border border-zinc-200/90 dark:border-zinc-700 p-2.5 transform -rotate-6 transition-transform select-none">
              <div className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-zinc-900 dark:text-zinc-100 border-b border-zinc-900 dark:border-zinc-100 pb-0.5 mb-1 flex justify-between items-center">
                <span>Nutrition Facts</span>
              </div>
              <div className="space-y-0.5 text-[7px] sm:text-[7.5px] text-zinc-600 dark:text-zinc-400 font-mono">
                <div className="flex justify-between font-bold text-zinc-900 dark:text-zinc-200 border-b border-zinc-100 dark:border-zinc-700/60 pb-0.5">
                  <span>Calories</span>
                  <span>250 kcal</span>
                </div>
                <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-700/60 py-0.5">
                  <span>Total Fat</span>
                  <span>12g</span>
                </div>
                <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-700/60 py-0.5">
                  <span>Carbohydrates</span>
                  <span>34g</span>
                </div>
                <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-700/60 py-0.5">
                  <span>Dietary Fiber</span>
                  <span>4g</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span>Protein</span>
                  <span>8g</span>
                </div>
              </div>
            </div>

            {/* Overlaid 3D Padlock on bottom right */}
            <div className="absolute -bottom-1 -right-1 sm:bottom-0 sm:right-0 flex flex-col items-center">
              {/* Metallic Silver Shackle */}
              <div className="w-5 h-5 border-[2.5px] border-slate-300 dark:border-slate-400 rounded-t-full -mb-1 shadow-sm" />
              {/* Slate Lock Body */}
              <div className="w-9 h-8 bg-gradient-to-b from-slate-700 to-slate-900 rounded-lg shadow-lg border border-slate-600 flex items-center justify-center">
                {/* Keyhole */}
                <div className="w-1.5 h-2 bg-slate-950 rounded-full border-t border-slate-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Right: CTA Button & Security Badge */}
        <div className="flex flex-col items-center lg:items-end gap-2.5 w-full lg:w-auto shrink-0">
          <button
            onClick={onSubscribe}
            disabled={subscribing}
            className="w-full sm:w-auto px-6 sm:px-7 py-3 rounded-xl bg-[#009668] hover:bg-[#008259] active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{subscribing ? t.subscribing : t.subscribeButton}</span>
          </button>
          <div className="flex items-center justify-center lg:justify-end gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
            <Shield className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span>Secured by Stripe Checkout (Test Mode)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
