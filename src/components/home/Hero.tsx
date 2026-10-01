"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, stage, prefersReducedMotion } from "@/lib/motion";
import SplitReveal from "../motion/SplitReveal";
import Reveal from "../motion/Reveal";

const facts = [
  { label: "Basé à", value: "Lille, France" },
  { label: "Focus", value: "Full-stack TypeScript · Node · React" },
  { label: "Langues", value: "Français, anglais (C1), somali" },
  { label: "Disponibilité", value: "Ouvert à toute opportunité — CDI, CDD, freelance, alternance" },
];

export default function Hero() {
  const portrait = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = portrait.current!;
    const img = el.querySelector("img")!;
    if (prefersReducedMotion()) return;
    const badge = el.querySelector(".hero__badge");
    if (document.documentElement.dataset.intro === "new") {
      // Première visite : le cadre du loader vient se poser ici et devient ce portrait.
      gsap.set(el, { autoAlpha: 0 });
      gsap.set(img, { scale: 1.12 });
      const onHandoff = () => {
        gsap.set(el, { autoAlpha: 1 });
        gsap.from(badge, { autoAlpha: 0, y: 14, duration: 0.9, ease: "reveal" });
      };
      window.addEventListener("intro:handoff", onHandoff, { once: true });
    } else {
      // Dévoilement du portrait : le cadre s'ouvre par le bas pendant que l'image se détend.
      gsap.set(el, { clipPath: "inset(100% 0% 0% 0% round 10px)" });
      gsap.set(img, { scale: 1.35 });
      stage.onReady(() => {
        gsap.to(el, { clipPath: "inset(0% 0% 0% 0% round 10px)", duration: 1.8, ease: "curtain", delay: 0.5 });
        gsap.to(img, { scale: 1.12, duration: 2.2, ease: "reveal", delay: 0.5 });
      });
    }
    // Le soulignement de « Lille » se dessine à la main, après l'apparition du titre.
    // (SplitText déplace les nœuds : on interroge le DOM au moment de jouer.)
    gsap.set(".underline-draw path", { strokeDasharray: 1, strokeDashoffset: 1 });
    stage.onReady(() => gsap.to(".underline-draw path", { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut", delay: 1.3 }));
    gsap.fromTo(img, { yPercent: -5 }, {
      yPercent: 5,
      ease: "none",
      scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
    });
  });

  return (
    <section className="hero container" aria-label="Présentation">
      <SplitReveal as="h1" on="intro" delay={0.1} className="display-xl hero__title">
        Développeur basé à{" "}
        <em className="accent underline-draw">
          Lille
          <svg viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true">
            <path pathLength={1} d="M1 7 C 20 2, 45 9, 62 5 S 90 3, 99 6" />
          </svg>
        </em>
        . Je construis des produits web complets, de la base de données à l’interface, avec rigueur et caractère.
      </SplitReveal>

      <div className="hero__grid">
        <div className="hero__left">
          <Reveal on="intro" delay={0.7} stagger={0.08} className="hero__facts">
            {facts.map((f) => (
              <div className="fact" key={f.label}>
                <span className="label">{f.label}</span>
                <p>{f.value}</p>
              </div>
            ))}
          </Reveal>
          <Reveal on="intro" delay={1.1} className="hero__scroll">
            <span style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <i />
              <span className="label">Faites défiler — six projets, du schéma SQL au pixel</span>
            </span>
          </Reveal>
        </div>

        <div ref={portrait} className="hero__portrait">
          <Image src="/work/portrait.webp" alt="Portrait d’Abdoulrazack Abdillahi" fill priority sizes="(max-width: 860px) 100vw, 50vw" />
          <span className="hero__badge">
            <span className="pulse" aria-hidden="true" />
            Ouvert aux opportunités
          </span>
        </div>
      </div>
    </section>
  );
}
