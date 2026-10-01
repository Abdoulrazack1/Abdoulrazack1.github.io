"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/motion";
import { site } from "@/lib/site";
import { useLilleTime } from "./Nav";
import Roll from "./motion/Roll";
import Magnetic from "./motion/Magnetic";
import SplitReveal from "./motion/SplitReveal";

const socials = [
  { label: "GitHub", href: site.github },
  { label: "LinkedIn", href: site.linkedin },
];

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const time = useLilleTime();

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      // Signature finale : les lettres montent une à une, au rythme du scroll.
      gsap.from(".signature span", {
        yPercent: 105,
        ease: "none",
        stagger: 0.05,
        scrollTrigger: { trigger: ".signature", start: "top bottom", end: "bottom bottom", scrub: 0.8 },
      });
      // L'adresse monte et se redresse à mesure que le footer entre dans l'écran.
      gsap.from(".footer__email", {
        yPercent: 40,
        rotate: 2,
        transformOrigin: "0% 100%",
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top bottom", end: "top 20%", scrub: true },
      });
    },
    { scope: ref },
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  return (
    <footer ref={ref} id="contact" className="footer">
      <div className="container">
        <SplitReveal as="p" className="display-m" stagger={0.06}>
          Une alternance, un projet, une idée ? <em className="accent">Travaillons ensemble.</em>
        </SplitReveal>

        <button type="button" className="footer__email roll-host" onClick={copy} data-cursor="Copier" aria-label={`Copier l’adresse ${site.email}`}>
          <Roll text={site.email} />
        </button>

        <div className="footer__row">
          <span>
            Conçu et développé par {site.name} · {new Date().getFullYear()}
          </span>
          <span className="nav__time" suppressHydrationWarning>
            Lille — {time}
          </span>
          <div className="footer__socials">
            <Magnetic>
              <a href={`mailto:${site.email}`} className="pill pill--ghost roll-host">
                <Roll text="Écrire un email" />
              </a>
            </Magnetic>
            {socials.map((s) => (
              <Magnetic key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="pill pill--ghost roll-host">
                  <Roll text={s.label} />
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M7 17 17 7M8 7h9v9" />
                  </svg>
                </a>
              </Magnetic>
            ))}
          </div>
        </div>
      </div>

      <div className="signature" aria-hidden="true">
        {Array.from("Abdoulrazack").map((c, i) => (
          <span key={i}>{c}</span>
        ))}
        <span>
          <em>.</em>
        </span>
      </div>

      <div className={`toast ${copied ? "is-on" : ""}`} role="status" aria-live="polite">
        {copied ? "Adresse copiée — à vous de jouer." : ""}
      </div>
    </footer>
  );
}
