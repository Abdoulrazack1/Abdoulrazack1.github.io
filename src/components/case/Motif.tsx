import type { Motif as MotifName } from "@/lib/caseThemes";
import Galaxy from "../Galaxy";

/** Élément décoratif de l'en-tête, différent pour chaque projet. Purement visuel. */
export default function Motif({ name }: { name: MotifName }) {
  switch (name) {
    case "kanji":
      return (
        <div className="motif motif--kanji" aria-hidden="true">
          積ん読
        </div>
      );

    case "seal":
      return (
        <svg className="motif motif--seal" viewBox="0 0 300 300" aria-hidden="true">
          <defs>
            <path id="seal-ring" d="M150 150m-112 0a112 112 0 1 1 224 0a112 112 0 1 1-224 0" />
          </defs>
          <circle cx="150" cy="150" r="140" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="150" cy="150" r="88" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <text fontSize="17" letterSpacing="5" fill="currentColor">
            <textPath href="#seal-ring">SECRET PROFESSIONNEL · ROW-LEVEL SECURITY · AUDIT CHAÎNÉ ·</textPath>
          </text>
          <path d="M150 104l38 16v30c0 26-17 44-38 52-21-8-38-26-38-52v-30z" fill="none" stroke="currentColor" strokeWidth="3" />
          <path d="M134 152l11 11 22-24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case "galaxy":
      return (
        <div className="motif motif--galaxy" aria-hidden="true">
          <Galaxy className="galaxy--case" />
        </div>
      );

    case "route":
      return (
        <svg className="motif motif--route" viewBox="0 0 800 260" preserveAspectRatio="none" aria-hidden="true">
          <path className="route__fill" d="M0 210 C60 200 90 150 150 160 S240 90 300 110 S390 40 460 70 S560 150 620 120 S720 60 800 90 V260 H0Z" />
          <path className="route__line" d="M0 210 C60 200 90 150 150 160 S240 90 300 110 S390 40 460 70 S560 150 620 120 S720 60 800 90" />
          <circle cx="460" cy="70" r="7" />
          <text x="472" y="58">profil d’altitude</text>
        </svg>
      );

    case "scribble":
      return (
        <svg className="motif motif--scribble" viewBox="0 0 360 260" aria-hidden="true">
          <path d="M40 150c30-80 140-120 220-80s50 140-60 150S10 200 60 120" fill="none" />
          <path d="M250 40c20 10 40 30 46 56M282 84l14 14 8-22" fill="none" />
          <path d="M70 230c40-8 120-10 200 2" fill="none" />
          <text x="110" y="160">idée !</text>
        </svg>
      );

    case "speed":
      return <div className="motif motif--speed" aria-hidden="true" />;

    case "gauge":
      return (
        <svg className="motif motif--gauge" viewBox="0 0 240 240" aria-hidden="true">
          <circle cx="120" cy="120" r="96" fill="none" strokeWidth="18" className="gauge__track" />
          <circle cx="120" cy="120" r="96" fill="none" strokeWidth="18" className="gauge__value" pathLength="100" strokeDasharray="70 100" transform="rotate(-90 120 120)" />
          <text x="120" y="128" textAnchor="middle" className="gauge__score">
            3,5
          </text>
          <text x="120" y="160" textAnchor="middle" className="gauge__max">
            / 5
          </text>
        </svg>
      );

    case "formula":
      return (
        <div className="motif motif--formula" aria-hidden="true">
          <span>F(n) = F(n−1) + F(n−2)</span>
          <span>Σ xᵢ</span>
          <span>∀x, f(x) ≥ 0</span>
          <span>n! = n·(n−1)!</span>
          <span>gcd(a, b)</span>
        </div>
      );
  }
}
