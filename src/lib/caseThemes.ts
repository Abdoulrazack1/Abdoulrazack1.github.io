// Direction artistique propre à chaque étude de cas : la page entière prend
// les couleurs, la typographie et le motif du projet qu'elle raconte.

export type CaseFont = "serif" | "mono" | "hand" | "sans";
export type Motif = "kanji" | "seal" | "galaxy" | "route" | "scribble" | "speed" | "gauge" | "formula";

export type CaseTheme = {
  bg: string;
  fg: string;
  fg2: string;
  accent: string;
  /** Couleur du texte posé sur l'accent (boutons, pastilles). */
  onAccent: string;
  card: string;
  line: string;
  font: CaseFont;
  motif: Motif;
  dark: boolean;
};

export const caseThemes: Record<string, CaseTheme> = {
  tsundoku: {
    bg: "#f3ede1", fg: "#1c1915", fg2: "#5f574b", accent: "#d8432b", onAccent: "#fff",
    card: "#fbf7ee", line: "rgba(28,25,21,.14)", font: "serif", motif: "kanji", dark: false,
  },
  cabinet: {
    bg: "#11221b", fg: "#efe8d8", fg2: "#b5ae9c", accent: "#d1ad66", onAccent: "#11221b",
    card: "#182e25", line: "rgba(239,232,216,.14)", font: "serif", motif: "seal", dark: true,
  },
  "galactic-brain": {
    bg: "#0c0a2a", fg: "#ecebff", fg2: "#a9a6d6", accent: "#9b8cff", onAccent: "#0c0a2a",
    card: "#16133d", line: "rgba(236,235,255,.13)", font: "mono", motif: "galaxy", dark: true,
  },
  cycling: {
    bg: "#0b3a33", fg: "#e9fff8", fg2: "#a6d3c6", accent: "#2fe0b6", onAccent: "#0b3a33",
    card: "#10483f", line: "rgba(233,255,248,.14)", font: "sans", motif: "route", dark: true,
  },
  inkstudio: {
    bg: "#fbfbf7", fg: "#18204f", fg2: "#4f567f", accent: "#3a5bd9", onAccent: "#fff",
    card: "#ffffff", line: "rgba(24,32,79,.13)", font: "hand", motif: "scribble", dark: false,
  },
  inko: {
    bg: "#190f3d", fg: "#f4efff", fg2: "#b8acdf", accent: "#b48dff", onAccent: "#190f3d",
    card: "#241650", line: "rgba(244,239,255,.13)", font: "sans", motif: "speed", dark: true,
  },
  "js-ranker": {
    bg: "#1a1008", fg: "#fff3e4", fg2: "#cdb79c", accent: "#ffb24a", onAccent: "#1a1008",
    card: "#251810", line: "rgba(255,243,228,.13)", font: "mono", motif: "gauge", dark: true,
  },
  "logic-lens": {
    bg: "#0b1a4a", fg: "#e9f0ff", fg2: "#a5b6e4", accent: "#73a6ff", onAccent: "#0b1a4a",
    card: "#11245e", line: "rgba(233,240,255,.13)", font: "mono", motif: "formula", dark: true,
  },
};

export const themeOf = (slug: string): CaseTheme => caseThemes[slug] ?? caseThemes.tsundoku;
