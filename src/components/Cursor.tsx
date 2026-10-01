"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap, isTouch } from "@/lib/motion";

/**
 * Curseur custom : un point en `difference` qui grossit sur les liens, et un disque
 * vermillon avec libellé sur tout élément `[data-cursor="Libellé"]`.
 */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    const el = ref.current;
    if (!el || isTouch()) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });

    const move = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      el.classList.remove("is-hidden");
    };
    const over = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      const labelled = target.closest<HTMLElement>("[data-cursor]");
      if (labelled) {
        setLabel(labelled.dataset.cursor || "");
        el.classList.add("is-label");
        el.classList.remove("is-hover");
        return;
      }
      el.classList.remove("is-label");
      el.classList.toggle("is-hover", !!target.closest("a, button, [role='button']"));
    };
    const leave = () => el.classList.add("is-hidden");

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  // Au changement de page, l'élément sous le curseur a disparu : on réinitialise.
  useEffect(() => {
    ref.current?.classList.remove("is-label", "is-hover");
  }, [pathname]);

  return (
    <div ref={ref} className="cursor is-hidden" aria-hidden="true">
      <div className="cursor__disc">{label}</div>
      <div className="cursor__dot" />
    </div>
  );
}
