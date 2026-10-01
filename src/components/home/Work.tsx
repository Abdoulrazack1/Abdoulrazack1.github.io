"use client";

import { useRef } from "react";
import { featured, type Project } from "@/lib/projects";
import { gsap, useGSAP, ScrollTrigger, isTouch, prefersReducedMotion } from "@/lib/motion";
import { TLink } from "../Transition";
import Stage from "../Stage";
import SplitReveal from "../motion/SplitReveal";
import Reveal from "../motion/Reveal";

/** Carte projet : inclinaison 3D et reflet qui suivent le pointeur. */
function Card({ p, i }: { p: Project; i: number }) {
  const tilt = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = tilt.current!;
    if (isTouch() || prefersReducedMotion()) return;
    const rx = gsap.quickTo(el, "rotationX", { duration: 0.9, ease: "power3.out" });
    const ry = gsap.quickTo(el, "rotationY", { duration: 0.9, ease: "power3.out" });
    gsap.set(el, { transformPerspective: 1400 });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      rx((0.5 - y) * 7);
      ry((x - 0.5) * 9);
      el.style.setProperty("--mx", `${x * 100}%`);
      el.style.setProperty("--my", `${y * 100}%`);
    };
    const leave = () => {
      rx(0);
      ry(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  });

  return (
    <TLink href={`/projets/${p.slug}`} label={p.name} className="card" style={{ order: i }} data-cursor="Voir le projet" aria-label={`${p.name} — étude de cas`}>
      <div ref={tilt} className="card__tilt" style={{ position: "relative" }}>
        <span className="card__index">
          {String(i + 1).padStart(2, "0")} / {String(featured.length).padStart(2, "0")}
        </span>
        <span className="card__arrow" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 17 17 7M8 7h9v9" />
          </svg>
        </span>
        <Stage bg={p.stage} src={p.cover} url={p.url} alt={`Capture du projet ${p.name}`} priority={i < 2} />
      </div>
      <Reveal className="card__meta" y={20}>
        <h3 className="card__title">
          {p.name}
          {p.status && <span className="tag">{p.status}</span>}
        </h3>
        <span className="card__year">{p.category}</span>
      </Reveal>
      <Reveal y={16} delay={0.06}>
        <p className="card__line">{p.line}</p>
      </Reveal>
    </TLink>
  );
}

export default function Work() {
  const grid = useRef<HTMLDivElement>(null);
  const left = featured.filter((_, i) => i % 2 === 0);
  const right = featured.filter((_, i) => i % 2 === 1);

  // Les colonnes se penchent selon la vitesse du scroll, puis se redressent.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const cols = gsap.utils.toArray<HTMLElement>(".work-col");
      const skew = cols.map((c) => gsap.quickTo(c, "skewY", { duration: 0.8, ease: "power3.out" }));
      const clamp = gsap.utils.clamp(-3.5, 3.5);
      const st = ScrollTrigger.create({
        trigger: grid.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const v = clamp(self.getVelocity() / -500);
          skew.forEach((s, i) => s(i ? v * 0.7 : v));
        },
      });
      const settle = () => skew.forEach((s) => s(0));
      ScrollTrigger.addEventListener("scrollEnd", settle);
      return () => {
        st.kill();
        ScrollTrigger.removeEventListener("scrollEnd", settle);
      };
    },
    { scope: grid },
  );

  return (
    <section id="travaux" className="section container" aria-labelledby="travaux-title" style={{ paddingTop: 0 }}>
      <div className="section-head">
        <SplitReveal as="h2" className="display-l" id="travaux-title">
          Projets <em className="accent">choisis</em>
        </SplitReveal>
        <span className="count">(0{featured.length})</span>
      </div>

      <div ref={grid} className="work-grid">
        <div className="work-col">
          {left.map((p) => (
            <Card key={p.slug} p={p} i={featured.indexOf(p)} />
          ))}
        </div>
        <div className="work-col work-col--offset">
          {right.map((p) => (
            <Card key={p.slug} p={p} i={featured.indexOf(p)} />
          ))}
        </div>
      </div>
    </section>
  );
}
