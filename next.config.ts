import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL;

    if (!backendUrl) {
      return [];
    }

    return [
      {
        // Exclude only NextAuth internal endpoints from the backend rewrite
        source: '/api/:path((?!auth/(?:session|callback|signin|signout|csrf|providers|error)(?:/|$)).*)',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
