"use client";

import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode, type MouseEvent, type AnchorHTMLAttributes } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap, ScrollTrigger, stage, scroller, prefersReducedMotion } from "@/lib/motion";

type Ctx = { navigate: (href: string, label?: string) => void };
const TransitionContext = createContext<Ctx>({ navigate: () => {} });

/**
 * Transitions de page en deux temps : deux panneaux (vermillon puis encre) montent,
 * le nom de la destination apparaît, la route change derrière, puis tout se lève.
 */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const root = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const busy = useRef(false);
  const pendingHash = useRef<string | null>(null);
  const first = useRef(true);

  const navigate = useCallback(
    (href: string, label = "") => {
      const url = new URL(href, window.location.href);
      if (url.pathname === window.location.pathname) {
        if (url.hash) scroller.to(url.hash);
        else scroller.to(0);
        return;
      }
      if (busy.current) return;
      if (prefersReducedMotion()) {
        router.push(url.pathname + url.hash);
        return;
      }
      busy.current = true;
      pendingHash.current = url.hash || null;
      stage.setReady(false);
      scroller.get()?.stop();
      if (labelRef.current) labelRef.current.textContent = label;

      const el = root.current!;
      gsap
        .timeline({ onComplete: () => router.push(url.pathname, { scroll: false }) })
        .set(el, { visibility: "visible" })
        .fromTo(".curtain__panel--accent", { yPercent: 100 }, { yPercent: 0, duration: 0.75, ease: "curtain" })
        .fromTo(".curtain__panel--ink", { yPercent: 100 }, { yPercent: 0, duration: 0.8, ease: "curtain" }, 0.1)
        .fromTo(".curtain__label span", { yPercent: 110 }, { yPercent: 0, duration: 0.8, ease: "reveal" }, 0.55);
    },
    [router],
  );

  // La nouvelle route est montée derrière le rideau : on la révèle.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!busy.current) {
      // Navigation navigateur (précédent / suivant).
      ScrollTrigger.refresh();
      stage.setReady(true);
      return;
    }
    scroller.to(0, true);
    window.scrollTo(0, 0);
    const el = root.current!;
    let raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        gsap
          .timeline({
            onComplete: () => {
              gsap.set(el, { visibility: "hidden" });
              busy.current = false;
              if (pendingHash.current) scroller.to(pendingHash.current);
              pendingHash.current = null;
            },
          })
          .to(".curtain__label span", { yPercent: -110, duration: 0.6, ease: "curtain" })
          .add(() => {
            scroller.get()?.start();
            stage.setReady(true);
          }, 0.25)
          .to(".curtain__panel--ink", { yPercent: -100, duration: 0.9, ease: "curtain" }, 0.2)
          .to(".curtain__panel--accent", { yPercent: -100, duration: 0.9, ease: "curtain" }, 0.3);
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      <div ref={root} className="curtain" aria-hidden="true">
        <div className="curtain__panel curtain__panel--accent" />
        <div className="curtain__panel curtain__panel--ink">
          <div className="curtain__label">
            <span ref={labelRef} />
          </div>
        </div>
      </div>
    </TransitionContext.Provider>
  );
}

export const useTransition = () => useContext(TransitionContext);

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; label?: string };

/** Lien interne qui passe par le rideau. Garde le comportement natif pour ctrl/cmd-clic. */
export function TLink({ href, label, onClick, children, ...rest }: LinkProps) {
  const { navigate } = useTransition();
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    navigate(href, label);
  };
  return (
    <a href={href} onClick={handle} {...rest}>
      {children}
    </a>
  );
}
