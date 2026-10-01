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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3002"),
  title: { default: `${site.name} — ${site.role}`, template: `%s · ${site.name}` },
  description: site.description,
  openGraph: { type: "website", locale: "fr_FR", title: `${site.name} — ${site.role}`, description: site.description, images: ["/work/tsundoku-1.webp"] },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = { themeColor: "#0e0f11", colorScheme: "dark" };

// Avant le premier rendu : on sait déjà si l'intro a été vue dans la session (pas de flash du loader).
const introScript = `try{document.documentElement.dataset.intro=sessionStorage.getItem("introSeen")?"seen":"new"}catch(e){document.documentElement.dataset.intro="seen"}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${serif.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
        <noscript>
          <style>{`[data-split]{visibility:visible!important}.loader{display:none!important}`}</style>
        </noscript>
        <style>{`html[data-intro="seen"] .loader{display:none}`}</style>
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
