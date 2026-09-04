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
        className="relative flex items-center shadow-lg shadow-zinc-200/50 dark:shadow-zinc-950/50 rounded-2xl overflow-hidden border border-zinc-200/80 dark:border-zinc-700/80 bg-white/95 dark:bg-zinc-800/95 backdrop-blur-md transition-all focus-within:border-emerald-500 dark:focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20"
      >
        <div className="pl-4 pr-2 text-zinc-400">
          <Search className="w-5 h-5" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full py-3.5 px-2 bg-transparent text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 text-base outline-none"
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="m-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="hidden sm:inline">{t.searching}</span>
            </>
          ) : (
            <span>{t.searchButton}</span>
          )}
        </button>
      </form>

      {/* Recent Searches Tags */}
      {recentSearches && recentSearches.length > 0 && (
        <div className="flex items-center flex-wrap gap-2 px-1 text-xs">
          <div className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400 font-medium mr-1">
            <History className="w-3.5 h-3.5" />
            <span>{t.recentSearches}:</span>
          </div>
          {recentSearches.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleChipClick(item.query)}
              className="px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 dark:hover:text-emerald-400 text-zinc-600 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700/60 transition-colors cursor-pointer"
            >
              {item.query}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
