// Parcours affiché sur l'accueil. Les intitulés et les dates suivent le profil LinkedIn
// (mis à jour le 22/10/2026) : ne rien y écrire qui n'y figure pas.

export type Step = { when: string; title: string; where: string; text?: string };

export const experiences: Step[] = [
  {
    when: "oct. 2026 – aujourd’hui",
    title: "Développeur web full-stack, bénévolat",
    where: "Bobo et Gamelles",
    text: "Refonte complète du site : nouvelle architecture, interfaces responsives et accessibles, API et base de données, déploiement et intégration continue.",
  },
  {
    when: "juin – août 2026",
    title: "Développeur full-stack, stage",
    where: "Club cycliste CCS Salouël",
    text: "Outil de gestion d’un club de 100 membres, livré seul et toujours en service. Connexion Strava (OAuth2), import GPX, 50 itinéraires cartographiés, temps de chargement réduit de 40 %.",
  },
  {
    when: "sept. – nov. 2024",
    title: "Assistant d’éducation",
    where: "Collège Boris Vian, Lille",
    text: "Suivi des élèves, lien avec les familles et l’équipe éducative, appui sur les outils numériques de l’établissement.",
  },
  {
    when: "sept. 2023 – juin 2024",
    title: "Volontaire en accompagnement scolaire",
    where: "Collège Boris Vian, Lille · service civique",
  },
];

export const education: Step[] = [
  {
    when: "nov. 2025 – août 2026",
    title: "Titre professionnel Développeur Web et Web Mobile",
    where: "Real Conseil · niveau 5 (bac+2)",
  },
  {
    when: "mai – juil. 2025",
    title: "Bootcamp Chef de projet",
    where: "M2i · 280 heures",
  },
  {
    when: "2020 – 2022",
    title: "Master Économie et Management Publics",
    where: "Université de Lille · parcours DEIET",
  },
  {
    when: "2016 – 2020",
    title: "Licence Économie et Gestion",
    where: "Université de Lille · parcours Économie et Management des Entreprises",
  },
];

export const skills: { group: string; items: string[] }[] = [
  { group: "Back-end", items: ["Node.js", "Express", "NestJS", "PHP", "API REST", "OAuth2 / JWT"] },
  { group: "Front-end", items: ["JavaScript", "TypeScript", "React", "Next.js", "HTML / CSS", "Accessibilité RGAA"] },
  { group: "Données", items: ["MySQL", "PostgreSQL", "Modélisation", "Row-Level Security"] },
  { group: "Livrer", items: ["Git", "GitHub Actions", "Tests E2E", "Render", "GitHub Pages"] },
];
