import { TLink } from "@/components/Transition";
import Roll from "@/components/motion/Roll";

export default function NotFound() {
  return (
    <main id="main" className="notfound">
      <div>
        <p className="label">Erreur 404</p>
        <h1 className="display-xl" style={{ margin: "24px 0 40px" }}>
          Cette page s’est <em className="accent">perdue</em>.
        </h1>
        <TLink href="/" label="Accueil" className="pill pill--light roll-host">
          <Roll text="Retour à l’accueil" />
        </TLink>
      </div>
    </main>
  );
}
