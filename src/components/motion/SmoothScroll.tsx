"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, scroller, prefersReducedMotion } from "@/lib/motion";

/** Lenis piloté par le ticker GSAP : un seul RAF pour le scroll et les animations. */
export default function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true });
    scroller.set(lenis);
    // Le loader a pu démarrer avant Lenis : on respecte son verrou.
    if (document.documentElement.dataset.intro === "playing") lenis.stop();
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      scroller.set(null);
    };
  }, []);
  return null;
}
