import "@prompt-lens/env/web";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactCompiler: true,
  transpilePackages: [
    "@prompt-lens/db",
    "@prompt-lens/env",
    "@prompt-lens/auth",
    "@prompt-lens/common-types",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "logo.clearbit.com",
      },
      {
        protocol: "https",
        hostname: "www.google.com",
      },
    ]
  }
};

export default nextConfig;
