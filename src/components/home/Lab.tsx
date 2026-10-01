"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, isTouch } from "@/lib/motion";
import { lab } from "@/lib/projects";
import { TLink } from "../Transition";
import SplitReveal from "../motion/SplitReveal";
import Reveal from "../motion/Reveal";

/**
 * Index des expérimentations. Au survol, un aperçu suit le curseur avec inertie
 * et s'incline selon la vitesse ; l'image change en volet d'une ligne à l'autre.
 */
export default function Lab() {
  const wrap = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(-1);

  useGSAP(
    () => {
      const el = preview.current!;
      if (isTouch()) return;
      const xTo = gsap.quickTo(el, "x", { duration: 0.7, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.7, ease: "power3.out" });
      const rTo = gsap.quickTo(el, "rotation", { duration: 0.9, ease: "power3.out" });
      let lastX = 0;
      const move = (e: PointerEvent) => {
        const w = el.offsetWidth;
        const h = el.offsetHeight;
        xTo(e.clientX - w / 2);
        yTo(e.clientY - h / 2);
        rTo(gsap.utils.clamp(-12, 12, (e.clientX - lastX) * 0.6));
        lastX = e.clientX;
      };
      const list = wrap.current!;
      const enter = () => gsap.to(el, { autoAlpha: 1, scale: 1, duration: 0.6, ease: "reveal" });
      const leave = () => {
        gsap.to(el, { autoAlpha: 0, scale: 0.6, duration: 0.5, ease: "power3.out" });
        setActive(-1);
      };
      list.addEventListener("pointermove", move);
      list.addEventListener("pointerenter", enter);
      list.addEventListener("pointerleave", leave);
      return () => {
        list.removeEventListener("pointermove", move);
        list.removeEventListener("pointerenter", enter);
        list.removeEventListener("pointerleave", leave);
      };
    },
    { scope: wrap },
  );

  return (
    <section id="labo" className="section container" aria-labelledby="labo-title">
      <div className="section-head">
        <SplitReveal as="h2" className="display-l" id="labo-title">
          Labo & <em className="accent">archives</em>
        </SplitReveal>
        <span className="count">(0{lab.length})</span>
      </div>

      <div ref={wrap} className="lab">
        {lab.map((item, i) => {
          const inner = (
            <>
              <span className="lab__name">{item.name}</span>
              <span className="lab__desc">{item.desc}</span>
              <span className="lab__tags">{item.tags}</span>
              <span className="lab__year">{item.year}</span>
            </>
          );
          const common = { className: `lab__row ${item.href ? "" : "is-static"}`, onPointerEnter: () => setActive(i) };
          return (
            <Reveal key={item.name} y={20} delay={i * 0.04}>
              {item.internal ? (
                <TLink href={item.href} label={item.name} data-cursor="Étude de cas" {...common}>
                  {inner}
                </TLink>
              ) : item.href ? (
                <a href={item.href} target="_blank" rel="noopener noreferrer" data-cursor="GitHub ↗" {...common}>
                  {inner}
                </a>
              ) : (
                <div {...common} data-cursor="Dépôt privé">
                  {inner}
                </div>
              )}
            </Reveal>
          );
        })}

        <div ref={preview} className="preview" aria-hidden="true">
          {lab.map((item, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={item.image}
              src={item.image}
              alt=""
              loading="lazy"
              style={{ clipPath: i === active ? "inset(0% 0% 0% 0%)" : i < active ? "inset(0% 0% 100% 0%)" : "inset(100% 0% 0% 0%)" }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
