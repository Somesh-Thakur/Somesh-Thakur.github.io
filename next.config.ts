import type { NextConfig } from "next";

// Static export: GitHub Pages serves the `out/` folder at someshthakur.tech.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
