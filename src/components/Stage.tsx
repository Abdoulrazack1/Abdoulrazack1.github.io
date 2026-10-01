"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/motion";

type Props = {
  bg: string;
  src: string;
  url: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  /** Amplitude de la parallaxe du navigateur dans sa scène, en %. */
  depth?: number;
  className?: string;
};

/**
 * Une capture d'écran posée dans un navigateur flottant, sur une scène colorée.
 * La scène se dévoile par clip-path à l'entrée, le navigateur glisse en parallaxe.
 */
export default function Stage({ bg, src, url, alt, priority, sizes = "(max-width: 760px) 100vw, 50vw", depth = 10, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const el = ref.current!;
      gsap.fromTo(
        el,
        { clipPath: "inset(14% 8% 14% 8% round 10px)" },
        { clipPath: "inset(0% 0% 0% 0% round 10px)", duration: 1.6, ease: "reveal", scrollTrigger: { trigger: el, start: "top 92%", once: true } },
      );
      gsap.fromTo(
        ".frame",
        { yPercent: depth },
        { yPercent: -depth * 0.4, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } },
      );
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={`stage ${className}`}>
      <div className="stage__bg" style={{ background: bg }} />
      <div className="frame">
        <div className="frame__bar" aria-hidden="true">
          <i />
          <i />
          <i />
          <span className="frame__url">{url}</span>
        </div>
        <div className="frame__img">
          <Image src={src} alt={alt} width={1800} height={1125} sizes={sizes} priority={priority} />
        </div>
      </div>
      <div className="stage__sheen" aria-hidden="true" />
    </div>
  );
}
