"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";
import type Lenis from "lenis";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, useGSAP);
  // Deux courbes maison : une sortie très douce (reveals) et un in-out appuyé (rideaux).
  CustomEase.create("reveal", "0.16, 1, 0.3, 1");
  CustomEase.create("curtain", "0.76, 0, 0.24, 1");
}

export { gsap, ScrollTrigger, SplitText, useGSAP };

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isTouch = () => typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;

/* ------------------------------------------------------------------ */
/* « Scène prête » : les intros de page attendent la fin du loader ou   */
/* du rideau de transition avant de jouer.                              */
/* ------------------------------------------------------------------ */
let ready = false;
const listeners = new Set<() => void>();

export const stage = {
  isReady: () => ready,
  setReady(value: boolean) {
    ready = value;
    if (!value) return;
    const queued = [...listeners];
    listeners.clear();
    queued.forEach((fn) => fn());
  },
  onReady(fn: () => void) {
    if (ready) {
      fn();
      return () => {};
    }
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};

/* Instance Lenis partagée (smooth scroll). */
let lenisInstance: Lenis | null = null;
export const scroller = {
  get: () => lenisInstance,
  set: (l: Lenis | null) => (lenisInstance = l),
  to(target: string | number | HTMLElement, immediate = false) {
    if (lenisInstance) lenisInstance.scrollTo(target, { immediate, offset: 0, duration: 1.6 });
    else if (typeof target === "number") window.scrollTo(0, target);
    else {
      const el = typeof target === "string" ? document.querySelector(target) : target;
      el?.scrollIntoView({ behavior: immediate ? "auto" : "smooth" });
    }
  },
};
