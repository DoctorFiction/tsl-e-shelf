import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  images: {
    remotePatterns: [
      new URL("https://www.gutenberg.org/**"),
      new URL("https://www.atlaskitap.com/bakim/nobelyayin.png"),
    ],
  },
};

export default nextConfig;
