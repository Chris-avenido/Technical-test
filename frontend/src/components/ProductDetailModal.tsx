'use client';

import React, { useEffect, useState } from 'react';
import { useI18n } from '../i18n/I18nContext';
import { ProductSummary, ProductDetail } from '../lib/types';
import { getProductByCode } from '../lib/api';
import { NutritionTable } from './NutritionTable';
import { SubscriptionBanner } from './SubscriptionBanner';
import {
  X,
  Package,
  Barcode,
  Layers,
  Scale,
  Leaf,
  Activity,
  Lock,
  Loader2,
  FileText,
} from 'lucide-react';

interface ProductDetailModalProps {
  product: ProductSummary | null;
  onClose: () => void;
  onSubscribe: () => void;
  subscribing: boolean;
  refreshTrigger?: number;
}

const NUTRISCORE_COLORS: Record<string, { bg: string; text: string }> = {
  A: { bg: 'bg-[#038141]', text: 'text-white' },
  B: { bg: 'bg-[#85bb2f]', text: 'text-white' },
  C: { bg: 'bg-[#fecb02]', text: 'text-zinc-900' },
  D: { bg: 'bg-[#ee8100]', text: 'text-white' },
  E: { bg: 'bg-[#e63e11]', text: 'text-white' },
};

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onSubscribe,
  subscribing,
  refreshTrigger = 0,
}) => {
  const { lang, t } = useI18n();
  const [detail, setDetail] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!product) return;
    let isMounted = true;
    setLoading(true);

    getProductByCode(product.code, lang)
      .then((data) => {
        if (isMounted) {
          setDetail(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch product details:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [product, lang, refreshTrigger]);

  if (!product) return null;

  const nutriscore = (detail?.nutriscoreGrade || product.nutriscoreGrade)?.toUpperCase();
  const nutriscoreStyle = nutriscore && NUTRISCORE_COLORS[nutriscore]
    ? NUTRISCORE_COLORS[nutriscore]
    : { bg: 'bg-zinc-200 dark:bg-zinc-700', text: 'text-zinc-700 dark:text-zinc-200' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {detail?.brand || product.brand || t.brand}
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span className="text-xs font-mono text-zinc-400">#{product.code}</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label={t.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
          {/* Top Section: Photo + Core Meta */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Image Preview */}
            <div className="md:col-span-5 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-6 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-center min-h-[260px]">
              {product.imageUrl && !imageError ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  onError={() => setImageError(true)}
                  className="max-h-64 object-contain rounded-lg"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-zinc-400 gap-2">
                  <Package className="w-16 h-16 stroke-1" />
                  <span className="text-xs">Image unavailable</span>
                </div>
              )}
            </div>

            {/* Title & Key Attributes */}
            <div className="md:col-span-7 space-y-5">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
                  {detail?.name || product.name}
                </h2>
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mt-1">
                  {detail?.brand || product.brand}
                </p>
              </div>

              {/* Badges Bar (Nutri-Score, Eco-Score, NOVA) */}
              <div className="flex flex-wrap items-center gap-3">
                {nutriscore && (
                  <div
                    className={`px-3 py-1 rounded-xl text-xs font-black shadow-sm ${nutriscoreStyle.bg} ${nutriscoreStyle.text}`}
                  >
                    NUTRI-SCORE {nutriscore}
                  </div>
                )}
                {detail?.ecoscoreGrade && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    <Leaf className="w-3.5 h-3.5" />
                    <span>ECO-SCORE {detail.ecoscoreGrade}</span>
                  </div>
                )}
                {detail?.novaGroup && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                    <Activity className="w-3.5 h-3.5" />
                    <span>NOVA {detail.novaGroup}</span>
                  </div>
                )}
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="flex items-center gap-2 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-800">
                  <Barcode className="w-4 h-4 text-zinc-400" />
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-zinc-400">
                      {t.barcode}
                    </span>
                    <span className="font-mono text-zinc-800 dark:text-zinc-200">
                      {product.code}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-800">
                  <Scale className="w-4 h-4 text-zinc-400" />
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-zinc-400">
                      {t.quantity}
                    </span>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                      {detail?.quantity || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Categories */}
              {((detail?.categories && detail.categories.length > 0) ||
                (product.categories && product.categories.length > 0)) && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 uppercase tracking-wide">
                    <Layers className="w-3.5 h-3.5" />
                    <span>{t.categories}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(detail?.categories || product.categories).map((cat, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Middle Section: Ingredients */}
          <div className="space-y-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                {t.ingredients}
              </h3>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              {detail?.ingredientsText ? (
                <p>{detail.ingredientsText}</p>
              ) : (
                <p className="italic text-zinc-400 dark:text-zinc-500">
                  {t.noIngredients}
                </p>
              )}
            </div>
          </div>

          {/* Bottom Section: Nutritional Values (GATED) */}
          <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <span>{t.nutritionalValues}</span>
                {detail?.isSubscribed ? (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Pro Unlocked
                  </span>
                ) : (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Pro Gated
                  </span>
                )}
              </h3>
            </div>

            {loading ? (
              <div className="p-8 flex flex-col items-center justify-center gap-2 text-zinc-400">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                <span className="text-xs">Loading product data...</span>
              </div>
            ) : detail?.isSubscribed ? (
              /* SUBSCRIBED: Full Nutrition Breakdown */
              <NutritionTable nutriments={detail.nutriments} />
            ) : (
              /* UNSUBSCRIBED: Locked Gate + Upgrade CTA */
              <div className="space-y-4">
                <SubscriptionBanner
                  onSubscribe={onSubscribe}
                  subscribing={subscribing}
                />
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-800/80 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-800 dark:text-zinc-200 font-semibold text-xs transition-colors cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
