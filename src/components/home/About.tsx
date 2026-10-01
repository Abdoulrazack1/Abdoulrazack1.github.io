"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/motion";
import SplitReveal from "../motion/SplitReveal";
import Reveal from "../motion/Reveal";

const statement =
  "J’ai d’abord étudié l’économie. Je suis devenu développeur par envie de fabriquer : aujourd’hui je modélise la donnée, je sécurise l’API et je soigne l’interface jusqu’au mouvement — parce qu’un produit se juge en entier.";

const path = [
  { when: "2026 →", title: "Concepteur Développeur d’Applications", desc: "Titre niveau 6, en alternance — je cherche l’entreprise qui m’accueille.", where: "Alternance", now: true },
  { when: "2026", title: "Développeur Web & Web Mobile", desc: "Titre professionnel RNCP niveau 5 : front-end, back-end, RGAA, RGPD, SQL.", where: "Titre pro" },
  { when: "2025", title: "Bootcamp chef de projet", desc: "280 h : charte projet, parties prenantes, budget, ROI et planning.", where: "M2i" },
  { when: "2020 — 22", title: "Master Économie et Management Publics", desc: "Parcours développement économique, institutions, entreprises, territoires.", where: "Université de Lille" },
  { when: "2017 — 20", title: "Licence Économie et Gestion", desc: "Parcours économie et management des entreprises.", where: "Université de Lille" },
];

export default function About() {
  const text = useRef<HTMLParagraphElement>(null);

  // Le texte s'allume mot à mot, au rythme du scroll.
  useGSAP(() => {
    if (prefersReducedMotion()) return;
    const words = text.current!.querySelectorAll(".w");
    gsap.to(words, {
      opacity: 1,
      ease: "none",
      stagger: 0.1,
      scrollTrigger: { trigger: text.current, start: "top 80%", end: "bottom 45%", scrub: 0.6 },
    });
  });

  return (
    <section id="a-propos" className="section container" aria-labelledby="a-propos-title">
      <div className="section-head">
        <SplitReveal as="h2" className="display-l" id="a-propos-title">
          À <em className="accent">propos</em>
        </SplitReveal>
        <span className="count">(Parcours)</span>
      </div>

      <p ref={text} className="about__text">
        {statement.split(" ").map((w, i) => (
          <span key={i}>
            <span className="w">{w}</span>{" "}
          </span>
        ))}
      </p>

      <div className="about__grid">
        <Reveal className="about__intro" stagger={0.08}>
          <p>
            Mes projets sont mon terrain : un média en production, une plateforme pour un club, une autre pour un cabinet d’avocats où la sécurité est portée par PostgreSQL, et des outils IA que j’utilise tous les jours.
          </p>
          <p>
            Ce que je vise : une UX qui ne fait pas perdre de temps, des interfaces qui ont du caractère, et un back-end qu’on n’a pas besoin de surveiller. La culture japonaise — manga, design éditorial — irrigue souvent mes choix visuels.
          </p>
        </Reveal>

        <ol className="timeline">
          {path.map((s) => (
            <Reveal as="li" key={s.title} className={s.now ? "is-now" : undefined} y={24}>
              <span className="when">{s.when}</span>
              <div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
              <span className="where">{s.where}</span>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
