# Portfolio — Abdoulrazack Abdillahi

Next.js 16 · React 19 · TypeScript · GSAP (ScrollTrigger, SplitText, CustomEase) · Lenis.

```bash
npm install
npm run dev      # http://localhost:3002
npm run build && npm start
```

- Contenu des projets : `src/lib/projects.ts` (données + études de cas) et `src/lib/site.ts` (identité, liens).
- Visuels : `node scripts/assets.mjs` régénère `public/work/*.webp` depuis les dépôts des projets.
- Contrôle qualité : `node scripts/tour.mjs <url>` (captures au scroll), `node scripts/fps.mjs <url>` (fluidité).
- Mouvement réduit respecté (`prefers-reduced-motion`), intro jouée une fois par session.
