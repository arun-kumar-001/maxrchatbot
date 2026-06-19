import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self' https://niteshift.dev https://*.niteshift.dev",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
