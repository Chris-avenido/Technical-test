'use client';

import React from 'react';
import { useI18n } from '../i18n/I18nContext';
import { NutrimentsData } from '../lib/types';

interface NutritionTableProps {
  nutriments: NutrimentsData | null;
}

export const NutritionTable: React.FC<NutritionTableProps> = ({ nutriments }) => {
  const { t } = useI18n();

  if (!nutriments) {
    return (
      <div className="p-4 text-center text-sm text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
        Nutritional values not available for this item.
      </div>
    );
  }

  const formatValue = (val: number | null | undefined, unit: string = 'g') => {
    if (val === null || val === undefined) return '—';
    return `${val} ${unit}`;
  };

  const rows = [
    {
      label: `${t.energy} (kcal)`,
      value: nutriments.energyKcal100g !== null && nutriments.energyKcal100g !== undefined ? `${nutriments.energyKcal100g} kcal` : '—',
      highlight: true,
      sub: false,
    },
    {
      label: `${t.energy} (kJ)`,
      value: nutriments.energyKj100g !== null && nutriments.energyKj100g !== undefined ? `${nutriments.energyKj100g} kJ` : '—',
      highlight: false,
      sub: false,
    },
    {
      label: t.fat,
      value: formatValue(nutriments.fat100g),
      highlight: true,
      sub: false,
    },
    {
      label: t.saturatedFat,
      value: formatValue(nutriments.saturatedFat100g),
      highlight: false,
      sub: true,
    },
    {
      label: t.carbohydrates,
      value: formatValue(nutriments.carbohydrates100g),
      highlight: true,
      sub: false,
    },
    {
      label: t.sugars,
      value: formatValue(nutriments.sugars100g),
      highlight: false,
      sub: true,
    },
    {
      label: t.fiber,
      value: formatValue(nutriments.fiber100g),
      highlight: false,
      sub: false,
    },
    {
      label: t.proteins,
      value: formatValue(nutriments.proteins100g),
      highlight: true,
      sub: false,
    },
    {
      label: t.salt,
      value: formatValue(nutriments.salt100g),
      highlight: true,
      sub: false,
    },
    {
      label: t.sodium,
      value: formatValue(nutriments.sodium100g),
      highlight: false,
      sub: true,
    },
  ];

  return (
    <div className="w-full overflow-hidden border border-zinc-200 dark:border-zinc-700/80 rounded-xl bg-white dark:bg-zinc-800/60 shadow-sm">
      <div className="bg-zinc-50 dark:bg-zinc-800 px-4 py-2.5 border-b border-zinc-200 dark:border-zinc-700/80 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-200">
          {t.nutritionalValues}
        </span>
        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
          {t.per100g}
        </span>
      </div>

      <div className="divide-y divide-zinc-100 dark:divide-zinc-700/50">
        {rows.map((row, idx) => (
          <div
            key={idx}
            className={`flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 text-xs transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-700/30 gap-2 sm:gap-3 ${
              row.highlight ? 'font-semibold text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 dark:text-zinc-300'
            }`}
          >
            <span className={`min-w-0 ${row.sub ? 'pl-3 sm:pl-4 text-zinc-500 dark:text-zinc-400' : ''}`}>
              {row.sub && '↳ '}
              {row.label}
            </span>
            <span className="font-mono shrink-0 pl-2 text-right">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
