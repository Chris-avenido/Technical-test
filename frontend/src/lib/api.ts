import {
  ApiResponse,
  ProductSummary,
  ProductDetail,
  SearchHistoryItem,
  DemoUserStatus,
  SupportedLanguage,
} from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export async function searchProducts(
  query: string,
  lang: SupportedLanguage = 'en',
  page: number = 1,
  pageSize: number = 20
): Promise<{ products: ProductSummary[]; totalCount: number }> {
  if (!query.trim()) return { products: [], totalCount: 0 };

  const url = new URL(`${API_BASE}/products/search`);
  url.searchParams.set('q', query);
  url.searchParams.set('lang', lang);
  url.searchParams.set('page', page.toString());
  url.searchParams.set('pageSize', pageSize.toString());

  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Search failed: ${res.statusText}`);
  }
  const json: ApiResponse<{ products: ProductSummary[]; totalCount: number }> = await res.json();
  return json.data;
}

export async function getProductByCode(
  code: string,
  lang: SupportedLanguage = 'en'
): Promise<ProductDetail> {
  const url = new URL(`${API_BASE}/products/${encodeURIComponent(code)}`);
  url.searchParams.set('lang', lang);

  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Failed to load product details: ${res.statusText}`);
  }
  const json: ApiResponse<ProductDetail> = await res.json();
  return json.data;
}

export async function getRecentSearches(): Promise<SearchHistoryItem[]> {
  try {
    const res = await fetch(`${API_BASE}/user/searches?limit=8`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json: ApiResponse<SearchHistoryItem[]> = await res.json();
    return json.data || [];
  } catch (error) {
    console.warn('Could not fetch recent searches:', error);
    return [];
  }
}

export async function getSubscriptionStatus(): Promise<DemoUserStatus | null> {
  try {
    const res = await fetch(`${API_BASE}/stripe/status`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json: ApiResponse<DemoUserStatus> = await res.json();
    return json.data;
  } catch (error) {
    console.warn('Could not fetch subscription status:', error);
    return null;
  }
}

export async function createCheckoutSession(): Promise<{ sessionId: string; url: string }> {
  const res = await fetch(`${API_BASE}/stripe/create-checkout-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    throw new Error('Failed to create Stripe Checkout session');
  }
  const json = await res.json();
  return json.data;
}

export async function toggleDemoSubscription(status?: 'ACTIVE' | 'INACTIVE'): Promise<DemoUserStatus> {
  const res = await fetch(`${API_BASE}/stripe/toggle-demo-status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    throw new Error('Failed to toggle demo subscription status');
  }
  const json = await res.json();
  return json.data;
}
