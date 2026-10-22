import Link from "next/link";
import type { Project } from "@/lib/projects";
import { ArrowIcon } from "./Icons";

// Les cinq couleurs de l'identité, attribuées tour à tour aux projets.
export const TONES = ["cobalt", "coral", "mint", "sun", "pink"] as const;

/** Vitrine pleine largeur : texte d'un côté, capture qui déborde de l'autre (alternés). */
export default function ProjectCard({ p, index }: { p: Project; index: number }) {
  const tone = TONES[index % TONES.length];
  return (
    <article className={`show tone-${tone}${index % 2 ? " show--flip" : ""}`} data-reveal>
      <Link href={`/projets/${p.slug}/`} className="show__link">
        <div className="show__text">
          <p className="show__meta">
            <span>{p.category}</span>
            {p.status && <span className="show__status">{p.status}</span>}
          </p>
          <h3>{p.name}</h3>
          <p className="show__line">{p.line}</p>
          <ul className="show__stack">
            {p.stack.slice(0, 4).map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <span className="show__cta">
            Voir l’étude de cas <ArrowIcon size={14} />
          </span>
        </div>
        <div className="show__shot">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.cover} alt={`Capture du projet ${p.name}`} loading={index < 1 ? "eager" : "lazy"} />
        </div>
      </Link>
    </article>
  );
}
