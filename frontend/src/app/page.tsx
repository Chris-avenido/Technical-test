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
import { SampleFoodSearches } from '../components/SampleFoodSearches';
import { ProductCard } from '../components/ProductCard';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { SubscriptionBanner } from '../components/SubscriptionBanner';
import {
  Globe,
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
      toggleDemoSubscription('ACTIVE')
        .then(() => loadUserAndHistory())
        .catch(() => loadUserAndHistory())
        .finally(() => setRefreshTrigger((prev) => prev + 1));
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
    <div className="min-h-screen flex flex-col bg-food-finder-glow relative overflow-x-hidden">
      {/* Ambient Decorative Background Line-art Doodles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
        {/* Left milk bottle doodle */}
        <div className="absolute top-28 sm:top-36 left-4 sm:left-12 opacity-30">
          <svg className="w-12 h-20 sm:w-16 sm:h-24 stroke-emerald-500 fill-none stroke-[1.2]" viewBox="0 0 40 60">
            <rect x="12" y="4" width="16" height="6" rx="2" />
            <path d="M10 10h20v40a6 6 0 0 1-6 6H16a6 6 0 0 1-6-6V10z" />
            <rect x="14" y="22" width="12" height="14" rx="2" />
          </svg>
        </div>

        {/* Left leaf doodle */}
        <div className="absolute top-72 left-20 sm:left-32 opacity-25">
          <svg className="w-8 h-8 sm:w-12 sm:h-12 stroke-emerald-500 fill-none stroke-[1.2]" viewBox="0 0 24 24">
            <path d="M12 2C6.5 2 2 6.5 2 12c0 3.5 1.8 6.6 4.6 8.4 0-4.6 3.7-8.4 8.4-8.4 1 0 2 .2 2.9.5C18.6 7.5 15.6 2 12 2z" />
          </svg>
        </div>

        {/* Left mint dot accent */}
        <div className="absolute top-96 left-8 sm:left-16 w-3 h-3 rounded-full bg-emerald-400/40" />

        {/* Right bottle doodle */}
        <div className="absolute top-28 sm:top-36 right-4 sm:right-16 opacity-30">
          <svg className="w-12 h-24 sm:w-16 sm:h-28 stroke-emerald-500 fill-none stroke-[1.2]" viewBox="0 0 36 70">
            <rect x="14" y="4" width="8" height="6" rx="1" />
            <path d="M13 10h10v12l4 6v34a4 4 0 0 1-4 4H13a4 4 0 0 1-4-4V28l4-6V10z" />
            <circle cx="18" cy="44" r="5" />
          </svg>
        </div>

        {/* Right avocado/fruit doodle */}
        <div className="absolute top-72 right-20 sm:right-36 opacity-25">
          <svg className="w-12 h-20 sm:w-16 sm:h-24 stroke-emerald-500 fill-none stroke-[1.2]" viewBox="0 0 40 60">
            <path d="M20 6c-8 0-14 12-14 28 0 12 6 20 14 20s14-8 14-20C34 18 28 6 20 6z" />
            <circle cx="20" cy="38" r="7" />
          </svg>
        </div>

        {/* Right mint dot accent */}
        <div className="absolute top-96 right-10 sm:right-24 w-2.5 h-2.5 rounded-full bg-emerald-400/40" />
      </div>

      {/* 1. Evaluator Demo Bar */}
      <div className="relative z-50">
        <DemoControlPanel
          userStatus={userStatus}
          onToggleStatus={handleToggleStatus}
          loading={toggleLoading}
        />
      </div>

      {/* 2. Top Navigation */}
      <div className="relative z-40">
        <Navbar
          userStatus={userStatus}
          onSubscribeClick={handleSubscribe}
          subscribing={subscribing}
        />
      </div>

      {/* 3. Notification Banner */}
      {notification && (
        <div
          className={`relative z-30 py-2.5 sm:py-3 px-3 sm:px-4 text-xs font-semibold text-center border-b flex flex-col sm:flex-row items-center justify-center gap-2 ${
            notification.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-300'
              : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-zinc-500 shrink-0" />
            )}
            <span>{notification.text}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="sm:ml-4 underline opacity-75 hover:opacity-100 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 4. Main Hero & Search Section */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-10">
        <div className="text-center space-y-3.5 max-w-2xl mx-auto pt-2 sm:pt-4">
          {/* Multilingual Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-[#009668] dark:text-emerald-400 text-xs font-bold tracking-wide border border-emerald-200/80 dark:border-emerald-800/60 shadow-sm">
            <Globe className="w-3.5 h-3.5 shrink-0" />
            <span>Multilingual Food Search (EN • NL • DE • FR)</span>
          </div>

          {/* Hero Title with Sprout Leaf */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center justify-center gap-2">
            <span className="relative inline-flex items-center">
              {t.appName}
              <span className="absolute -top-3.5 sm:-top-4 -right-4 sm:-right-5 text-[#009668]">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 fill-[#009668]" viewBox="0 0 24 24">
                  <path d="M12 2C6.5 2 2 6.5 2 12c0 3.5 1.8 6.6 4.6 8.4 0-4.6 3.7-8.4 8.4-8.4 1 0 2 .2 2.9.5C18.6 7.5 15.6 2 12 2z" />
                </svg>
              </span>
            </span>
          </h1>

          {/* Hero Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3 sm:pb-4 gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <PackageSearch className="w-5 h-5 text-[#009668] dark:text-emerald-400 shrink-0" />
              <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                {products.length} {t.resultsFound}
              </span>
              {currentQuery && (
                <span className="text-xs text-zinc-400 truncate max-w-[180px] sm:max-w-none">
                  for &quot;{currentQuery}&quot;
                </span>
              )}
            </div>
            <span className="text-xs text-zinc-500 font-mono self-start sm:self-auto">
              Locale: {lang.toUpperCase()}
            </span>
          </div>
        )}

        {/* 5. Product Results Grid / Welcome Initial State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="h-72 sm:h-80 rounded-2xl bg-zinc-200/60 dark:bg-zinc-800/60 animate-pulse border border-zinc-200 dark:border-zinc-700/50"
              />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
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
          <div className="py-12 sm:py-16 text-center space-y-4 max-w-md mx-auto">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700 flex items-center justify-center mx-auto text-zinc-400 shadow-sm">
              <SearchX className="w-7 h-7 sm:w-8 sm:h-8 stroke-1" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {t.noResultsTitle}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              {t.noResultsDesc}
            </p>
          </div>
        ) : (
          /* Initial Welcome Layout matching Mockup */
          <div className="space-y-6 sm:space-y-8">
            {/* Popular Sample Searches Card */}
            <SampleFoodSearches onSelect={executeSearch} />

            {/* Nutritional Breakdown Locked Pro Banner */}
            <SubscriptionBanner
              onSubscribe={handleSubscribe}
              subscribing={subscribing}
            />
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
      <footer className="relative z-10 w-full border-t border-zinc-200/80 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 py-6 text-center text-xs text-zinc-500 backdrop-blur-sm">
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
