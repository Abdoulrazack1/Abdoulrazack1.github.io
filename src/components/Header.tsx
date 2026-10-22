"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { site } from "@/lib/site";
import ThemeToggle from "./ThemeToggle";
import { ArrowIcon } from "./Icons";

const LINKS = [
  { href: "/#projets", label: "Projets" },
  { href: "/#apropos", label: "À propos" },
  { href: "/#parcours", label: "Parcours" },
  { href: site.github, label: "GitHub", external: true },
];

/**
 * Navigation fixe. Transparente sur l'ouverture sombre, elle prend un fond dès qu'on défile.
 * Le bouton « Me contacter » flottant apparaît une fois l'ouverture dépassée.
 */
export default function Header({ solid = false }: { solid?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [past, setPast] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      setPast(window.scrollY > window.innerHeight * 0.9);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className={`header${scrolled || solid ? " is-scrolled" : ""}${open ? " is-open" : ""}`}>
        <Link href="/" className="header__brand" onClick={() => setOpen(false)}>
          <span className="header__logo" aria-hidden="true">
            <i />
            <i />
          </span>
          Abdoulrazack A.
        </Link>
        <nav className="header__nav" aria-label="Navigation principale">
          {LINKS.map((l) =>
            l.external ? (
              <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer">
                {l.label}
              </a>
            ) : (
              <Link key={l.label} href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ),
          )}
        </nav>
        <div className="header__end">
          <ThemeToggle />
          <a href={`mailto:${site.email}`} className="pill pill--light header__cta">
            Me contacter <ArrowIcon size={14} />
          </a>
          <button type="button" className="header__burger" aria-label={open ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
            <span />
            <span />
          </button>
        </div>
      </header>
      <a href={`mailto:${site.email}`} className={`float-cta${past ? " is-visible" : ""}`} tabIndex={past ? 0 : -1}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        Parlons de votre projet <ArrowIcon size={13} />
      </a>
    </>
  );
}
