import { Fraunces, JetBrains_Mono, Caveat } from "next/font/google";

// Polices propres aux études de cas : chargées seulement sur les pages projet.
const serif = Fraunces({ subsets: ["latin"], axes: ["opsz", "SOFT"], variable: "--font-case-serif", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-case-mono", display: "swap" });
const hand = Caveat({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-case-hand", display: "swap" });

export const caseFontVars = `${serif.variable} ${mono.variable} ${hand.variable}`;
