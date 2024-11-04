import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    XAPI_KEY: process.env.XAPI_KEY,
  },
};

export default nextConfig;
