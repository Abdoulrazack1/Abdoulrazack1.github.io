import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Les visuels sont pré-optimisés en WebP (scripts/assets.mjs) : pas de transcodage
  // à la volée, qui provoquait des saccades au premier scroll.
  images: { unoptimized: true },
};

export default nextConfig;
