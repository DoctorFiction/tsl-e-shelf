import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.gutenberg.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.atlaskitap.com",
        pathname: "/bakim/**",
      },
      {
        protocol: "https",
        hostname: "www.nobelyayin.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
