/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  images: {
    domains: [
      'localhost',
      'ae01.alicdn.com', 
      'ae04.alicdn.com',
      'ae03.alicdn.com',
      'ae02.alicdn.com',
      'i.alicdn.com',
      'img.alicdn.com'
    ],
  },
  
  async redirects() {
    return [
      {
        source: '/',
        destination: '/products',
        permanent: false,
      },
    ];
  },
  
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
};

module.exports = nextConfig;
