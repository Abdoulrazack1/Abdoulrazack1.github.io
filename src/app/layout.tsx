import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import Reveals from "@/components/Reveals";

const sans = Bricolage_Grotesque({ subsets: ["latin"], axes: ["opsz"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? site.url),
  title: { default: `${site.name} · ${site.role}`, template: `%s · ${site.name}` },
  description: site.description,
  openGraph: { type: "website", locale: "fr_FR", url: "/", siteName: site.name, title: `${site.name} · ${site.role}`, description: site.description, images: [{ url: "/og.png", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: `${site.name} · ${site.role}`, description: site.description, images: ["/og.png"] },
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = { themeColor: "#2a3bff" };

// Avant le premier rendu : thème clair par défaut, sombre si le visiteur l'a choisi (pas de flash).
const themeScript = `(function(){var t="light";try{t=localStorage.getItem("theme")||"light"}catch(e){}document.documentElement.dataset.theme=t})()`;

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
  knowsAbout: ["JavaScript", "TypeScript", "Node.js", "NestJS", "React", "PHP", "MySQL", "PostgreSQL"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={sans.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Aller au contenu
        </a>
        {children}
        <Reveals />
      </body>
    </html>
  );
}
