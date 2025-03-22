import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    API_BASE_URL: process.env.API_BASE_URL,
    X_API_KEY: process.env.X_API_KEY,
    STRORAGE_PREFIX: process.env.STRORAGE_PREFIX,
    STRORAGE_ENCRYPT_KEY: process.env.STRORAGE_ENCRYPT_KEY,
  },
};

export default nextConfig;
