"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap, useGSAP, scroller, stage, prefersReducedMotion } from "@/lib/motion";
import { TLink, useTransition } from "./Transition";
import Roll from "./motion/Roll";
import { site } from "@/lib/site";

const links = [
  { href: "/#travaux", label: "Travaux" },
  { href: "/#a-propos", label: "À propos" },
  { href: "/#labo", label: "Labo" },
];

export function useLilleTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, []);
  return time;
}

export default function Nav() {
  const nav = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const time = useLilleTime();
  const pathname = usePathname();
  const { navigate } = useTransition();

  // Apparition après l'intro, masquage au scroll vers le bas, retour au scroll vers le haut.
  useGSAP(() => {
    const el = nav.current!;
    if (!prefersReducedMotion()) {
      gsap.set(el, { yPercent: -100, autoAlpha: 0 });
      stage.onReady(() => gsap.to(el, { yPercent: 0, autoAlpha: 1, duration: 1.2, ease: "reveal", delay: 0.35, clearProps: "transform" }));
    }
    let last = 0;
    const onScroll = () => {
      const y = window.scrollY;
      el.classList.toggle("is-scrolled", y > 40);
      el.classList.toggle("is-hidden", y > 300 && y > last && !document.body.dataset.menu);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  });

  // Menu plein écran (mobile).
  useEffect(() => {
    const el = menu.current;
    if (!el) return;
    if (open) {
      document.body.dataset.menu = "1";
      scroller.get()?.stop();
      gsap
        .timeline()
        .set(el, { visibility: "visible" })
        .to(el, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "curtain" })
        .fromTo(".menu__links a span", { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: "reveal", stagger: 0.06 }, "-=0.45")
        .fromTo(".menu__foot", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, "-=0.5");
    } else if (document.body.dataset.menu) {
      delete document.body.dataset.menu;
      scroller.get()?.start();
      gsap.to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.8, ease: "curtain", onComplete: () => gsap.set(el, { visibility: "hidden" }) });
    }
  }, [open]);

  useEffect(() => setOpen(false), [pathname]);

  const go = (href: string) => {
    setOpen(false);
    window.setTimeout(() => navigate(href, "Accueil"), open ? 500 : 0);
  };

  return (
    <>
      <header ref={nav} className="nav">
        <div className="container nav__inner">
          <div className="nav__brand">
            <TLink href="/" label="Accueil" className="roll-host" aria-label="Accueil">
              <strong>
                <Roll text={site.shortName} />
              </strong>
            </TLink>
            <span className="nav__role">{site.role}</span>
          </div>

          <nav className="nav__links" aria-label="Navigation principale">
            {links.map((l) => (
              <TLink key={l.href} href={l.href} label="Accueil" className="roll-host">
                <Roll text={l.label} />
              </TLink>
            ))}
            <span className="nav__time" suppressHydrationWarning>
              Lille {time}
            </span>
            <TLink href="/#contact" label="Accueil" className="pill pill--light roll-host">
              <Roll text="Me contacter" />
            </TLink>
          </nav>

          <button className="nav__burger" aria-expanded={open} aria-controls="menu" aria-label={open ? "Fermer le menu" : "Ouvrir le menu"} onClick={() => setOpen((v) => !v)}>
            <span />
            <span />
          </button>
        </div>
      </header>

      <div ref={menu} id="menu" className="menu" aria-hidden={!open}>
        <nav className="menu__links" aria-label="Menu">
          {[...links, { href: "/#contact", label: "Contact" }].map((l) => (
            <a
              key={l.href}
              href={l.href}
              tabIndex={open ? 0 : -1}
              onClick={(e) => {
                e.preventDefault();
                go(l.href);
              }}
            >
              <span>{l.label}</span>
            </a>
          ))}
        </nav>
        <div className="menu__foot">
          <a href={`mailto:${site.email}`} tabIndex={open ? 0 : -1}>
            {site.email}
          </a>
          <span suppressHydrationWarning>Lille {time}</span>
        </div>
      </div>
    </>
  );
}
