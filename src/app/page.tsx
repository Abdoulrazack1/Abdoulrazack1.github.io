import Link from "next/link";
import Header from "@/components/Header";
import Galaxy from "@/components/Galaxy";
import Mark from "@/components/Mark";
import ProjectCard from "@/components/ProjectCard";
import { ArrowIcon, GitHubIcon, LinkedInIcon } from "@/components/Icons";
import { featured, lab } from "@/lib/projects";
import { experiences, education, skills, type Step } from "@/lib/profile";
import { site } from "@/lib/site";

function Timeline({ title, steps }: { title: string; steps: Step[] }) {
  return (
    <div className="timeline" data-reveal>
      <h3 className="timeline__title">{title}</h3>
      <ol>
        {steps.map((s) => (
          <li key={s.title + s.when}>
            <span className="timeline__when">{s.when}</span>
            <div>
              <p className="timeline__what">{s.title}</p>
              <p className="timeline__where">{s.where}</p>
              {s.text && <p className="timeline__text">{s.text}</p>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        {/* ---------- Ouverture sombre : galaxie + accroche + cartes d'entrée ---------- */}
        <section className="hero">
          <Galaxy />
          <div className="wrap hero__inner">
            <p className="eyebrow hero__kicker">Développeur full-stack · Lille</p>
            <h1 className="hero__title">
              Je code des applis
              <br />
              qui servent <em>vraiment.</em>
            </h1>
            <p className="hero__text">
              Applications web, outils métier et API, de la base de données à l’interface. Je les conçois sobres, accessibles, et je les mène
              jusqu’en production.
            </p>
            <div className="hero__actions">
              <a href={`mailto:${site.email}`} className="pill pill--light">
                Me contacter <ArrowIcon size={14} />
              </a>
              <a href="#projets" className="hero__more">
                Voir les projets
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M12 5v14M6 13l6 6 6-6" />
                </svg>
              </a>
            </div>
          </div>

          <div className="wrap start">
            <div className="start__head" data-reveal>
              <h2>Par où commencer ?</h2>
              <p>Un projet, un recrutement, une simple curiosité. Choisissez votre porte d’entrée.</p>
            </div>

            <div className="bento">
              <a href="#projets" className="tile tile--work" data-reveal>
                <h3>Les projets</h3>
                <p>Huit études de cas, du besoin à la mise en ligne.</p>
                <span className="tile__go">
                  Voir les projets <ArrowIcon size={13} />
                </span>
                <div className="tile__devices" aria-hidden="true">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="tile__laptop" src="/work/tsundoku-1.webp" alt="" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="tile__phone" src="/work/cabinet-m1.webp" alt="" />
                </div>
              </a>

              <a href={site.github} target="_blank" rel="noopener noreferrer" className="tile tile--github" data-reveal>
                <h3>Tout le code, en accès libre</h3>
                <p>Node.js, NestJS, React, PHP, SQL : chaque projet est lisible sur GitHub.</p>
                <span className="tile__go">
                  github.com/Abdoulrazack1 <ArrowIcon size={13} />
                </span>
                <div className="tile__flow" aria-hidden="true">
                  <span>
                    <GitHubIcon size={16} /> push
                  </span>
                  <i />
                  <span className="is-mid">CI</span>
                  <i />
                  <span>en ligne</span>
                </div>
              </a>

              <a href="#parcours" className="tile tile--path" data-reveal>
                <h3>De l’économie au code</h3>
                <p>Master en économie, titre de développeur, et une question qui ne change pas : à quoi l’outil va servir.</p>
                <span className="tile__go">
                  Mon parcours <ArrowIcon size={13} />
                </span>
                <Mark className="tile__mark" />
              </a>

              <a href={`mailto:${site.email}`} className="tile tile--talk" data-reveal>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="tile__avatar" src="/work/portrait.webp" alt="" />
                <div>
                  <h3>Un projet en tête ?</h3>
                  <p>Dites-moi sur quoi vous travaillez.</p>
                  <span className="tile__go">
                    Écrire un message <ArrowIcon size={13} />
                  </span>
                </div>
              </a>

              <div className="tile tile--open" data-reveal>
                <h3>Disponible</h3>
                <p>Alternance Concepteur Développeur d’Applications (18 mois), à Lille ou en Île-de-France. Ouvert aux CDI, CDD et missions.</p>
                <ul className="tile__chips">
                  <li>Alternance</li>
                  <li>CDI</li>
                  <li>Missions</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Projets : vitrines pleine largeur ---------- */}
        <section id="projets" className="sec">
          <div className="wrap">
            <div className="sec__head" data-reveal>
              <h2 className="sec__title">
                Projets <em>sélectionnés</em>
              </h2>
              <a href={site.github} target="_blank" rel="noopener noreferrer" className="pill pill--line">
                <GitHubIcon size={16} /> Tout sur GitHub
              </a>
            </div>
            <div className="shows">
              {featured.map((p, i) => (
                <ProjectCard key={p.slug} p={p} index={i} />
              ))}
            </div>

            <h3 className="subhead" data-reveal>
              Et aussi
            </h3>
            <ul className="rows" data-reveal>
              {lab.map((l) => {
                const inner = (
                  <>
                    <span className="rows__name">{l.name}</span>
                    <span className="rows__desc">{l.desc}</span>
                    <span className="rows__tags">{l.tags}</span>
                    <span className="rows__go">{l.href && <ArrowIcon size={14} />}</span>
                  </>
                );
                return (
                  <li key={l.name}>
                    {!l.href ? (
                      <div className="rows__item">{inner}</div>
                    ) : l.internal ? (
                      <Link className="rows__item" href={`${l.href}/`}>
                        {inner}
                      </Link>
                    ) : (
                      <a className="rows__item" href={l.href} target="_blank" rel="noopener noreferrer">
                        {inner}
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* ---------- À propos ---------- */}
        <section id="apropos" className="sec sec--about">
          <div className="wrap about">
            <div className="about__media" data-reveal>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/work/portrait.webp" alt="Portrait d’Abdoulrazack Abdillahi" width={480} height={600} />
              <Mark className="about__mark" />
            </div>
            <div className="about__text" data-reveal>
              <p className="eyebrow">À propos</p>
              <h2 className="about__title">
                L’économie d’abord, le code ensuite. Les deux posent la même question : <em>à quoi l’outil va-t-il servir ?</em>
              </h2>
              <p>
                Une licence puis un master en économie et management à l’Université de Lille m’ont appris à partir du besoin, du coût et de
                l’usage. Deux années auprès de collégiens et de leurs familles m’ont appris à expliquer un outil numérique à des personnes qui ne
                sont pas informaticiennes. Le titre Développeur Web et Web Mobile, validé en août 2026, m’a donné de quoi construire ces outils
                moi-même.
              </p>
              <p>
                Je code léger : JavaScript natif quand il suffit, aucune dépendance inutile, des pages qui chargent vite. C’est la même logique de
                sobriété que dans mes études.
              </p>
            </div>
          </div>
        </section>

        {/* ---------- Parcours ---------- */}
        <section id="parcours" className="sec">
          <div className="wrap">
            <div className="sec__head" data-reveal>
              <h2 className="sec__title">
                Le <em>parcours</em>
              </h2>
            </div>
            <div className="parcours">
              <Timeline title="Expériences" steps={experiences} />
              <Timeline title="Formations" steps={education} />
            </div>
            <dl className="skills" data-reveal>
              {skills.map((s) => (
                <div key={s.group}>
                  <dt>{s.group}</dt>
                  <dd>{s.items.join(" · ")}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ---------- Contact ---------- */}
        <section id="contact" className="contact">
          <Galaxy className="galaxy--soft" />
          <div className="wrap contact__inner" data-reveal>
            <p className="eyebrow">Contact</p>
            <h2 className="contact__title">
              Construisons quelque chose
              <br />
              qui sert <em>vraiment.</em>
            </h2>
            <a className="contact__mail" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            <div className="contact__links">
              <a href={site.github} target="_blank" rel="noopener noreferrer" className="pill pill--light">
                <GitHubIcon size={16} /> GitHub
              </a>
              <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="pill pill--ghost">
                <LinkedInIcon size={16} /> LinkedIn
              </a>
            </div>
          </div>
          <p className="wrap contact__foot">
            {site.city} · © {new Date().getFullYear()} {site.name}
          </p>
        </section>
      </main>
    </>
  );
}
