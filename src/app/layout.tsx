import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import SmoothScroll from "@/components/motion/SmoothScroll";
import { TransitionProvider } from "@/components/Transition";
import StarField from "@/components/StarField";
import Ambient from "@/components/Ambient";
import Cursor from "@/components/Cursor";
import Loader from "@/components/Loader";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif", display: "swap" });
const sans = Instrument_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? site.url),
  title: { default: `${site.name} — ${site.role}`, template: `%s · ${site.name}` },
  description: site.description,
  openGraph: { type: "website", locale: "fr_FR", url: "/", siteName: site.name, title: `${site.name} — ${site.role}`, description: site.description, images: [{ url: "/og.png", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: `${site.name} — ${site.role}`, description: site.description, images: ["/og.png"] },
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = { themeColor: "#f3eee5" };

// Avant le premier rendu : on sait déjà si l'intro a été vue dans la session (pas de flash du loader).
// Même chose pour le thème : clair par défaut, sombre si le visiteur l'a choisi.
const introScript = `(function(){var d=document.documentElement;try{d.dataset.intro=sessionStorage.getItem("introSeen")?"seen":"new"}catch(e){d.dataset.intro="seen"}var t="light";try{t=localStorage.getItem("theme")||"light"}catch(e){}d.dataset.theme=t;if(t==="dark"){var m=document.querySelector('meta[name="theme-color"]');if(m)m.content="#0e0f11"}})()`;

// Données structurées : aident les moteurs à comprendre qui est derrière le site.
const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  email: `mailto:${site.email}`,
  url: site.url,
  address: { "@type": "PostalAddress", addressLocality: "Lille", addressCountry: "FR" },
  sameAs: [site.github, site.linkedin],
  knowsAbout: ["TypeScript", "Node.js", "NestJS", "PostgreSQL", "React", "Next.js", "GSAP"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${serif.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
        <noscript>
          <style>{`[data-split]{visibility:visible!important}.loader{display:none!important}`}</style>
        </noscript>
        <style>{`html[data-intro="seen"] .loader{display:none}`}</style>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Aller au contenu
        </a>
        <SmoothScroll />
        <StarField />
        <Ambient />
        <TransitionProvider>
          <Nav />
          {children}
          <Footer />
        </TransitionProvider>
        <Cursor />
        <Loader />
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
