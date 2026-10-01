"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/motion";
import SplitReveal from "../motion/SplitReveal";
import { TLink } from "../Transition";
import Magnetic from "../motion/Magnetic";
import Roll from "../motion/Roll";

const services = [
  { t: "Produits full-stack", d: "De l’idée à la mise en ligne : modélisation, API, interface, déploiement. Un seul interlocuteur qui comprend toute la chaîne." },
  { t: "Back-end & sécurité", d: "Node, NestJS, PostgreSQL, MySQL. Authentification, rôles, Row-Level Security, audit — la sécurité pensée dès le schéma." },
  { t: "Interfaces & motion", d: "Des interfaces qui ont du caractère : typographie, rythme, transitions. Animées avec GSAP, sans sacrifier performance ni accessibilité." },
  { t: "Données & intégrations", d: "API tierces, OAuth, scraping, pipelines d’import. Faire parler des systèmes qui n’ont pas été conçus pour se comprendre." },
  { t: "Outils IA & ML", d: "Serveurs MCP, modèles TensorFlow.js, LLM locaux. L’IA comme outil concret, pas comme argument marketing." },
  { t: "Qualité & industrialisation", d: "Tests, CI GitHub Actions, audits et remédiation, éco-conception. Du code qu’on peut reprendre sans le craindre." },
];

export default function Services() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>(".service").forEach((el, i) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 88%", once: true }, delay: (i % 3) * 0.08 });
        tl.from(el.querySelector(".hairline"), { scaleX: 0, duration: 1.4, ease: "curtain" })
          .from(el.querySelectorAll(".service__num, h3, p"), { y: 30, autoAlpha: 0, duration: 1.1, ease: "reveal", stagger: 0.07 }, 0.2);
      });
    },
    { scope: ref },
  );

  return (
    <section id="expertise" className="section container" aria-labelledby="expertise-title">
      <div className="section-head">
        <SplitReveal as="h2" className="display-l" id="expertise-title">
          Ce que je <em className="accent">fais</em>
        </SplitReveal>
        <span className="count">(06)</span>
      </div>

      <div ref={ref} className="services">
        {services.map((s, i) => (
          <article className="service" key={s.t}>
            <div className="hairline" />
            <span className="service__num">0{i + 1}</span>
            <h3>{s.t}</h3>
            <p>{s.d}</p>
          </article>
        ))}
      </div>

      <div className="cta-strip">
        <SplitReveal as="p">
          Un projet, une alternance ? <em className="accent">Parlons-en.</em>
        </SplitReveal>
        <Magnetic>
          <TLink href="/#contact" className="pill pill--light roll-host">
            <Roll text="Me contacter" />
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </TLink>
        </Magnetic>
      </div>
    </section>
  );
}
