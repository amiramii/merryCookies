import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  images: {
    domains: ['cdn.sanity.io'],
  },
};

export default nextConfig;
