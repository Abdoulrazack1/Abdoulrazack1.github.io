"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from "@/lib/motion";
import type { Project } from "@/lib/projects";
import Stage from "../Stage";
import { TLink } from "../Transition";

/** Couverture : la scène s'élargit jusqu'aux bords à mesure qu'on descend. */
export function CaseCover({ p }: { p: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        ".stage",
        { scale: 0.92 },
        { scale: 1, ease: "none", scrollTrigger: { trigger: ref.current, start: "top 85%", end: "top 15%", scrub: true } },
      );
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className="case-cover container">
      <Stage bg={p.stage} src={p.cover} url={p.url} alt={`Capture du projet ${p.name}`} priority sizes="100vw" depth={6} />
    </div>
  );
}

/** Chiffres clés : les valeurs numériques défilent jusqu'à leur valeur finale. */
export function Metrics({ items, className = "metrics" }: { items: { value: string; label: string }[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const cells = gsap.utils.toArray<HTMLElement>(".metric");
      gsap.from(cells, { y: 40, autoAlpha: 0, duration: 1.2, ease: "reveal", stagger: 0.08, scrollTrigger: { trigger: ref.current, start: "top 88%", once: true } });
      cells.forEach((cell) => {
        const strong = cell.querySelector("strong")!;
        // La valeur vient de l'attribut (le texte, lui, a pu être modifié par un run précédent).
        const raw = strong.dataset.value || "";
        const m = raw.match(/^(\d+)(\+?)$/);
        if (!m) return;
        const target = +m[1];
        const o = { v: 0 };
        strong.textContent = `0${m[2]}`;
        gsap.to(o, {
          v: target,
          duration: 1.8,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 88%", once: true },
          onUpdate: () => (strong.textContent = `${Math.round(o.v)}${m[2]}`),
        });
      });
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={className}>
      {items.map((m) => (
        <div className="metric" key={m.label}>
          <strong data-value={m.value}>{m.value}</strong>
          <span>{m.label}</span>
        </div>
      ))}
    </div>
  );
}

/** Galerie : épinglée, elle défile horizontalement pendant le scroll vertical. */
export function Gallery({ p }: { p: Project }) {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !track.current) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 761px)", () => {
        const distance = () => Math.max(0, track.current!.scrollWidth - window.innerWidth);
        if (distance() <= 0) return;
        const tween = gsap.to(track.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
        // Chaque image se décale légèrement dans son cadre : profondeur.
        gsap.utils.toArray<HTMLElement>(".gallery__item img").forEach((img) => {
          gsap.fromTo(
            img,
            { scale: 1.15, xPercent: -6 },
            { xPercent: 6, ease: "none", scrollTrigger: { trigger: img.parentElement, containerAnimation: tween, start: "left right", end: "right left", scrub: true } },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  if (p.gallery.length < 2) return null;

  return (
    <section ref={ref} className="gallery" aria-label="Galerie">
      <div className="container gallery__head">
        <h2 className="display-m">
          En <em className="accent">images</em>
        </h2>
        <span className="label">({String(p.gallery.length).padStart(2, "0")})</span>
      </div>
      <div ref={track} className="gallery__track">
        {p.gallery.map((g, i) => (
          <figure className="gallery__item" key={g.src + i}>
            <div className="media">
              <Image src={g.src} alt={g.caption} width={1800} height={1125} sizes="(max-width: 760px) 100vw, 62vw" />
            </div>
            <figcaption>
              <span className="label" style={{ marginRight: 12 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              {g.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export function NextProject({ p }: { p: Project }) {
  return (
    <TLink href={`/projets/${p.slug}`} label={p.name} className="next container" data-cursor="Suivant">
      <span className="label">Projet suivant</span>
      <div className="next__name">{p.name}</div>
      <p className="muted" style={{ marginTop: 18, maxWidth: 520 }}>
        {p.line}
      </p>
      <div className="next__img" aria-hidden="true">
        <Image src={p.cover} alt="" width={800} height={500} sizes="420px" />
      </div>
    </TLink>
  );
}

/** Rafraîchit ScrollTrigger une fois les images de la page chargées (hauteurs définitives). */
export function RefreshOnLoad() {
  useGSAP(() => {
    const imgs = Array.from(document.images).filter((i) => !i.complete);
    let pending = imgs.length;
    const done = () => --pending <= 0 && ScrollTrigger.refresh();
    imgs.forEach((i) => i.addEventListener("load", done, { once: true }));
  });
  return null;
}
