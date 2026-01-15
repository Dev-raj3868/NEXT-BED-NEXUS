/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /src\/pages\//,
      exclude: /node_modules/,
    });
    return config;
  },
}

module.exports = nextConfig
