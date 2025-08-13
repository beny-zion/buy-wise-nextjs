// app/layout.js
import './globals.css';
import { Providers } from '@/components/providers/Providers';

// SEO Metadata
export const metadata = {
  // Basic metadata
  title: {
    default: 'Buy Wise - ׳”׳׳׳¦׳•׳× ׳׳•׳¦׳¨׳™׳ ׳—׳›׳׳•׳× ׳׳׳׳™ ׳׳§׳¡׳₪׳¨׳¡',
    template: '%s | Buy Wise',
  },
  description: '׳’׳׳• ׳׳× ׳”׳׳•׳¦׳¨׳™׳ ׳”׳˜׳•׳‘׳™׳ ׳‘׳™׳•׳×׳¨ ׳׳׳׳™ ׳׳§׳¡׳₪׳¨׳¡ ׳¢׳ ׳”׳׳׳¦׳•׳× ׳׳™׳©׳™׳•׳× ׳׳׳•׳׳—׳™׳. ׳—׳¡׳›׳• ׳¢׳“ 70% ׳¢׳ ׳׳•׳¦׳¨׳™׳ ׳׳™׳›׳•׳×׳™׳™׳.',
  keywords: ['׳׳׳™ ׳׳§׳¡׳₪׳¨׳¡', 'aliexpress', '׳”׳׳׳¦׳•׳× ׳׳•׳¦׳¨׳™׳', '׳§׳ ׳™׳•׳× ׳׳•׳ ׳׳™׳™׳', 'buy wise'],
  authors: [{ name: 'Buy Wise Team' }],
  creator: 'Buy Wise',
  publisher: 'Buy Wise',
  
  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'he_IL',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'Buy Wise',
    title: 'Buy Wise - ׳”׳׳׳¦׳•׳× ׳׳•׳¦׳¨׳™׳ ׳—׳›׳׳•׳× ׳׳׳׳™ ׳׳§׳¡׳₪׳¨׳¡',
    description: '׳’׳׳• ׳׳× ׳”׳׳•׳¦׳¨׳™׳ ׳”׳˜׳•׳‘׳™׳ ׳‘׳™׳•׳×׳¨ ׳׳׳׳™ ׳׳§׳¡׳₪׳¨׳¡ ׳¢׳ ׳”׳׳׳¦׳•׳× ׳׳™׳©׳™׳•׳× ׳׳׳•׳׳—׳™׳',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Buy Wise - ׳”׳׳׳¦׳•׳× ׳׳•׳¦׳¨׳™׳ ׳—׳›׳׳•׳×',
      },
    ],
  },
  
  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'Buy Wise - ׳”׳׳׳¦׳•׳× ׳׳•׳¦׳¨׳™׳ ׳—׳›׳׳•׳×',
    description: '׳’׳׳• ׳׳× ׳”׳׳•׳¦׳¨׳™׳ ׳”׳˜׳•׳‘׳™׳ ׳‘׳™׳•׳×׳¨ ׳׳׳׳™ ׳׳§׳¡׳₪׳¨׳¡',
    images: [`${process.env.NEXT_PUBLIC_SITE_URL}/twitter-card.jpg`],
    creator: '@buywise',
  },
  
  // Icons
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
      },
    ],
  },
  
  // Manifest
  manifest: '/manifest.json',
  
  // Theme
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFA066' },
    { media: '(prefers-color-scheme: dark)', color: '#FF6B6B' },
  ],
  
  // Viewport
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  
  // Verification
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
  },
  
  // Robots
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
  
  // Other
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL,
    languages: {
      'he-IL': process.env.NEXT_PUBLIC_SITE_URL,
      'en-US': `${process.env.NEXT_PUBLIC_SITE_URL}/en`,
    },
  },
  
  category: 'ecommerce',
};

// Structured Data for Organization
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Buy Wise',
  url: process.env.NEXT_PUBLIC_SITE_URL,
  logo: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
  sameAs: [
    'https://www.facebook.com/buywise',
    'https://www.instagram.com/buywise',
    'https://twitter.com/buywise',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+972-50-1234567',
    contactType: 'customer service',
    availableLanguage: ['Hebrew', 'English'],
  },
};

// WebSite Schema
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Buy Wise',
  url: process.env.NEXT_PUBLIC_SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://ae01.alicdn.com" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      
      <body className="min-h-screen bg-gradient-to-br from-white to-gray-50">
        {/* Background decoration */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -right-1/4 -top-1/4 w-1/2 h-1/2 bg-primary-500/5 rounded-full blur-3xl" />
          <div className="absolute -left-1/4 top-1/3 w-1/2 h-1/2 bg-secondary-500/5 rounded-full blur-3xl" />
          <div className="absolute right-1/3 -bottom-1/4 w-1/3 h-1/3 bg-accent/5 rounded-full blur-3xl" />
        </div>
        
        {/* Main Content */}
        <Providers>
          {children}
        </Providers>
        
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true' && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}');
                `,
              }}
            />
          </>
        )}
      </body>
    </html>
  );
}
