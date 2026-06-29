import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // We sit inside ~/projects; pin the root so Turbopack ignores stray
  // parent lockfiles.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
