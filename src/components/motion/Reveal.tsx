"use client";

import { useRef, type ElementType, type ReactNode, type CSSProperties } from "react";
import { gsap, useGSAP, stage, prefersReducedMotion } from "@/lib/motion";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  on?: "intro" | "scroll";
  delay?: number;
  y?: number;
  /** Anime les enfants directs en cascade plutôt que le bloc entier. */
  stagger?: number;
};

export default function Reveal({ as: Tag = "div", children, className, style, on = "scroll", delay = 0, y = 36, stagger }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      const targets = stagger ? Array.from(el.children) : el;
      const tween = gsap.from(targets, {
        y,
        autoAlpha: 0,
        duration: 1.2,
        ease: "reveal",
        delay,
        stagger: stagger ?? 0,
        paused: on === "intro",
        scrollTrigger: on === "scroll" ? { trigger: el, start: "top 90%", once: true } : undefined,
      });
      if (on === "intro") return stage.onReady(() => tween.play());
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}
