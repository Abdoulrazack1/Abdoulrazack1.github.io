import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, getProject, nextProject, type CaseBlock } from "@/lib/projects";
import { themeOf, type CaseTheme } from "@/lib/caseThemes";
import { caseFontVars } from "@/lib/caseFonts";
import { site } from "@/lib/site";
import Header from "@/components/Header";
import Motif from "@/components/case/Motif";
import { ArrowIcon, GitHubIcon } from "@/components/Icons";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const p = getProject((await params).slug);
  if (!p) return {};
  return {
    title: `${p.name}, étude de cas`,
    description: p.summary,
    alternates: { canonical: `/projets/${p.slug}/` },
    openGraph: { title: `${p.name} · ${site.name}`, description: p.line, url: `/projets/${p.slug}/`, images: [p.cover] },
  };
}

// Le thème du projet devient les variables de la page : tout le CSS commun s'y adapte.
const vars = (t: CaseTheme) =>
  ({
    "--c-bg": t.bg,
    "--c-fg": t.fg,
    "--c-fg2": t.fg2,
    "--c-accent": t.accent,
    "--c-on-accent": t.onAccent,
    "--c-card": t.card,
    "--c-line": t.line,
  }) as React.CSSProperties;

function Block({ b }: { b: CaseBlock }) {
  switch (b.type) {
    case "section":
      return (
        <section className="cblock" data-reveal>
          <h2>{b.title}</h2>
          <div className="cblock__body">
            {b.body.map((t, i) => (
              <p key={i}>{t}</p>
            ))}
          </div>
        </section>
      );
    case "quote":
      return (
        <blockquote className="cquote" data-reveal>
          {b.text}
        </blockquote>
      );
    case "list":
      return (
        <section className="cblock" data-reveal>
          <h2>{b.title}</h2>
          <ul className="cblock__body clist">
            {b.items.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </section>
      );
    case "stats":
      return (
        <div className="metrics" data-reveal>
          {b.items.map((m) => (
            <div key={m.label}>
              <strong>{m.value}</strong>
              <span>{m.label}</span>
            </div>
          ))}
        </div>
      );
    case "image":
      return (
        <figure className="cfigure" data-reveal>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={b.src} alt={b.caption} loading="lazy" />
          <figcaption>{b.caption}</figcaption>
        </figure>
      );
  }
}

export default async function CasePage({ params }: { params: Promise<Params> }) {
  const p = getProject((await params).slug);
  if (!p) notFound();
  const next = nextProject(p.slug);
  const t = themeOf(p.slug);
  const nt = themeOf(next.slug);
  const site_ = p.links.find((l) => !l.href.includes("github.com"));
  const code = p.links.find((l) => l.href.includes("github.com"));

  return (
    <>
      <Header solid />
      <main id="main" className={`case case--${p.slug} case-font--${t.font}${t.dark ? " is-dark" : ""} ${caseFontVars}`} style={vars(t)}>
        <header className="case__hero">
          {t.motif !== "route" && <Motif name={t.motif} />}
          <div className="case__wrap case__intro">
            <p className="case__tags">
              <span>{p.category}</span>
              <span>{p.year}</span>
              {p.status && <span className="is-status">{p.status}</span>}
            </p>
            <h1>{p.name}</h1>
            <p className="case__headline">{p.headline}</p>
            <div className="case__actions">
              {site_ && (
                <a href={site_.href} target="_blank" rel="noopener noreferrer" className="case__btn case__btn--solid">
                  Voir le site en ligne <ArrowIcon size={14} />
                </a>
              )}
              {code && (
                <a href={code.href} target="_blank" rel="noopener noreferrer" className="case__btn">
                  <GitHubIcon size={16} /> Lire le code
                </a>
              )}
              {!p.links.length && <span className="case__private">Code privé, projet client. Démonstration sur demande.</span>}
            </div>
          </div>
          {t.motif === "route" && <Motif name={t.motif} />}
          <div className="case__shot">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.cover} alt={`Capture du projet ${p.name}`} />
          </div>
        </header>

        <div className="case__wrap">
          <dl className="case__meta" data-reveal>
            <div>
              <dt>Rôle</dt>
              <dd>{p.role}</dd>
            </div>
            <div>
              <dt>Stack</dt>
              <dd>{p.stack.join(", ")}</dd>
            </div>
          </dl>

          <p className="case__summary" data-reveal>
            {p.summary}
          </p>

          <div className="metrics" data-reveal>
            {p.metrics.map((m) => (
              <div key={m.label}>
                <strong>{m.value}</strong>
                <span>{m.label}</span>
              </div>
            ))}
          </div>

          <div className="case__body">
            {p.case.map((b, i) => (
              <Block key={i} b={b} />
            ))}
          </div>

          {p.gallery.length > 1 && (
            <section className="gallery" aria-label="Galerie">
              <h2 className="case__h" data-reveal>
                En images
              </h2>
              <div className="gallery__grid">
                {p.gallery.map((g, i) => (
                  <figure key={g.src + i} className="cfigure" data-reveal>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={g.src} alt={g.caption} loading="lazy" />
                    <figcaption>{g.caption}</figcaption>
                  </figure>
                ))}
              </div>
            </section>
          )}
        </div>

        <Link href={`/projets/${next.slug}/`} className="nextcase" style={{ background: nt.bg, color: nt.fg }}>
          <span className="nextcase__label" style={{ color: nt.accent }}>
            Projet suivant
          </span>
          <span className="nextcase__name">
            {next.name} <ArrowIcon size={32} />
          </span>
          <span className="nextcase__line" style={{ color: nt.fg2 }}>
            {next.line}
          </span>
        </Link>
      </main>
    </>
  );
}
