import { NextConfig } from "next";

const apiBase = process.env.NEXT_PUBLIC_ENDPOINT?.replace(/\/$/, "")!;

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiBase}/:path*`,
      },
    ];
  },
};

export default nextConfig;
