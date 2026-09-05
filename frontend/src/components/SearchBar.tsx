'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '../i18n/I18nContext';
import { SearchHistoryItem } from '../lib/types';
import { Search, X, Loader2, Clock } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  loading: boolean;
  recentSearches: SearchHistoryItem[];
  initialQuery?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  loading,
  recentSearches,
  initialQuery = '',
}) => {
  const { t } = useI18n();
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
  };

  const handleChipClick = (q: string) => {
    setQuery(q);
    onSearch(q);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-3">
      {/* Search Input Pill Form */}
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center rounded-full border border-zinc-200/90 dark:border-zinc-700/80 bg-white/95 dark:bg-zinc-800/95 shadow-md shadow-zinc-200/50 dark:shadow-zinc-950/40 p-1 sm:p-1.5 transition-all focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20"
      >
        <div className="pl-3.5 sm:pl-4 pr-1 sm:pr-2 text-zinc-400 shrink-0">
          <Search className="w-5 h-5" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full py-2.5 sm:py-3 px-2 bg-transparent text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 text-sm sm:text-base outline-none min-w-0"
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 sm:p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors shrink-0"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="m-0.5 sm:m-1 px-5 sm:px-7 py-2 sm:py-2.5 bg-[#009668] hover:bg-[#008259] active:bg-[#00704d] text-white text-xs sm:text-sm font-semibold rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 sm:gap-2 cursor-pointer shrink-0 shadow-sm"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
              <span className="hidden sm:inline">{t.searching}</span>
            </>
          ) : (
            <span>{t.searchButton}</span>
          )}
        </button>
      </form>

      {/* Recent Searches Chips */}
      {recentSearches && recentSearches.length > 0 && (
        <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 px-3 text-xs">
          <div className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400 font-medium mr-1 shrink-0">
            <Clock className="w-3.5 h-3.5 shrink-0 text-zinc-400" />
            <span>{t.recentSearches}:</span>
          </div>
          {recentSearches.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleChipClick(item.query)}
              className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-[#009668] dark:hover:text-emerald-400 text-zinc-700 dark:text-zinc-300 border border-zinc-200/70 dark:border-zinc-700/60 transition-colors cursor-pointer truncate max-w-[150px] sm:max-w-xs"
            >
              {item.query}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
