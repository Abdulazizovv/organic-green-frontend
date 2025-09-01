import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
