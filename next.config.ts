import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'api.organicgreen.uz',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'api.organicgreen.uz',
        pathname: '/media/**',
      },
    ],
  },
};

export default nextConfig;
