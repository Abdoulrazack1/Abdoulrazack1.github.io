import Link from "next/link";
import Mark from "@/components/Mark";

export default function NotFound() {
  return (
    <main id="main" className="notfound">
      <Mark className="notfound__mark" />
      <p className="eyebrow">Erreur 404</p>
      <h1>Cette page n’existe pas.</h1>
      <Link href="/" className="btn btn--solid">
        Retour à l’accueil
      </Link>
    </main>
  );
}
