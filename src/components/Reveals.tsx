"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Apparition discrète au défilement : chaque [data-reveal] reçoit .is-in
 * quand il entre dans l'écran. Sans JS, le CSS laisse tout visible.
 */
export default function Reveals() {
  const path = usePathname();
  useEffect(() => {
    document.documentElement.classList.add("js-reveal");
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [path]);
  return null;
}
