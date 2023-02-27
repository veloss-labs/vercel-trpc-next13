const isProduction = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Recommended for the `pages` directory, default in `app`.
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  poweredByHeader: false,
  compress: true,
  compiler: {
    removeConsole: isProduction
      ? {
          exclude: ['error', 'warn'],
        }
      : false,
  },
  // 서버 환경인 경우 dist/polyfill.js를 main.js에 추가해준다.
  webpack: (config, { isServer }) => {
    // if (isServer) {
      const originalEntry = config.entry;
      config.entry = async () => {
        const entries = await originalEntry();
        const urlPolyfill = './scripts/dist/polyfill.js';
        if (entries['main-app.js'] && !entries['main-app.js'].includes(urlPolyfill)) {
          entries['main-app.js'].unshift(urlPolyfill);
        }
        return entries;
      };
    // }

    return config;
  },
  headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/(.*)',
        headers: [
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
