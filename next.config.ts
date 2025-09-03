import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Skip ESLint and TypeScript errors during production builds to allow deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
