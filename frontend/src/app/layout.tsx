import type { Metadata, Viewport } from 'next';
import './globals.css';
import { I18nProvider } from '../i18n/I18nContext';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
};

export const metadata: Metadata = {
  title: 'Food Finder - Packaged Food Products & Verified Nutrition',
  description: 'Find packaged food products, localized ingredients, and full nutritional breakdown via Open Food Facts and Stripe Pro subscriptions.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-emerald-500 selection:text-white">
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
