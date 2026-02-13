import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  reactCompiler: true,
  images: {
    unoptimized: true, // Required for static export — images served as-is
  },
};

export default nextConfig;
