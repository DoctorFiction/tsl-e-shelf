import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  images: {
    remotePatterns: [new URL("https://www.gutenberg.org/**")],
  },
};

export default nextConfig;
