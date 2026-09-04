'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useI18n } from '../i18n/I18nContext';
import {
  ProductSummary,
  SearchHistoryItem,
  DemoUserStatus,
} from '../lib/types';
import {
  searchProducts,
  getRecentSearches,
  getSubscriptionStatus,
  createCheckoutSession,
  toggleDemoSubscription,
} from '../lib/api';
import { Navbar } from '../components/Navbar';
import { DemoControlPanel } from '../components/DemoControlPanel';
import { SearchBar } from '../components/SearchBar';
import { ProductCard } from '../components/ProductCard';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { SubscriptionBanner } from '../components/SubscriptionBanner';
import {
  Sparkles,
  SearchX,
  CheckCircle,
  AlertCircle,
  PackageSearch,
} from 'lucide-react';

export default function HomePage() {
  const { lang, t } = useI18n();

  // Search and Product State
  const [currentQuery, setCurrentQuery] = useState('');
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductSummary | null>(null);

  // User & Subscription State
  const [recentSearches, setRecentSearches] = useState<SearchHistoryItem[]>([]);
  const [userStatus, setUserStatus] = useState<DemoUserStatus | null>(null);
  const [subscribing, setSubscribing] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [notification, setNotification] = useState<{ type: 'success' | 'info'; text: string } | null>(null);

  // Fetch initial user status and recent searches
  const loadUserAndHistory = useCallback(async () => {
    try {
      const [status, history] = await Promise.all([
        getSubscriptionStatus(),
        getRecentSearches(),
      ]);
      if (status) setUserStatus(status);
      if (history) setRecentSearches(history);
    } catch (err) {
      console.warn('Initialization error:', err);
    }
  }, []);

  useEffect(() => {
    loadUserAndHistory();
  }, [loadUserAndHistory]);

  // Handle URL query parameters for return from Stripe Checkout
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const subStatus = params.get('subscription_status') || params.get('subscription');

    if (subStatus === 'success') {
      setNotification({
        type: 'success',
        text: '🎉 Welcome to Food Finder Pro! Your monthly subscription is active and all nutritional values are unlocked.',
      });
      loadUserAndHistory();
      setRefreshTrigger((prev) => prev + 1);
    } else if (subStatus === 'canceled') {
      setNotification({
        type: 'info',
        text: 'Checkout was canceled. You remain on the Free demo tier.',
      });
    }
  }, [loadUserAndHistory]);

  // Execute Product Search
  const executeSearch = useCallback(
    async (queryText: string) => {
      const trimmed = queryText.trim();
      if (!trimmed) return;

      setLoading(true);
      setHasSearched(true);
      setCurrentQuery(trimmed);

      try {
        const data = await searchProducts(trimmed, lang);
        setProducts(data.products || []);
        setTotalCount(data.totalCount || 0);

        // Refresh recent searches after query
        getRecentSearches().then((h) => setRecentSearches(h));
      } catch (err) {
        console.error('Search failed:', err);
        setProducts([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    },
    [lang]
  );

  // If language changes and a query is already active, refresh results in the newly selected language!
  useEffect(() => {
    if (currentQuery) {
      executeSearch(currentQuery);
    }
  }, [lang]);

  // Handle Stripe Subscription Checkout
  const handleSubscribe = async () => {
    try {
      setSubscribing(true);
      const { url } = await createCheckoutSession();
      if (url) {
        window.location.href = url;
      }
    } catch (err: any) {
      alert(`Could not initiate Stripe checkout: ${err.message}`);
    } finally {
      setSubscribing(false);
    }
  };

  // Handle Evaluator Toggle
  const handleToggleStatus = async () => {
    try {
      setToggleLoading(true);
      const updated = await toggleDemoSubscription();
      setUserStatus(updated);
      setRefreshTrigger((prev) => prev + 1);
      setNotification({
        type: 'success',
        text: `Demo user status successfully toggled to ${updated.subscriptionStatus}!`,
      });
    } catch (err: any) {
      alert(`Failed to toggle status: ${err.message}`);
    } finally {
      setToggleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950">
      {/* 1. Evaluator Demo Bar */}
      <DemoControlPanel
        userStatus={userStatus}
        onToggleStatus={handleToggleStatus}
        loading={toggleLoading}
      />

      {/* 2. Top Navigation */}
      <Navbar
        userStatus={userStatus}
        onSubscribeClick={handleSubscribe}
        subscribing={subscribing}
      />

      {/* 3. Notification Banner */}
      {notification && (
        <div
          className={`py-3 px-4 text-xs font-semibold text-center border-b flex items-center justify-center gap-2 ${
            notification.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-300'
              : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          ) : (
            <AlertCircle className="w-4 h-4 text-zinc-500" />
          )}
          <span>{notification.text}</span>
          <button
            onClick={() => setNotification(null)}
            className="ml-4 underline opacity-75 hover:opacity-100 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 4. Main Hero & Search Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold tracking-wide border border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Multilingual Food Search (EN • NL • DE • FR)</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            {t.appName}
          </h1>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400">
            {t.appTagline}
          </p>
        </div>

        {/* Search Bar with recent searches */}
        <SearchBar
          onSearch={executeSearch}
          loading={loading}
          recentSearches={recentSearches}
          initialQuery={currentQuery}
        />

        {/* Results Header */}
        {hasSearched && (
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <div className="flex items-center gap-2">
              <PackageSearch className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                {products.length} {t.resultsFound}
              </span>
              {currentQuery && (
                <span className="text-xs text-zinc-400">
                  for &quot;{currentQuery}&quot;
                </span>
              )}
            </div>
            <span className="text-xs text-zinc-500 font-mono">
              Locale: {lang.toUpperCase()}
            </span>
          </div>
        )}

        {/* 5. Product Results Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="h-80 rounded-2xl bg-zinc-200/60 dark:bg-zinc-800/60 animate-pulse border border-zinc-200 dark:border-zinc-700/50"
              />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.code}
                product={product}
                onSelect={(p) => setSelectedProduct(p)}
              />
            ))}
          </div>
        ) : hasSearched ? (
          /* Empty State */
          <div className="py-16 text-center space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
              <SearchX className="w-8 h-8 stroke-1" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {t.noResultsTitle}
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {t.noResultsDesc}
            </p>
          </div>
        ) : (
          /* Initial Welcome Suggestions */
          <div className="py-8 space-y-6">
            <div className="p-8 rounded-3xl bg-gradient-to-b from-white to-zinc-100/60 dark:from-zinc-900 dark:to-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800 text-center space-y-4 shadow-sm">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Popular Sample Searches
              </h3>
              <p className="text-xs text-zinc-500 max-w-md mx-auto">
                Try searching for any packaged food item to test product translation, Nutri-Score analysis, and subscription gatekeeping.
              </p>
              <div className="flex flex-wrap justify-center gap-2.5 pt-2">
                {['Nutella', 'Oatly', 'Haribo', 'Stroopwafel', 'Croissant', 'Muesli', 'Cereal', 'Olive Oil'].map((sample) => (
                  <button
                    key={sample}
                    onClick={() => executeSearch(sample)}
                    className="px-3.5 py-1.5 rounded-full bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold border border-zinc-200 dark:border-zinc-700 shadow-sm hover:border-emerald-500 hover:text-emerald-600 transition-all cursor-pointer"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Upgrade CTA Banner if user is on Free Tier */}
            {!userStatus?.isSubscribed && (
              <SubscriptionBanner
                onSubscribe={handleSubscribe}
                subscribing={subscribing}
              />
            )}
          </div>
        )}
      </main>

      {/* 6. Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onSubscribe={handleSubscribe}
          subscribing={subscribing}
          refreshTrigger={refreshTrigger}
        />
      )}

      {/* 7. Footer */}
      <footer className="w-full border-t border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 py-6 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>
            {t.appName} — Packaged Food Product Finder Technical Test Project
          </span>
          <span className="font-mono text-[11px] text-zinc-400">
            Powered by Open Food Facts & Stripe Test API
          </span>
        </div>
      </footer>
    </div>
  );
}
