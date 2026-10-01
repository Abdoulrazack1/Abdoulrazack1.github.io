"use client";

import { useRef } from "react";
import { gsap, useGSAP, stage, scroller, prefersReducedMotion } from "@/lib/motion";
import { featured } from "@/lib/projects";

const reel = [
  ...featured.map((p) => ({ src: p.cover, label: p.name, portrait: false })),
  { src: "/work/portrait.webp", label: "Abdoulrazack Abdillahi", portrait: true },
];
const NAME = "Abdoulrazack";

/** Une colonne de chiffres qui roule, façon compteur mécanique. */
function Digit({ max = 9, className }: { max?: number; className: string }) {
  // Un « 0 » supplémentaire en bout de bande : le passage à 100 roule vers l'avant.
  const digits = max === 9 ? [...Array.from({ length: 10 }, (_, i) => i), 0] : Array.from({ length: max + 1 }, (_, i) => i);
  return (
    <span className="digit">
      <span className={`digit__strip ${className}`}>
        {digits.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </span>
    </span>
  );
}

/**
 * Ouverture de première visite :
 * 1. un showreel des projets défile dans un cadre central, légendé ;
 * 2. le compteur mécanique suit le chargement réel (polices + images du reel) ;
 * 3. la dernière image est le portrait : le cadre change de forme et vole jusqu'à
 *    l'emplacement du portrait du hero pendant que le panneau se lève — il devient la photo.
 */
export default function Loader() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current!;
      const html = document.documentElement;
      if (html.dataset.intro === "seen" || prefersReducedMotion()) {
        root.style.display = "none";
        stage.setReady(true);
        return;
      }
      html.dataset.intro = "playing";
      scroller.get()?.stop();
      if ("scrollRestoration" in history) history.scrollRestoration = "manual";
      window.scrollTo(0, 0);

      const q = gsap.utils.selector(root);
      const panel = q(".loader__panel")[0];
      const frame = q(".loader__frame")[0] as HTMLElement;
      const imgs = q(".loader__img") as HTMLImageElement[];
      const strips = { h: q(".s-h")[0] as HTMLElement, t: q(".s-t")[0] as HTMLElement, o: q(".s-o")[0] as HTMLElement };
      const caption = q(".loader__caption-strip")[0] as HTMLElement;
      const index = q(".loader__caption-index")[0] as HTMLElement;

      const setCount = (v: number) => {
        const n = Math.min(100, Math.round(v));
        strips.h.style.transform = `translateY(${-Math.floor(n / 100)}em)`;
        strips.t.style.transform = `translateY(${n === 100 ? -10 : -(Math.floor(n / 10) % 10)}em)`;
        strips.o.style.transform = `translateY(${-(n % 10)}em)`;
      };
      const setCaption = (i: number) => {
        caption.style.transform = `translateY(${-i * 1.3}em)`;
        index.textContent = i === reel.length - 1 ? "(—)" : `(${String(i + 1).padStart(2, "0")})`;
      };

      const assets = Promise.all([
        document.fonts.ready,
        ...imgs.map((img) => (img.complete ? Promise.resolve() : new Promise((r) => (img.onload = img.onerror = r)))),
      ]);

      gsap.set(frame, { xPercent: -50, yPercent: -50 });
      gsap.set(imgs.slice(1), { clipPath: "inset(100% 0% 0% 0%)" });

      const progress = { v: 0 };
      const tl = gsap.timeline();
      tl.from(q(".loader__top > *"), { yPercent: 120, duration: 0.9, ease: "reveal", stagger: 0.06 })
        .from(q(".loader__name span"), { yPercent: 110, duration: 1.1, ease: "reveal", stagger: 0.03 }, 0.1)
        .from(q(".loader__digits"), { yPercent: 110, duration: 1.1, ease: "reveal" }, 0.2)
        .fromTo(frame, { clipPath: "inset(50% 50% 50% 50% round 4px)" }, { clipPath: "inset(0% 0% 0% 0% round 4px)", duration: 1.1, ease: "curtain" }, 0.25)
        .from(imgs[0], { scale: 1.45, duration: 1.6, ease: "reveal" }, 0.25)
        .from(q(".loader__caption"), { autoAlpha: 0, y: 10, duration: 0.8, ease: "reveal" }, 0.6);

      // Le reel accélère, puis ralentit sur le portrait.
      const gaps = [0.46, 0.4, 0.34, 0.3, 0.28, 0.42];
      let t = 1.1;
      imgs.slice(1).forEach((img, k) => {
        const i = k + 1;
        tl.to(img, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.6, ease: "curtain" }, t)
          .fromTo(img, { scale: 1.35 }, { scale: reel[i].portrait ? 1.12 : 1.04, duration: 1.1, ease: "reveal" }, t)
          .call(() => setCaption(i), [], Math.max(0, t - 0.08));
        t += gaps[k] ?? 0.3;
      });
      // Le compteur s'étale sur tout le reel : pas d'arrêt sur image avant la sortie.
      const span = t + 0.7;
      tl.to(progress, { v: 92, duration: span, ease: "power1.inOut", onUpdate: () => setCount(progress.v) }, 0)
        .to(q(".loader__bar"), { scaleX: 0.92, duration: span, ease: "power1.inOut" }, 0);

      let done = false;
      const finish = () => {
        if (done) return;
        done = true;

        const target = document.querySelector<HTMLElement>(".hero__portrait");
        const r = target?.getBoundingClientRect();
        const visible = !!r && r.top < innerHeight && r.bottom > 0 && r.width > 0;
        const heroImg = target?.querySelector("img");
        const portrait = imgs[imgs.length - 1];

        const out = gsap.timeline({
          onComplete: () => {
            window.dispatchEvent(new Event("intro:handoff"));
            root.style.display = "none";
            html.dataset.intro = "seen";
            try {
              sessionStorage.setItem("introSeen", "1");
            } catch {}
          },
        });
        out
          .to(progress, { v: 100, duration: 0.5, ease: "power2.out", onUpdate: () => setCount(progress.v) })
          .to(q(".loader__bar"), { scaleX: 1, duration: 0.5, ease: "power2.out" }, "<")
          .to(q(".loader__top > *, .loader__caption"), { yPercent: -120, autoAlpha: 0, duration: 0.6, ease: "curtain", stagger: 0.03 }, "+=0.15")
          .to(q(".loader__name span, .loader__digits"), { yPercent: -110, duration: 0.85, ease: "curtain", stagger: 0.015 }, "<")
          .to(q(".loader__bar"), { autoAlpha: 0, duration: 0.3 }, "<")
          .addLabel("fly", "-=0.35")
          .to(panel, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.25, ease: "curtain" }, "fly")
          .add(() => {
            scroller.get()?.start();
            stage.setReady(true);
          }, "fly+=0.5");

        if (visible && r) {
          // Le cadre rejoint exactement la place du portrait (position, taille, rayon, cadrage).
          const y = heroImg ? Number(gsap.getProperty(heroImg, "yPercent")) || 0 : 0;
          out
            .to(frame, { left: r.left, top: r.top, width: r.width, height: r.height, xPercent: 0, yPercent: 0, borderRadius: 10, duration: 1.35, ease: "curtain" }, "fly")
            .to(portrait, { scale: 1.12, yPercent: y, duration: 1.35, ease: "curtain" }, "fly");
        } else {
          out.to(frame, { autoAlpha: 0, scale: 0.9, duration: 0.8, ease: "curtain" }, "fly");
        }
      };

      Promise.all([assets, new Promise((r) => tl.eventCallback("onComplete", r))]).then(finish);
      const safety = window.setTimeout(finish, 7000);
      return () => window.clearTimeout(safety);
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="loader" aria-hidden="true">
      <div className="loader__panel">
        <div className="loader__top">
          <span className="label">Portfolio — édition 2026</span>
          <span className="label">50.63° N · 3.06° E</span>
          <span className="label">Développeur full-stack</span>
        </div>

        <div className="loader__caption">
          <span className="label loader__caption-index">(01)</span>
          <span className="loader__caption-slot">
            <span className="loader__caption-strip">
              {reel.map((r) => (
                <span key={r.label}>{r.label}</span>
              ))}
            </span>
          </span>
        </div>

        <div className="loader__bottom">
          <div className="loader__name">
            {Array.from(NAME).map((c, i) => (
              <span key={i}>{c}</span>
            ))}
            <span>
              <em>.</em>
            </span>
          </div>
          <div className="loader__digits">
            <Digit max={1} className="s-h" />
            <Digit className="s-t" />
            <Digit className="s-o" />
            <sup>%</sup>
          </div>
        </div>
        <div className="loader__bar" />
      </div>

      <div className="loader__frame">
        {reel.map((r, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={r.src} src={r.src} alt="" className={`loader__img ${r.portrait ? "is-portrait" : ""}`} fetchPriority={i < 2 ? "high" : "auto"} decoding="async" />
        ))}
      </div>
    </div>
  );
}
