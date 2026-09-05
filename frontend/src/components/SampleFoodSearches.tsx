'use client';

import React from 'react';

interface SampleFoodSearchesProps {
  onSelect: (term: string) => void;
}

interface FoodItem {
  name: string;
  query: string;
  icon: React.ReactNode;
}

export const SampleFoodSearches: React.FC<SampleFoodSearchesProps> = ({ onSelect }) => {
  const sampleFoods: FoodItem[] = [
    {
      name: 'Nutella',
      query: 'Nutella',
      icon: (
        <svg
          viewBox="0 0 32 32"
          className="w-8 h-8 sm:w-9 sm:h-9 stroke-[#009668] fill-none stroke-[1.6]"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Jar lid */}
          <rect x="9" y="4" width="14" height="4" rx="1.5" />
          {/* Jar body */}
          <path d="M7 8h18a2 2 0 0 1 2 2v14a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V10a2 2 0 0 1 2-2z" />
          {/* Label inside jar */}
          <rect x="9" y="13" width="14" height="8" rx="1.5" strokeDasharray="32" />
          <line x1="12" y1="17" x2="20" y2="17" />
        </svg>
      ),
    },
    {
      name: 'Oatly',
      query: 'Oatly',
      icon: (
        <svg
          viewBox="0 0 32 32"
          className="w-8 h-8 sm:w-9 sm:h-9 stroke-[#009668] fill-none stroke-[1.6]"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Carton top peak */}
          <path d="M10 10l6-5 6 5" />
          <path d="M10 10h12v16a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2V10z" />
          {/* Cap */}
          <circle cx="16" cy="6.5" r="1.5" />
          {/* Label badge */}
          <rect x="13" y="14" width="6" height="7" rx="1" />
          <line x1="14.5" y1="17" x2="17.5" y2="17" />
        </svg>
      ),
    },
    {
      name: 'Haribo',
      query: 'Haribo',
      icon: (
        <svg
          viewBox="0 0 32 32"
          className="w-8 h-8 sm:w-9 sm:h-9 stroke-[#009668] fill-none stroke-[1.6]"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Gummy bear ears */}
          <circle cx="10" cy="8" r="2.5" />
          <circle cx="22" cy="8" r="2.5" />
          {/* Bear head */}
          <path d="M10 9.5c0-1.5 2.5-3 6-3s6 1.5 6 3c0 2-2.5 3.5-6 3.5s-6-1.5-6-3.5z" />
          {/* Bear body & paws */}
          <path d="M10 13c-2 0-3.5 2-2.5 4 1 2 2 2 2 2v5a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-5s1 0 2-2c1-2-.5-4-2.5-4" />
          {/* Tummy */}
          <circle cx="16" cy="18" r="3" strokeDasharray="18" />
        </svg>
      ),
    },
    {
      name: 'Stroopwafel',
      query: 'Stroopwafel',
      icon: (
        <svg
          viewBox="0 0 32 32"
          className="w-8 h-8 sm:w-9 sm:h-9 stroke-[#009668] fill-none stroke-[1.6]"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Circular waffle */}
          <circle cx="16" cy="16" r="11" />
          {/* Grid pattern */}
          <line x1="10" y1="11" x2="22" y2="11" />
          <line x1="8" y1="16" x2="24" y2="16" />
          <line x1="10" y1="21" x2="22" y2="21" />
          <line x1="11" y1="10" x2="11" y2="22" />
          <line x1="16" y1="8" x2="16" y2="24" />
          <line x1="21" y1="10" x2="21" y2="22" />
        </svg>
      ),
    },
    {
      name: 'Croissant',
      query: 'Croissant',
      icon: (
        <svg
          viewBox="0 0 32 32"
          className="w-8 h-8 sm:w-9 sm:h-9 stroke-[#009668] fill-none stroke-[1.6]"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Crescent outer curve */}
          <path d="M5 21c3-6 7-11 11-11s8 5 11 11c-3-1.5-6-2-8-2-2.5 0-4.5 1-6 2-1.5-1-3.5-2-6-2-1 0-1.5.3-2 0z" />
          {/* Layer rib arches */}
          <path d="M12 10.5c1.5 2.5 1.5 5.5 1.5 8" />
          <path d="M20 10.5c-1.5 2.5-1.5 5.5-1.5 8" />
          <path d="M16 10v8.5" />
        </svg>
      ),
    },
    {
      name: 'Muesli',
      query: 'Muesli',
      icon: (
        <svg
          viewBox="0 0 32 32"
          className="w-8 h-8 sm:w-9 sm:h-9 stroke-[#009668] fill-none stroke-[1.6]"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Bowl */}
          <path d="M6 16c0 6 4.5 10 10 10s10-4 10-10H6z" />
          {/* Rim */}
          <line x1="5" y1="16" x2="27" y2="16" />
          {/* Healthy greens/grain stalks */}
          <path d="M14 13c-2-3-1-6 1-7 2 1 3 4 1 7z" />
          <path d="M18 13c2-3 1-6-1-7-2 1-3 4-1 7z" />
          {/* Spoon */}
          <path d="M20 16l4-7" />
        </svg>
      ),
    },
    {
      name: 'Cereal',
      query: 'Cereal',
      icon: (
        <svg
          viewBox="0 0 32 32"
          className="w-8 h-8 sm:w-9 sm:h-9 stroke-[#009668] fill-none stroke-[1.6]"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Cereal bowl */}
          <path d="M5 16c0 6.5 5 10.5 11 10.5s11-4 11-10.5H5z" />
          {/* Rim */}
          <line x1="4" y1="16" x2="28" y2="16" />
          {/* Spoon emerging */}
          <path d="M15 19l8-10c1-1.2 2.5-.5 1.5.8l-7.5 9.2" />
        </svg>
      ),
    },
    {
      name: 'Olive Oil',
      query: 'Olive Oil',
      icon: (
        <svg
          viewBox="0 0 32 32"
          className="w-8 h-8 sm:w-9 sm:h-9 stroke-[#009668] fill-none stroke-[1.6]"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Bottle cork & neck */}
          <rect x="14" y="3" width="4" height="3" rx="1" />
          <path d="M13 6h6v4l2.5 3v12a3 3 0 0 1-3 3h-5a3 3 0 0 1-3-3V13l2.5-3V6z" />
          {/* Olive drop / label */}
          <circle cx="16" cy="18" r="2" />
          <line x1="16" y1="15" x2="16" y2="16" />
        </svg>
      ),
    },
  ];

  return (
    <div className="w-full bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 sm:p-8 shadow-sm text-center space-y-4">
      <div className="space-y-1.5 max-w-xl mx-auto">
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Popular Sample Searches
        </h3>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
          Try searching for any packaged food item to test product translation, Nutri-Score analysis, and subscription gatekeeping.
        </p>
      </div>

      {/* 8 Item Responsive Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-2.5 sm:gap-3.5 pt-3">
        {sampleFoods.map((item) => (
          <button
            key={item.name}
            type="button"
            onClick={() => onSelect(item.query)}
            className="group flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border border-zinc-200 dark:border-zinc-700/80 bg-white dark:bg-zinc-800/80 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer aspect-square min-w-0"
          >
            <div className="group-hover:scale-110 transition-transform duration-200 flex items-center justify-center">
              {item.icon}
            </div>
            <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 mt-2 truncate max-w-full group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {item.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
