"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

type Star = { x: number; y: number; z: number; r: number; tw: number };
type Spark = { x: number; y: number; vx: number; vy: number; life: number; max: number; r: number; hue: 0 | 1 };

/**
 * Ciel étoilé en profondeur (parallaxe au scroll, scintillement) + traînée de
 * particules qui suit le curseur. Un seul canvas, DPR plafonné, pause hors onglet.
 */
export default function StarField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const reduced = prefersReducedMotion();
    let w = 0,
      h = 0,
      dpr = 1,
      raf = 0,
      t = 0;
    let stars: Star[] = [];
    const sparks: Spark[] = [];
    const mouse = { x: -999, y: -999, px: -999, py: -999 };
    // Couleurs lues dans les tokens CSS : elles suivent le thème.
    const palette = { star: "#ece8e1", alpha: 1, accent: "#ff8a66", dark: true };
    const readTheme = () => {
      const cs = getComputedStyle(document.documentElement);
      palette.star = `rgb(${cs.getPropertyValue("--ink-rgb").trim()})`;
      palette.alpha = parseFloat(cs.getPropertyValue("--star-alpha")) || 1;
      palette.accent = cs.getPropertyValue("--accent").trim() || "#ff8a66";
      palette.dark = document.documentElement.dataset.theme === "dark";
    };
    readTheme();
    const observer = new MutationObserver(readTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(150, (w * h) / 9000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random() * 0.9 + 0.1,
        r: Math.random() * 1.1 + 0.25,
        tw: Math.random() * Math.PI * 2,
      }));
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const draw = () => {
      t += 0.016;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = palette.star;
      const sy = window.scrollY;

      for (const s of stars) {
        // Les étoiles proches défilent plus vite que les lointaines.
        let y = (s.y - sy * s.z * 0.12) % h;
        if (y < 0) y += h;
        const a = 0.25 + 0.55 * s.z * (0.6 + 0.4 * Math.sin(t * 1.4 + s.tw));
        // fillRect plutôt qu'arc : à cette taille, invisible à l'œil et bien moins coûteux.
        const size = s.r * s.z * 1.6 + 0.4;
        ctx.globalAlpha = a * palette.alpha;
        ctx.fillRect(s.x, y, size, size);
      }

      if (!reduced && mouse.px > -999) {
        const dx = mouse.x - mouse.px;
        const dy = mouse.y - mouse.py;
        const dist = Math.hypot(dx, dy);
        const n = Math.min(4, Math.floor(dist / 9));
        for (let i = 0; i < n; i++) {
          const k = i / Math.max(n, 1);
          sparks.push({
            x: mouse.px + dx * k + (Math.random() - 0.5) * 6,
            y: mouse.py + dy * k + (Math.random() - 0.5) * 6,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5 + 0.15,
            life: 0,
            max: 50 + Math.random() * 40,
            r: Math.random() * 1.4 + 0.5,
            hue: Math.random() < 0.35 ? 1 : 0,
          });
        }
      }
      mouse.px = mouse.x;
      mouse.py = mouse.y;

      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.985;
        const k = 1 - p.life / p.max;
        if (k <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = k * (palette.dark ? 0.85 : 0.6);
        ctx.fillStyle = p.hue ? palette.accent : palette.star;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * (0.4 + k * 0.6), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(draw);
    };

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(draw);
    };

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={ref} className="starfield" aria-hidden="true" />;
}
