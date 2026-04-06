import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Enables static HTML export
  images: {
    unoptimized: true, // Required for static export if using next/image
  },
  basePath: process.env.NODE_ENV === "production" ? "/magitek_fitness" : "",
};

export default nextConfig;
