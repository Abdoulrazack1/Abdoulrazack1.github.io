"use client";

import { useRef } from "react";
import { gsap, useGSAP, stage, scroller, prefersReducedMotion } from "@/lib/motion";

const NAME = "Abdoulrazack";

/**
 * Intro de première visite : compteur 000 → 100 calé sur le chargement réel
 * (polices + images du premier écran), puis le panneau se lève comme un rideau.
 * Les visites suivantes de la session sautent l'intro (cf. script inline du layout).
 */
export default function Loader() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current!;
      const seen = document.documentElement.dataset.intro === "seen";
      if (seen || prefersReducedMotion()) {
        root.style.display = "none";
        stage.setReady(true);
        return;
      }
      scroller.get()?.stop();
      document.documentElement.dataset.intro = "playing";

      const count = root.querySelector<HTMLElement>(".loader__count")!;
      const progress = { v: 0 };
      const render = () => (count.textContent = String(Math.round(progress.v)).padStart(3, "0"));

      const assets = Promise.all([
        document.fonts.ready,
        ...Array.from(document.images)
          .filter((img) => img.loading !== "lazy")
          .slice(0, 4)
          .map((img) => (img.complete ? Promise.resolve() : new Promise((r) => img.addEventListener("load", r, { once: true })))),
      ]);

      const intro = gsap.timeline();
      intro
        .from(".loader__name span", { yPercent: 110, duration: 1.1, ease: "reveal", stagger: 0.035 })
        .from(".loader__meta", { autoAlpha: 0, y: 12, duration: 0.8, ease: "reveal", stagger: 0.08 }, 0.2)
        // On monte jusqu'à 80 pendant le chargement…
        .to(progress, { v: 80, duration: 1.6, ease: "power2.inOut", onUpdate: render }, 0)
        .to(".loader__bar", { scaleX: 0.8, duration: 1.6, ease: "power2.inOut" }, 0);

      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        const out = gsap.timeline({
          onComplete: () => {
            root.style.display = "none";
            document.documentElement.dataset.intro = "seen";
            try {
              sessionStorage.setItem("introSeen", "1");
            } catch {}
          },
        });
        out
          .to(progress, { v: 100, duration: 0.55, ease: "power2.out", onUpdate: render })
          .to(".loader__bar", { scaleX: 1, duration: 0.55, ease: "power2.out" }, "<")
          .to(".loader__name span, .loader__count", { yPercent: -110, duration: 0.8, ease: "curtain", stagger: 0.012 }, "+=0.1")
          .to(".loader__meta, .loader__bar", { autoAlpha: 0, duration: 0.4 }, "<")
          .to(root, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.1, ease: "curtain" }, "-=0.35")
          .add(() => {
            scroller.get()?.start();
            stage.setReady(true);
          }, "-=0.75");
      };

      // …et on termine quand les deux sont finis (avec un filet de sécurité).
      Promise.all([assets, new Promise((r) => intro.eventCallback("onComplete", r))]).then(finish);
      const safety = window.setTimeout(finish, 6000);
      return () => window.clearTimeout(safety);
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="loader" style={{ clipPath: "inset(0% 0% 0% 0%)" }} aria-hidden="true">
      <div className="loader__top">
        <span className="label loader__meta">Portfolio — édition 2026</span>
        <span className="label loader__meta">Lille, France</span>
      </div>
      <div className="loader__bottom">
        <div className="loader__name">
          {Array.from(NAME).map((c, i) => (
            <span key={i}>{c}</span>
          ))}
        </div>
        <div style={{ overflow: "hidden" }}>
          <div className="loader__count">000</div>
        </div>
      </div>
      <div className="loader__bar" />
    </div>
  );
}
