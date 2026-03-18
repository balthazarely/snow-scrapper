const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/api\.open-meteo\.com\/.*/,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "open-meteo-cache",
        expiration: { maxAgeSeconds: 60 * 60 },
      },
    },
    {
      urlPattern: /\/api\/snow/,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "snow-report-cache",
        expiration: { maxAgeSeconds: 60 * 60 * 6 },
      },
    },
    {
      urlPattern: /\/_next\/static\/.*/,
      handler: "CacheFirst",
      options: {
        cacheName: "static-assets",
        expiration: { maxAgeSeconds: 60 * 60 * 24 * 30 },
      },
    },
  ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},
  outputFileTracingRoot: require("path").join(__dirname),
};

module.exports = withPWA(nextConfig);
