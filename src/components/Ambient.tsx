"use client";

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger, isTouch, prefersReducedMotion } from "@/lib/motion";

/** Barre de progression de lecture + halo vermillon qui suit lentement le pointeur. */
export default function Ambient() {
  const bar = useRef<HTMLDivElement>(null);
  const halo = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const setBar = gsap.quickSetter(bar.current, "scaleX");
    const st = ScrollTrigger.create({ start: 0, end: "max", onUpdate: (self) => setBar(self.progress) });

    if (isTouch() || prefersReducedMotion()) return () => st.kill();
    const el = halo.current!;
    gsap.set(el, { x: window.innerWidth * 0.7, y: window.innerHeight * 0.3 });
    const xTo = gsap.quickTo(el, "x", { duration: 2.4, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 2.4, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };
    gsap.to(el, { opacity: 1, duration: 2, delay: 1 });
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      st.kill();
      window.removeEventListener("pointermove", move);
    };
  });

  return (
    <>
      <div ref={halo} className="halo" aria-hidden="true" />
      <div ref={bar} className="progress" aria-hidden="true" />
    </>
  );
}
