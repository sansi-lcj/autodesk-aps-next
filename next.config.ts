import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "developer.api.autodesk.com",
      },
    ],
  },
};

export default nextConfig;
