import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/trpc/:path*",
        destination: `${process.env.API_URL ?? "http://localhost:8000"}/trpc/:path*`,
      },
    ];
  },
};

export default nextConfig;
