# Portfolio — Abdoulrazack Abdillahi

En ligne : **https://abdoulrazack1.github.io** — chaque push sur `main` redéploie (GitHub Actions → Pages, export statique `out/`).

Next.js 16 · React 19 · TypeScript · GSAP (ScrollTrigger, SplitText, CustomEase) · Lenis.

```bash
npm install
npm run dev      # http://localhost:3002
npm run build && npm start
```

- Contenu des projets : `src/lib/projects.ts` (données + études de cas) et `src/lib/site.ts` (identité, liens).
- Visuels : `node scripts/assets.mjs` régénère `public/work/*.webp` depuis les dépôts des projets.
- Contrôle qualité : `node scripts/tour.mjs <url>` (captures au scroll), `node scripts/fps.mjs <url>` (fluidité).
- Thème clair par défaut, sombre au choix (bouton dans la barre de navigation, mémorisé).
- Image de partage : `node scripts/og.mjs` régénère `public/og.png`.
- Mouvement réduit respecté (`prefers-reduced-motion`), intro jouée une fois par session.
