"use client";

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from "@/lib/motion";

const rowA = ["TypeScript", "Node.js", "NestJS", "PostgreSQL", "React", "Next.js", "GSAP", "Three.js"];
const rowB = ["Express", "MySQL", "Redis", "Drizzle", "TensorFlow.js", "Electron", "Python", "GitHub Actions"];

const Star = () => (
  <svg className="marquee__star" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="currentColor" d="M12 0c.6 6.5 5.5 11.4 12 12-6.5.6-11.4 5.5-12 12-.6-6.5-5.5-11.4-12-12C6.5 11.4 11.4 6.5 12 0z" />
  </svg>
);

function Row({ items, ghost }: { items: string[]; ghost?: boolean }) {
  const content = items.map((t) => (
    <span className="marquee__item" key={t}>
      {t}
      <Star />
    </span>
  ));
  return (
    <div className={`marquee__row ${ghost ? "marquee__row--ghost" : ""}`}>
      <div style={{ display: "flex" }}>{content}</div>
      <div style={{ display: "flex" }} aria-hidden="true">
        {content}
      </div>
    </div>
  );
}

/** Deux rangées en sens opposé ; la vitesse du scroll les accélère et inverse leur sens. */
export default function Marquee() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const rows = gsap.utils.toArray<HTMLElement>(".marquee__row");
      const pos = [0, -50];
      const setters = rows.map((row) => gsap.quickSetter(row, "xPercent"));
      let dir = 1;
      let boost = 1;
      const st = ScrollTrigger.create({
        trigger: ref.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate(self) {
          dir = self.direction;
          boost = Math.max(boost, 1 + Math.min(Math.abs(self.getVelocity()) / 260, 6));
        },
      });
      // Position calculée à la main : sens et vitesse peuvent changer sans à-coup.
      const tick = (_: number, dt: number) => {
        boost += (1 - boost) * 0.06;
        const step = (dt / 1000) * 1.4 * boost * dir;
        pos.forEach((p, i) => {
          let next = p + (i ? step : -step);
          if (next <= -50) next += 50;
          if (next > 0) next -= 50;
          pos[i] = next;
          setters[i](next);
        });
      };
      gsap.ticker.add(tick);
      return () => {
        gsap.ticker.remove(tick);
        st.kill();
      };
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="marquee" aria-label="Technologies">
      <Row items={rowA} />
      <Row items={rowB} ghost />
    </section>
  );
}
