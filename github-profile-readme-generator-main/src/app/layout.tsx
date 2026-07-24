import type { Metadata } from 'next';
import { Roboto_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { ToastProvider } from '@/components/ui/toast';
import { BuyMeACoffeeWidget } from '@/components/ui/buy-me-coffee';
import { KoFiWidget } from '@/components/ui/kofi-widget';
import { ConditionalAnalytics } from '@/components/analytics/conditional-analytics';
import { CookieConsent } from '@/components/ui/cookie-consent';
import { getAssetPath } from '@/lib/asset-path';

const robotoMono = Roboto_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const wotfard = localFont({
  src: '../../public/fonts/wotfard/Wotfard-Regular.woff',
  variable: '--font-sans',
  weight: '400',
});

export const metadata: Metadata = {
  title: {
    default: 'GitHub Profile README Generator - Create Amazing Profile in Seconds',
    template: '%s | GitHub Profile README Generator',
  },
  description:
    'The best profile README generator to create an amazing GitHub profile in seconds. Customize your profile with skills, social links, stats, and more. Free, open-source, and easy to use.',
  keywords: [
    'github',
    'profile',
    'readme',
    'generator',
    'markdown',
    'github profile',
    'readme generator',
    'github readme',
    'profile generator',
    'github stats',
    'github badges',
    'developer profile',
    'github profile maker',
    'readme maker',
  ],
  authors: [{ name: 'YOUR_NAME', url: 'https://github.com/YOUR_USERNAME' }],
  creator: 'YOUR_NAME',
  publisher: 'YOUR_NAME',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://your-domain.com/'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'GitHub Profile README Generator - Create Amazing Profile in Seconds',
    description:
      'Create an amazing GitHub profile README in seconds with customizable templates and easy-to-use interface. Add skills, social links, GitHub stats, and more.',
    url: 'https://your-domain.com/',
    siteName: 'GitHub Profile README Generator',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'GitHub Profile README Generator - Create Amazing Profile in Seconds',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GitHub Profile README Generator',
    description:
      'Create an amazing GitHub profile README in seconds with customizable templates. Free and easy to use.',
    creator: '@YOUR_USERNAME',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: getAssetPath('/mdg.png'), type: 'image/png' },
    ],
    apple: getAssetPath('/mdg.png'),
  },
  manifest: getAssetPath('/manifest.json'),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'GitHub Profile README Generator',
    description:
      'Create an amazing GitHub profile README in seconds with customizable templates and easy-to-use interface.',
    url: 'https://your-domain.com/',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Person',
      name: 'YOUR_NAME',
      url: 'https://github.com/YOUR_USERNAME',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1000',
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Favicon and manifest are now handled by Next.js metadata API above */}
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="GitHub README Gen" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${wotfard.variable} ${robotoMono.variable} font-sans antialiased`}>
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
        <BuyMeACoffeeWidget />
        <KoFiWidget />
        <ConditionalAnalytics />
        <CookieConsent />
      </body>
    </html>
  );
}
