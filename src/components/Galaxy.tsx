"use client";

import { useEffect, useRef } from "react";

// Couleurs des particules : celles de l'identité, adoucies par la transparence.
const COLORS = ["#8e99ff", "#ff9ad5", "#ffd23f", "#ffffff", "#5b68ff"];

type Star = { r: number; a: number; y: number; size: number; color: number; tw: number };

/**
 * Galaxie spirale en particules (canvas 2D) : deux bras, vue inclinée, rotation lente,
 * légère parallaxe à la souris. S'arrête hors écran ; image fixe si mouvement réduit.
 */
export default function Galaxy({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 760px)").matches;

    const stars: Star[] = [];
    const ARMS = 2;
    const COUNT = mobile ? 1800 : 4600;
    for (let i = 0; i < COUNT; i++) {
      const arm = i % ARMS;
      const t = Math.pow(Math.random(), 0.6); // plus dense vers le centre
      const r = 0.04 + t * 0.96;
      const spread = (Math.random() - 0.5) * (0.5 - t * 0.28);
      stars.push({
        r,
        a: arm * Math.PI + r * 5.2 + spread * 2.4,
        y: (Math.random() - 0.5) * 0.05 * (1 - t),
        size: Math.random() < 0.07 ? 2.4 : Math.random() < 0.45 ? 1.5 : 1,
        color: Math.random() < 0.55 ? 0 : Math.floor(Math.random() * COLORS.length),
        tw: Math.random() * Math.PI * 2,
      });
    }
    // Fond d'étoiles fixes, très discret.
    const dust = Array.from({ length: mobile ? 60 : 140 }, () => ({ x: Math.random(), y: Math.random(), s: Math.random() * 1.1 + 0.3 }));

    let w = 0;
    let h = 0;
    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let mx = 0;
    let my = 0;
    let tx = 0;
    let ty = 0;
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !reduced) loop(performance.now());
    });
    io.observe(canvas);

    const draw = (time: number) => {
      mx += (tx - mx) * 0.04;
      my += (ty - my) * 0.04;
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = "rgba(255,255,255,0.5)";
      for (const d of dust) ctx.fillRect(d.x * w, d.y * h, d.s, d.s);

      // Centre décalé à droite sur grand écran, comme une affiche ; centré sur mobile.
      const cx = w * (mobile ? 0.5 : 0.7) + mx * 18;
      const cy = h * (mobile ? 0.72 : 0.52) + my * 12;
      const R = Math.min(w * (mobile ? 0.7 : 0.48), h * 1.05);
      const rot = time * 0.00004;
      const tilt = 0.34 + my * 0.03;
      const skew = -0.38;

      for (const s of stars) {
        const ang = s.a + rot / (0.35 + s.r);
        const x = Math.cos(ang) * s.r * R;
        const z = Math.sin(ang) * s.r * R;
        const px = cx + x * Math.cos(skew) - z * tilt * Math.sin(skew);
        const py = cy + x * Math.sin(skew) + z * tilt * Math.cos(skew) + s.y * R;
        const alpha = 0.5 + 0.5 * Math.abs(Math.sin(time * 0.0012 + s.tw));
        ctx.globalAlpha = alpha * (1 - s.r * 0.25);
        ctx.fillStyle = COLORS[s.color];
        ctx.fillRect(px, py, s.size, s.size);
      }
      ctx.globalAlpha = 1;
    };

    const loop = (time: number) => {
      cancelAnimationFrame(raf);
      if (!visible) return;
      draw(time);
      raf = requestAnimationFrame(loop);
    };

    if (reduced) draw(0);
    else raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={ref} className={`galaxy ${className}`} aria-hidden="true" />;
}
