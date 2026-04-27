// next.config.ts - Next.js configuration for production
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // React settings
  reactStrictMode: true,
  
  // Optimizations for serverless environments
  swcMinify: true,
  
  // Environment variables
  env: {
    // These will be embedded at build time if needed
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },

  // Redirects (add as needed)
  async redirects() {
    return [];
  },

  // Rewrites (add as needed)
  async rewrites() {
    return [];
  },

  // Webpack configuration
  webpack: (config, { isServer }) => {
    return config;
  },
};

export default nextConfig;
