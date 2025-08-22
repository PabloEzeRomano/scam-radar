// next.config.mjs
const isDev = process.env.NODE_ENV !== 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/scam-radar',
  async redirects() {
    return isDev
      ? [
          {
            source: '/', // capturá la raíz
            destination: '/scam-radar',
            permanent: false,
            basePath: false, // importante: que NO duplique el basePath
          },
        ]
      : [];
  },
};

export default nextConfig;
