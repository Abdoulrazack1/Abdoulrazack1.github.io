import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Site 100 % statique (GitHub Pages) : chaque page est un fichier HTML pré-rendu.
  output: "export",
  trailingSlash: true,
  // Les visuels sont pré-optimisés en WebP (scripts/assets.mjs) : pas de transcodage
  // à la volée, qui provoquait des saccades au premier scroll.
  images: { unoptimized: true },
};

export default nextConfig;
