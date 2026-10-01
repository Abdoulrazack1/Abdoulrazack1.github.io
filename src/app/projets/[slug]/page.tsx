import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects, getProject, nextProject, type CaseBlock, type Project } from "@/lib/projects";
import { site } from "@/lib/site";
import SplitReveal from "@/components/motion/SplitReveal";
import Reveal from "@/components/motion/Reveal";
import Roll from "@/components/motion/Roll";
import Stage from "@/components/Stage";
import { TLink } from "@/components/Transition";
import { CaseCover, Metrics, Gallery, NextProject, RefreshOnLoad } from "@/components/case/CaseParts";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const p = getProject((await params).slug);
  if (!p) return {};
  return {
    title: `${p.name} — étude de cas`,
    description: p.summary,
    openGraph: { title: `${p.name} — ${site.name}`, description: p.line, images: [p.cover] },
  };
}

function Block({ b, p }: { b: CaseBlock; p: Project }) {
  switch (b.type) {
    case "section":
      return (
        <section className="block container">
          <div className="block__head">
            <SplitReveal as="h2">{b.title}</SplitReveal>
          </div>
          <Reveal className="block__body" stagger={0.1}>
            {b.body.map((t, i) => (
              <p key={i}>{t}</p>
            ))}
          </Reveal>
        </section>
      );
    case "quote":
      return (
        <div className="container">
          <SplitReveal as="blockquote" className="quote" stagger={0.07}>
            <em className="accent">“</em>
            {b.text}
            <em className="accent">”</em>
          </SplitReveal>
        </div>
      );
    case "list":
      return (
        <section className="block container">
          <div className="block__head">
            <SplitReveal as="h2">{b.title}</SplitReveal>
          </div>
          <Reveal as="ol" className="block__body block__list" stagger={0.06} y={24}>
            {b.items.map((t, i) => (
              <li key={i}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {t}
              </li>
            ))}
          </Reveal>
        </section>
      );
    case "stats":
      return (
        <div className="container">
          <Metrics items={b.items} className="metrics stats-row" />
        </div>
      );
    case "image":
      return (
        <figure className="case-image container">
          <Stage bg={p.stage} src={b.src} url={p.url} alt={b.caption} sizes="(max-width: 860px) 100vw, 90vw" depth={6} />
          <figcaption>{b.caption}</figcaption>
        </figure>
      );
  }
}

export default async function CasePage({ params }: { params: Promise<Params> }) {
  const p = getProject((await params).slug);
  if (!p) notFound();
  const next = nextProject(p.slug);

  return (
    <main id="main">
      <RefreshOnLoad />
      <header className="case-hero container">
        <Reveal on="intro" className="case-hero__top" delay={0.2}>
          <TLink href="/#travaux" label="Accueil" className="back roll-host">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M19 12H5M11 6l-6 6 6 6" />
            </svg>
            <Roll text="Tous les projets" />
          </TLink>
          <span className="label">
            {p.category} — {p.year}
          </span>
        </Reveal>

        <SplitReveal as="h1" on="intro" className="display-xl case-hero__title" stagger={0.08}>
          {p.headline}
        </SplitReveal>

        <Reveal on="intro" className="case-meta" stagger={0.07} delay={0.5}>
          <div>
            <span className="label">Projet</span>
            <p>{p.name}</p>
          </div>
          <div>
            <span className="label">Rôle</span>
            <p>{p.role}</p>
          </div>
          <div>
            <span className="label">Stack</span>
            <p>{p.stack.join(", ")}</p>
          </div>
          <div>
            <span className="label">{p.links.length ? "Liens" : "Statut"}</span>
            {p.links.length ? (
              <div className="case-links">
                {p.links.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="pill pill--ghost roll-host" style={{ ["--h" as string]: "38px", padding: "0 16px", fontSize: 13 }}>
                    <Roll text={l.label} />
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M7 17 17 7M8 7h9v9" />
                    </svg>
                  </a>
                ))}
              </div>
            ) : (
              <p>Code privé — projet client. Démonstration sur demande.</p>
            )}
          </div>
        </Reveal>
      </header>

      <CaseCover p={p} />

      <div className="container">
        <div className="case-summary">
          <span className="label">Résumé</span>
          <SplitReveal as="p" stagger={0.05}>
            {p.summary}
          </SplitReveal>
        </div>
        <Metrics items={p.metrics} />
      </div>

      <div className="case-body">
        {p.case.map((b, i) => (
          <Block key={i} b={b} p={p} />
        ))}
      </div>

      <Gallery p={p} />

      <NextProject p={next} />
    </main>
  );
}
