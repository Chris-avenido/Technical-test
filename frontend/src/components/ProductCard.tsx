'use client';

import React, { useState } from 'react';
import { useI18n } from '../i18n/I18nContext';
import { ProductSummary } from '../lib/types';
import { Package, ChevronRight } from 'lucide-react';

interface ProductCardProps {
  product: ProductSummary;
  onSelect: (product: ProductSummary) => void;
}

const NUTRISCORE_COLORS: Record<string, { bg: string; text: string }> = {
  A: { bg: 'bg-[#038141]', text: 'text-white' },
  B: { bg: 'bg-[#85bb2f]', text: 'text-white' },
  C: { bg: 'bg-[#fecb02]', text: 'text-zinc-900' },
  D: { bg: 'bg-[#ee8100]', text: 'text-white' },
  E: { bg: 'bg-[#e63e11]', text: 'text-white' },
};

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { t } = useI18n();
  const [imageError, setImageError] = useState(false);

  const nutriscore = product.nutriscoreGrade ? product.nutriscoreGrade.toUpperCase() : null;
  const nutriscoreStyle = nutriscore && NUTRISCORE_COLORS[nutriscore]
    ? NUTRISCORE_COLORS[nutriscore]
    : { bg: 'bg-zinc-200 dark:bg-zinc-700', text: 'text-zinc-600 dark:text-zinc-300' };

  return (
    <div
      onClick={() => onSelect(product)}
      className="group flex flex-col bg-white dark:bg-zinc-800/90 rounded-2xl border border-zinc-200/80 dark:border-zinc-700/80 overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
    >
      {/* Product Image Thumbnail */}
      <div className="relative w-full h-48 bg-zinc-100 dark:bg-zinc-900/60 flex items-center justify-center overflow-hidden p-4">
        {product.imageUrl && !imageError ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-zinc-300 dark:text-zinc-600 gap-2">
            <Package className="w-12 h-12 stroke-1" />
            <span className="text-xs">No image</span>
          </div>
        )}

        {/* Nutri-Score badge top right */}
        {nutriscore && (
          <div
            className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg font-black text-xs shadow-md tracking-wider ${nutriscoreStyle.bg} ${nutriscoreStyle.text}`}
            title={`Nutri-Score: ${nutriscore}`}
          >
            NUTRI-SCORE {nutriscore}
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="flex-1 p-5 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold tracking-wide uppercase text-emerald-600 dark:text-emerald-400 truncate">
            {product.brand || t.brand}
          </p>
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Categories */}
        {product.categories && product.categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {product.categories.slice(0, 3).map((cat, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-700/60 text-zinc-600 dark:text-zinc-300 capitalize truncate max-w-[140px]"
              >
                {cat}
              </span>
            ))}
          </div>
        )}

        {/* Bottom Action Footer */}
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-700/50 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
          <span>{t.viewDetails}</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
