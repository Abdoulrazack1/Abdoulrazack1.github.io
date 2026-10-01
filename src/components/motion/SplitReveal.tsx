"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, useGSAP, stage, prefersReducedMotion } from "@/lib/motion";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** "intro" : joue quand la scène est prête (loader / rideau). "scroll" : à l'entrée dans le viewport. */
  on?: "intro" | "scroll";
  delay?: number;
  stagger?: number;
  id?: string;
};

/**
 * Révélation ligne par ligne derrière un masque — la signature des sites éditoriaux.
 * autoSplit redécoupe au resize / chargement des polices sans casser l'animation.
 */
export default function SplitReveal({ as: Tag = "div", children, className, on = "scroll", delay = 0, stagger = 0.09, id }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (prefersReducedMotion()) {
        gsap.set(el, { visibility: "visible" });
        return;
      }
      let played = false;
      let cancel = () => {};
      const split = SplitText.create(el, {
        type: "lines",
        mask: "lines",
        linesClass: "split-line",
        autoSplit: true,
        onSplit(self) {
          gsap.set(el, { visibility: "visible" });
          if (played) return;
          const tween = gsap.from(self.lines, {
            yPercent: 115,
            rotate: 2.5,
            transformOrigin: "0% 0%",
            duration: 1.35,
            ease: "reveal",
            stagger,
            delay,
            paused: true,
            onComplete: () => {
              played = true;
            },
            ...(on === "scroll" ? { scrollTrigger: { trigger: el, start: "top 88%", once: true }, paused: false } : {}),
          });
          if (on === "intro") cancel = stage.onReady(() => tween.play());
          return tween;
        },
      });
      return () => {
        cancel();
        split.revert();
      };
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className} data-split="" id={id}>
      {children}
    </Tag>
  );
}
