'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '../i18n/I18nContext';
import { SearchHistoryItem } from '../lib/types';
import { Search, X, Loader2, History } from 'lucide-react';

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
      {/* Search Input Box */}
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center shadow-lg shadow-zinc-200/50 dark:shadow-zinc-950/50 rounded-2xl overflow-hidden border border-zinc-200/80 dark:border-zinc-700/80 bg-white/95 dark:bg-zinc-800/95 backdrop-blur-md transition-all focus-within:border-emerald-500 dark:focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 p-0.5 sm:p-1"
      >
        <div className="pl-3 sm:pl-4 pr-1 sm:pr-2 text-zinc-400 shrink-0">
          <Search className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full py-2.5 sm:py-3.5 px-2 bg-transparent text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 text-sm sm:text-base outline-none min-w-0"
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
          className="m-0.5 sm:m-1 px-3 sm:px-5 py-2 sm:py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 sm:gap-2 cursor-pointer shrink-0"
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

      {/* Recent Searches Tags */}
      {recentSearches && recentSearches.length > 0 && (
        <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 px-1 text-xs">
          <div className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400 font-medium mr-1 shrink-0">
            <History className="w-3.5 h-3.5 shrink-0" />
            <span>{t.recentSearches}:</span>
          </div>
          {recentSearches.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleChipClick(item.query)}
              className="px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 dark:hover:text-emerald-400 text-zinc-600 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700/60 transition-colors cursor-pointer truncate max-w-[150px] sm:max-w-xs"
            >
              {item.query}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
