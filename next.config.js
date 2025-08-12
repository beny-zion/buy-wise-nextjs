/** @type {import('next').NextConfig} */
const nextConfig = {
  // מאפשר SSR ו-SSG
  reactStrictMode: true,
  
  // הגדרות תמונות
  images: {
    domains: [
      'localhost',
      'res.cloudinary.com',
      'ae01.alicdn.com',
      'ae04.alicdn.com',
      'ae03.alicdn.com',
      'ae02.alicdn.com',
      'i.alicdn.com',
      'img.alicdn.com',
      'cbu01.alicdn.com',
      'img.ltwebstatic.com',
      'buy-wise.com',
      'buy-wise.onrender.com',
      'product-pick-server.onrender.com',
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
  
  // Headers לביצועים ואבטחה
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Redirects
  async redirects() {
    return [
      // Redirect מהשורש ל-products
      {
        source: '/',
        destination: '/products',
        permanent: false,
      },
      // תיקון נתיבים ישנים
      {
        source: '/product-viewer/:path*',
        destination: '/products',
        permanent: true,
      },
      {
        source: '/vendorPrivate/:path*',
        destination: '/vendor/dashboard/:path*',
        permanent: true,
      },
    ];
  },
  
  // Rewrites - Proxy to backend
  async rewrites() {
    return [
      // API calls to Express backend
      {
        source: '/api/backend/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
      // Static files from backend
      {
        source: '/uploads/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/uploads/:path*`,
      },
    ];
  },
  
  // Webpack configuration
  webpack: (config, { dev, isServer }) => {
    // SVG support
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    
    // Optimization for production
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
            priority: 20,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      };
    }
    
    return config;
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_VERSION: process.env.npm_package_version,
  },
  
  // Experimental features
  experimental: {
    // Enable optimizations
    optimizeCss: true,
    scrollRestoration: true,
  },
  
  // Output configuration
  output: 'standalone',
  
  // Trailing slash
  trailingSlash: false,
  
  // Compression
  compress: true,
  
  // PoweredBy header
  poweredByHeader: false,
  
  // Generate ETags
  generateEtags: true,
  
  // Page extensions
  pageExtensions: ['js', 'jsx'],
  
  // TypeScript (even though we're not using it)
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // ESLint
  eslint: {
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;