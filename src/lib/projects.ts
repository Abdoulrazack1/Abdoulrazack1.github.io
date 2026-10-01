export type CaseBlock =
  | { type: "section"; title: string; body: string[] }
  | { type: "quote"; text: string }
  | { type: "list"; title: string; items: string[] }
  | { type: "stats"; items: { value: string; label: string }[] }
  | { type: "image"; src: string; caption: string; device?: "desktop" | "mobile" };

export type Project = {
  slug: string;
  name: string;
  /** Une ligne sous la carte, façon légende éditoriale. */
  line: string;
  /** Le titre long de l'étude de cas. */
  headline: string;
  year: string;
  role: string;
  category: string;
  /** Fond de la « scène » sur laquelle la capture est posée. */
  stage: string;
  /** URL affichée dans la barre du faux navigateur. */
  url: string;
  cover: string;
  gallery: { src: string; caption: string }[];
  summary: string;
  stack: string[];
  links: { label: string; href: string }[];
  metrics: { value: string; label: string }[];
  status?: string;
  case: CaseBlock[];
};

export const projects: Project[] = [
  {
    slug: "tsundoku",
    name: "Tsundoku",
    line: "Un journal de lecture manga full-stack, pensé comme un objet éditorial.",
    headline: "Un blog de lecture tenu de la première intention graphique jusqu’au serveur en production.",
    year: "2026",
    role: "Direction artistique, front-end, back-end, déploiement",
    category: "Produit full-stack",
    stage: "linear-gradient(160deg, #e9542f 0%, #b6301a 55%, #4a1209 100%)",
    url: "tsundoku-s6lz.onrender.com",
    cover: "/work/tsundoku-1.webp",
    status: "En production",
    gallery: [
      { src: "/work/tsundoku-1.webp", caption: "Accueil — direction artistique japonaise (ma 間, wabi-sabi), couvertures Anilist réelles." },
      { src: "/work/tsundoku-3.webp", caption: "Bibliothèque — navigation par séries et collections." },
      { src: "/work/tsundoku-4.webp", caption: "Journal — le flux éditorial des chroniques." },
      { src: "/work/tsundoku-5.webp", caption: "Statistiques de lecture." },
    ],
    summary:
      "Plateforme de chroniques manga complète : rédaction riche, import .docx/.pdf reformaté automatiquement aux codes du site, métadonnées réelles via Anilist, SEO rendu côté serveur, lecture audio par voix neuronale. Menée de la direction artistique jusqu’à la mise en ligne.",
    stack: ["Node.js", "Express", "MySQL", "JWT", "Joi", "GSAP", "Three.js", "GraphQL", "Edge-TTS"],
    links: [
      { label: "Voir le site", href: "https://tsundoku-s6lz.onrender.com" },
      { label: "Code source", href: "https://github.com/Abdoulrazack1/tsundoku" },
    ],
    metrics: [
      { value: "20+", label: "tables MySQL normalisées" },
      { value: "SSR", label: "meta, Open Graph et JSON-LD par page" },
      { value: "5", label: "formats importés et reformatés" },
      { value: "Live", label: "Render + Aiven" },
    ],
    case: [
      {
        type: "section",
        title: "Le point de départ",
        body: [
          "Je voulais un blog de lecture qui ne ressemble à aucun autre : un objet éditorial avec une direction artistique japonaise assumée — l’espace (ma 間), la beauté de l’imparfait (wabi-sabi 侘寂), un papier washi off-white, un vermillon utilisé avec parcimonie.",
          "Le pari : une expérience aussi soignée qu’un site primé, posée sur un vrai produit — comptes, rédaction, SEO, mise en production. Pas une maquette : un service qui tourne.",
        ],
      },
      { type: "quote", text: "Je ne voulais pas « un blog ». Je voulais tenir un produit de la première intention graphique jusqu’au serveur en ligne." },
      {
        type: "section",
        title: "L’import qui se reformate tout seul",
        body: [
          "Le cœur difficile : déposer un .docx ou un .pdf et le voir instantanément remis aux polices, couleurs et grille du site, sans retouche.",
          "Un pipeline d’ingestion extrait le contenu (mammoth pour le .docx, pdf.js pour le .pdf, plus .md, .html et .txt), le normalise en un arbre de blocs, puis réapplique les design tokens. Le texte d’un auteur entre tel quel et ressort dans l’identité de Tsundoku.",
        ],
      },
      { type: "image", src: "/work/tsundoku-3.webp", caption: "La bibliothèque : séries, collections, progression de lecture." },
      {
        type: "section",
        title: "Un SEO qui ne dépend pas du JavaScript",
        body: [
          "Une SPA rend ses balises trop tard pour les robots. Les meta sont donc générées côté serveur, page par page : title, description, canonical, Open Graph et JSON-LD au moment de la requête.",
          "S’y ajoutent un flux RSS, un sitemap (articles et séries), un robots.txt et une image Open Graph par défaut : le site se partage et se référence comme un média.",
        ],
      },
      {
        type: "stats",
        items: [
          { value: "3NF", label: "schéma relationnel" },
          { value: "2 jetons", label: "JWT access + refresh" },
          { value: "GraphQL", label: "Anilist" },
          { value: "Neural TTS", label: "lecture audio" },
        ],
      },
      {
        type: "list",
        title: "Architecture",
        items: [
          "Express + MySQL (mysql2), schéma normalisé en 3NF",
          "Auth JWT double jeton, bcrypt, validation Joi, Helmet, CORS, rate-limit, logs Winston",
          "Pipeline d’import .docx / .pdf / .md / .html → blocs normalisés → tokens du site",
          "SEO serveur : meta, OG, JSON-LD, RSS, sitemap, robots",
          "Étagère 3D Three.js, Lenis, GSAP ScrollTrigger, statistiques Chart.js",
        ],
      },
      {
        type: "section",
        title: "La production, là où on apprend vraiment",
        body: [
          "Tsundoku tourne sur Render (serveur) et Aiven (MySQL managé), sur des offres gratuites. Le serveur sert l’API et le front sur un seul port.",
          "Les pièges de prod m’ont appris autant que le code : cold-start du free tier (keep-alive), CORS entre domaines, migration d’une base locale vers une base distante. Déboguer sans le confort du localhost est une compétence à part entière.",
        ],
      },
    ],
  },

  {
    slug: "cabinet",
    name: "Cabinet d’avocats",
    line: "Plateforme métier pour un cabinet réel — la sécurité portée par la base de données.",
    headline: "Une plateforme juridique où le secret professionnel est garanti par PostgreSQL, pas par la discipline du code.",
    year: "2026",
    role: "Architecture, back-end, sécurité, interfaces",
    category: "Client · Plateforme métier",
    stage: "linear-gradient(160deg, #2f4a3f 0%, #1d3029 55%, #0c1512 100%)",
    url: "espace.cabinet — démo",
    cover: "/work/cabinet-1.webp",
    status: "En cours",
    gallery: [
      { src: "/work/cabinet-1.webp", caption: "Tableau de bord avocat — demandes à traiter, journée, dossiers en cours (données de démonstration)." },
      { src: "/work/cabinet-2.webp", caption: "Dossiers — cloisonnés par Row-Level Security." },
      { src: "/work/cabinet-3.webp", caption: "Agenda — la double réservation est impossible au niveau de la base." },
      { src: "/work/cabinet-4.webp", caption: "Revue périodique des accès." },
    ],
    summary:
      "Site institutionnel, espace client et espace avocat pour un cabinet, d’après un cahier des charges de 19 sections. Les données relèvent du secret professionnel : le cloisonnement, l’audit et les règles juridiques sont garantis par la base elle-même.",
    stack: ["TypeScript", "NestJS 11", "PostgreSQL 17", "Drizzle", "Redis", "Turborepo", "Next.js"],
    links: [],
    metrics: [
      { value: "RLS", label: "cloisonnement par dossier" },
      { value: "SHA-256", label: "journal d’audit chaîné" },
      { value: "100+", label: "tests automatisés" },
      { value: "19", label: "sections de cahier des charges" },
    ],
    case: [
      {
        type: "section",
        title: "Le contexte",
        body: [
          "Un vrai cabinet, un vrai cahier des charges (19 sections) : site institutionnel, espace client, espace avocat — dossiers, agenda, messagerie, facturation, vigilance anti-blanchiment.",
          "Les données traitées relèvent du secret professionnel de l’avocat. Une requête qui oublie un WHERE n’est pas un bug : c’est une fuite.",
        ],
      },
      { type: "quote", text: "Un WHERE oublié est une fuite. Une politique de sécurité en base, elle, ne s’oublie pas." },
      {
        type: "section",
        title: "Le principe directeur",
        body: [
          "La sécurité n’est pas un module ajouté après coup : elle structure l’architecture. Row-Level Security pour qu’un avocat ne voie que ses dossiers, triggers pour rendre le journal d’audit inaltérable, fonctions SECURITY DEFINER pour les seules opérations qui doivent franchir le cloisonnement (ouverture de dossier, détection de conflits d’intérêts).",
          "Le rôle applicatif n’est pas propriétaire des tables, et l’API refuse de démarrer si c’est le cas. Le code métier ne filtre jamais par utilisateur : dupliquer le cloisonnement créerait deux sources de vérité qui divergent.",
        ],
      },
      { type: "image", src: "/work/cabinet-2.webp", caption: "Les dossiers visibles sont ceux que la base autorise — rien n’est filtré côté application." },
      {
        type: "list",
        title: "Ce qui garantit quoi",
        items: [
          "Un avocat ne voit que ses dossiers → Row-Level Security PostgreSQL",
          "Journal d’audit inaltérable → privilèges, triggers et chaînage SHA-256 (la falsification reste détectée même avec les droits superutilisateur)",
          "Pas de vigilance LCB-FT sur un dossier contentieux → trigger en base",
          "Pas de double réservation de créneau → contrainte d’exclusion GiST",
          "Décisions d’architecture documentées en ADR, traçabilité exigence par exigence",
        ],
      },
      {
        type: "section",
        title: "Des règles de droit, traduites en code",
        body: [
          "Certaines règles ont une conséquence juridique directe : une déclaration de soupçon ne part que vers le Bâtonnier, aucun module d’avis clients ne doit exister, un dossier contentieux ne déclenche jamais la vigilance anti-blanchiment. Elles sont inscrites dans la base et vérifiées par un script de sécurité rejoué après chaque modification.",
        ],
      },
      { type: "image", src: "/work/cabinet-3.webp", caption: "Agenda des rendez-vous." },
    ],
  },

  {
    slug: "galactic-brain",
    name: "Galactic Brain",
    line: "Un serveur MCP qui donne une mémoire persistante à Claude — 49 outils, 2 dépendances.",
    headline: "Une mémoire augmentée pour l’IA : un serveur MCP qui transforme un vault Obsidian en contexte exploitable.",
    year: "2026",
    role: "Conception, TypeScript, recherche d’information",
    category: "Outil IA · Open source",
    stage: "linear-gradient(160deg, #5b4bff 0%, #2a1f8f 55%, #0d0a2e 100%)",
    url: "github.com/Abdoulrazack1/galactic-brain-mcp",
    cover: "/work/galactic-1.webp",
    status: "Utilisé au quotidien",
    gallery: [{ src: "/work/galactic-1.webp", caption: "Les couches du serveur, de la fondation à l’auto-synchronisation." }],
    summary:
      "Serveur Model Context Protocol qui indexe repos, notes et décisions d’un vault Obsidian pour Claude Desktop et Claude Code : recherche BM25 écrite à la main, stress-test de décisions, anticipation des deadlines, synchronisation automatique par hooks.",
    stack: ["TypeScript", "Node.js", "MCP SDK", "Zod", "Okapi BM25", "Obsidian", "Git"],
    links: [{ label: "Code source", href: "https://github.com/Abdoulrazack1/galactic-brain-mcp" }],
    metrics: [
      { value: "49", label: "outils exposés" },
      { value: "2", label: "dépendances" },
      { value: "BM25", label: "moteur de recherche maison" },
      { value: "30 min", label: "cycle d’auto-sync" },
    ],
    case: [
      {
        type: "section",
        title: "Le problème",
        body: [
          "Un assistant IA oublie tout entre deux sessions. Chaque matin, il faut lui réexpliquer le projet, les décisions prises, ce qui bloque. J’ai voulu qu’il arrive en sachant déjà où on en est.",
        ],
      },
      { type: "quote", text: "Un rapport de situation en un seul appel : commits, décisions, deadlines, fils en suspens." },
      {
        type: "section",
        title: "La refonte v15",
        body: [
          "Les premières versions avaient accumulé 114 outils dans un monolithe de près de 6 000 lignes, avec beaucoup de redondance. La v15 est une refonte modulaire : une couche core sans logique d’outil (vault, recherche, git, raisonnement), un renderer partagé, un registre explicite et une famille d’outils par fichier.",
          "Résultat : 49 outils mieux définis, chacun appelable par les autres via le registre. Moins d’outils, plus de valeur — c’est la décision dont je suis le plus fier sur ce projet.",
        ],
      },
      {
        type: "list",
        title: "Les outils phares",
        items: [
          "brain_brief — rapport de situation proactif en un appel",
          "brain_advise — stress-test d’une décision, verdict GO / CAUTION / NO-GO",
          "brain_critic — avocat du diable sur un plan",
          "brain_foresee — anticipation des deadlines à risque et des fils qui meurent",
          "brain_chain — raisonnement séquentiel ancré dans le vault",
        ],
      },
      {
        type: "section",
        title: "La boucle d’auto-synchronisation",
        body: [
          "Des hooks Claude Code journalisent chaque modification de fichier ; en fin de session, un handoff est écrit ; une tâche planifiée pousse le vault sur GitHub toutes les 30 minutes. À la session suivante, le travail précédent est déjà intégré.",
        ],
      },
    ],
  },

  {
    slug: "cycling",
    name: "C.C. Salouël",
    line: "La plateforme d’un club cycliste — routage vélo réel, GPX, profils altimétriques.",
    headline: "Une plateforme pour un club de cyclisme, où ajouter une sortie prend quelques secondes.",
    year: "2026",
    role: "Architecture, full-stack, pipeline de données",
    category: "Full-stack · Club réel",
    stage: "linear-gradient(160deg, #1fbf9f 0%, #0f6e63 55%, #06302c 100%)",
    url: "ccs-salouel — club",
    cover: "/work/cycling-1.webp",
    gallery: [
      { src: "/work/cycling-1.webp", caption: "Accueil du club." },
      { src: "/work/cycling-2.webp", caption: "Parcours — carte, tracé GPX et profil altimétrique coloré par pente." },
      { src: "/work/cycling-3.webp", caption: "Catalogue des sorties générées automatiquement." },
    ],
    summary:
      "19 pages, API REST à rôles, MySQL, génération automatique de parcours (routage vélo BRouter, altitude, GPX, profil coloré par pente), météo et vue satellite synchronisée au tracé. Mon premier projet pensé comme un système plutôt que comme des pages.",
    stack: ["Node.js", "Express", "MySQL", "JWT", "Leaflet", "BRouter", "Open-Meteo", "Strava OAuth"],
    links: [{ label: "Code source", href: "https://github.com/Abdoulrazack1/Cycling" }],
    metrics: [
      { value: "19", label: "pages" },
      { value: "32", label: "sorties cataloguées" },
      { value: "272", label: "points d’intérêt" },
      { value: "3", label: "rôles" },
    ],
    case: [
      {
        type: "section",
        title: "Le contexte",
        body: [
          "Un vrai club, un vrai besoin : centraliser sorties, parcours et informations membres dans un seul endroit. Mon premier full-stack à cette échelle, de l’architecture jusqu’au schéma de base.",
        ],
      },
      { type: "quote", text: "Le projet qui m’a appris à penser « système » plutôt que « page »." },
      {
        type: "section",
        title: "Un pipeline d’import automatique",
        body: [
          "Plutôt que de saisir chaque parcours à la main, toute la chaîne est automatisée : import (GPX, tableur Excel du club), routage vélo réel via BRouter avec l’altitude, génération du fichier GPX et du profil altimétrique coloré selon la pente.",
          "Ajouter une sortie devient une opération de quelques secondes ; chaque sortie arrive avec sa carte, son tracé, son dénivelé et sa météo.",
        ],
      },
      { type: "image", src: "/work/cycling-2.webp", caption: "Une page parcours : carte Leaflet, tracé, profil de pente." },
      {
        type: "list",
        title: "Sous le capot",
        items: [
          "Front vanilla, Express, MySQL",
          "Auth JWT + bcrypt, trois rôles (admin, modérateur, membre), OAuth Strava",
          "Import → routage BRouter → altitude → GPX → profil de pente",
          "Leaflet + couche satellite, 272 points d’intérêt",
          "Audit de sécurité traité : sanitation HTML, chiffrement des jetons, vérification des images par signature",
        ],
      },
    ],
  },

  {
    slug: "inkstudio",
    name: "InkStudio",
    line: "Un studio d’animation whiteboard dans le navigateur — multi-scènes, voix off, export MP4.",
    headline: "Un studio d’animation tableau blanc qui tourne entièrement dans le navigateur, synchronisé sur la voix.",
    year: "2026",
    role: "Produit, JavaScript, audio et vidéo",
    category: "Outil créatif · Desktop",
    stage: "linear-gradient(160deg, #3a5bd9 0%, #23338a 55%, #0e1440 100%)",
    url: "inkstudio — app desktop",
    cover: "/work/inkstudio-1.webp",
    gallery: [{ src: "/work/inkstudio-1.webp", caption: "L’éditeur : styles d’animation, scènes, voix off, musique, sous-titres." }],
    summary:
      "Fork profondément retravaillé d’Inkplainer : projets multi-scènes, voix off servant d’horloge maîtresse, synchronisation automatique des calques sur la parole, sous-titres, caméra Ken Burns, export WebM/MP4 via WebCodecs, et une app desktop Electron.",
    stack: ["JavaScript", "Canvas", "Web Audio", "WebCodecs", "IndexedDB", "Electron"],
    links: [{ label: "Code source", href: "https://github.com/Abdoulrazack1/inkstudio" }],
    metrics: [
      { value: "MP4", label: "export hors-ligne WebCodecs" },
      { value: "Voix", label: "horloge maîtresse" },
      { value: "SRT/VTT", label: "sous-titres incrustés" },
      { value: "0 €", label: "aucun service externe" },
    ],
    case: [
      {
        type: "section",
        title: "L’idée",
        body: [
          "Les vidéos « tableau blanc » expliquent bien, mais les outils sont payants, en ligne, et filigranés. Je voulais un studio local où l’on pose une voix off et où le dessin suit la narration.",
        ],
      },
      { type: "quote", text: "L’audio est l’horloge maîtresse : les dessins se calent sur la parole, pas l’inverse." },
      {
        type: "list",
        title: "Ce que j’ai ajouté",
        items: [
          "Multi-scènes réordonnables, transitions, lecture à partir d’une scène",
          "Voix off avec forme d’onde, marqueurs par scène, détection des silences et calage automatique des calques",
          "Piste musique avec ducking sous la voix, mixdown hors-ligne",
          "Sous-titres timés, incrustés à l’export, export SRT et VTT",
          "Caméra Ken Burns, formes vectorielles, GIF animés, format TikTok 9:16",
          "Électron : serveur statique interne pour un contexte sécurisé WebCodecs, installeur Windows",
        ],
      },
      {
        type: "section",
        title: "Travailler dans un code existant",
        body: [
          "Le cœur upstream est un monolithe de plus de 10 000 lignes. J’ai choisi d’ajouter mes fonctionnalités en modules séparés plutôt que de tout réécrire, puis d’auditer l’ensemble : XSS corrigé, validation des projets importés, undo/redo des scènes, premières fonctions pures testées et une CI.",
        ],
      },
    ],
  },

  {
    slug: "inko",
    name: "Inko",
    line: "Lecteur de manga en ligne — architecture modulaire, PWA hors-ligne, app Android.",
    headline: "La plateforme de lecture manga où le JavaScript a pris les commandes du rendu.",
    year: "2026",
    role: "Front-end, architecture JavaScript, intégration d’API",
    category: "Front-end · PWA",
    stage: "linear-gradient(160deg, #8a5cff 0%, #4b2aa8 55%, #1a0f40 100%)",
    url: "abdoulrazack1.github.io/Inko",
    cover: "/work/inko-1.webp",
    gallery: [
      { src: "/work/inko-1.webp", caption: "Accueil — rendu dynamique depuis les données." },
      { src: "/work/inko-2.webp", caption: "Catalogue des séries." },
      { src: "/work/inko-3.webp", caption: "Fiche série et métadonnées Anilist." },
      { src: "/work/inko-4.webp", caption: "Lecteur de chapitre." },
    ],
    summary:
      "Navigation par séries et collections, lecteur de chapitre avec reprise, espace utilisateur, intégration Anilist et proxy de sources. Le projet charnière où je suis passé de pages statiques à une interface pilotée par l’état.",
    stack: ["JavaScript", "ES Modules", "PWA", "Service Worker", "Anilist", "Android"],
    links: [
      { label: "Voir le site", href: "https://abdoulrazack1.github.io/Inko/" },
      { label: "Code source", href: "https://github.com/Abdoulrazack1/Inko" },
    ],
    metrics: [
      { value: "PWA", label: "lecture hors-ligne" },
      { value: "Reader", label: "reprise de lecture" },
      { value: "Android", label: "app native" },
      { value: "API", label: "Anilist + sources" },
    ],
    case: [
      {
        type: "section",
        title: "Le tournant",
        body: [
          "Inko est le projet où j’ai arrêté d’écrire des pages figées pour laisser le JavaScript construire l’interface à partir des données : catalogue, fiche série, lecteur, collections, authentification.",
        ],
      },
      { type: "quote", text: "Avant Inko, j’écrivais des pages. Après, j’écrivais un état — et l’interface en était la conséquence." },
      {
        type: "section",
        title: "Séparer la logique de la vue",
        body: [
          "Architecture modulaire en ES Modules, logique séparée du rendu, cache et service worker pour lire hors-ligne. Puis une app Android empaquetée — avec ses propres pièges : un WebView ancien qui ignore certaines propriétés CSS modernes, à contourner une par une.",
        ],
      },
      { type: "image", src: "/work/inko-4.webp", caption: "Le lecteur de chapitre, piloté entièrement par l’état." },
    ],
  },

  {
    slug: "js-ranker",
    name: "Js-Ranker",
    line: "Noter la qualité d’un code JavaScript avec un modèle entraîné — et l’imposer en CI.",
    headline: "Une note continue de 0 à 5 pour la qualité du code, prédite par un modèle — pas une liste de règles.",
    year: "2026",
    role: "Machine learning, analyse statique, outillage",
    category: "Outillage · ML",
    stage: "linear-gradient(160deg, #ffb24a 0%, #d9622b 55%, #4a1c08 100%)",
    url: "github.com/Abdoulrazack1/Js-Ranker",
    cover: "/work/js-ranker-1.webp",
    gallery: [{ src: "/work/js-ranker-1.webp", caption: "Rapport : score global, sous-scores par feature, conseils priorisés." }],
    summary:
      "Là où un linter applique des règles binaires, Js-Ranker attribue une note continue via un réseau de régression TensorFlow.js entraîné sur 10 features AST — avec conseils de refactoring priorisés, API REST et quality gate GitHub Actions.",
    stack: ["Node.js", "TensorFlow.js", "Acorn", "AST", "Express", "GitHub Actions"],
    links: [{ label: "Code source", href: "https://github.com/Abdoulrazack1/Js-Ranker" }],
    metrics: [
      { value: "10", label: "features AST" },
      { value: "10→16→8→1", label: "réseau de régression" },
      { value: "0–5", label: "note continue" },
      { value: "CI", label: "quality gate" },
    ],
    case: [
      {
        type: "section",
        title: "Le problème",
        body: ["« Ce code est-il bon ? » est une question vague. Je voulais rendre la qualité mesurable : une note continue, reproductible et défendable, basée sur la structure réelle du code."],
      },
      { type: "quote", text: "Un linter dit « cette règle est violée ». Js-Ranker dit « 3,5 / 5 — voici pourquoi, et quoi corriger en premier »." },
      {
        type: "section",
        title: "L’approche",
        body: [
          "Chaque fonction est parsée en AST ; dix features normalisées en sont extraites : nommage, modularité, complexité cyclomatique, profondeur d’imbrication, gestion d’erreurs, pureté, maintenabilité…",
          "Elles alimentent un réseau 10 → 16 → 8 → 1. La note n’est pas une somme de règles : c’est une prédiction apprise, branchée dans la CI pour faire échouer un build sous un seuil.",
        ],
      },
    ],
  },

  {
    slug: "logic-lens",
    name: "Logic-Lens",
    line: "Une IA qui reconnaît la formule derrière une fonction — et sait dire « je ne sais pas ».",
    headline: "Reconnaître l’invariant mathématique d’une fonction JavaScript, et savoir s’abstenir.",
    year: "2026",
    role: "Recherche, machine learning, interface",
    category: "Recherche · ML",
    stage: "linear-gradient(160deg, #4f8bff 0%, #2a4fc0 55%, #0b1a4a 100%)",
    url: "github.com/Abdoulrazack1/Logic-Lens",
    cover: "/work/logic-lens-1.webp",
    gallery: [{ src: "/work/logic-lens-1.webp", caption: "Le code à gauche, l’analyse en cinq onglets à droite." }],
    summary:
      "Un Transformer Encoder TensorFlow.js classe une fonction parmi 25 formules canoniques — et rejette explicitement le code qui n’en est aucune (open-set recognition) au lieu d’halluciner avec aplomb.",
    stack: ["TensorFlow.js", "Transformer", "Acorn", "AST", "Node.js"],
    links: [{ label: "Code source", href: "https://github.com/Abdoulrazack1/Logic-Lens" }],
    metrics: [
      { value: "25 + 1", label: "formules + classe de rejet" },
      { value: "~4 000", label: "paires générées" },
      { value: "Encoder", label: "Transformer" },
      { value: "CPU", label: "aucun GPU" },
    ],
    case: [
      {
        type: "section",
        title: "L’idée",
        body: ["Lire une fonction et reconnaître la formule qu’elle implémente : donner F(n) = F(n−1) + F(n−2) à partir d’un Fibonacci récursif, avec un score de confiance."],
      },
      { type: "quote", text: "Reconnaître une formule connue est facile. Savoir s’abstenir quand le code n’en est aucune, c’est tout l’enjeu." },
      {
        type: "section",
        title: "Un classifieur peut être confiant et faux",
        body: [
          "Un classifieur fermé répond toujours quelque chose, parfois à 98 % de confiance sur du code sans rapport. Un seuil d’entropie n’attrape pas ces fausses certitudes.",
          "J’ai ajouté une 26ᵉ classe « aucune », entraînée sur du code hors-distribution. L’abstention devient une prédiction de première classe, vérifiable.",
        ],
      },
      {
        type: "list",
        title: "Le pipeline",
        items: [
          "Dataset : ~150 variantes par formule via mutation d’AST (renommage, réordonnancement, inlining, équivalences)",
          "Encodage des séquences AST en tenseurs",
          "Transformer Encoder entraîné sur CPU",
          "Interface web en cinq onglets et API",
        ],
      },
    ],
  },
];

export const featured = ["tsundoku", "cabinet", "galactic-brain", "cycling", "inkstudio", "inko"].map(
  (s) => projects.find((p) => p.slug === s)!,
);

export type LabItem = { name: string; desc: string; tags: string; year: string; image: string; href: string; internal?: boolean };

export const lab: LabItem[] = [
  { name: "Js-Ranker", desc: "Notation ML de la qualité du code, quality gate CI", tags: "TensorFlow.js · AST", year: "2026", image: "/work/js-ranker-1.webp", href: "/projets/js-ranker", internal: true },
  { name: "Logic-Lens", desc: "Reconnaissance de formules, open-set recognition", tags: "Transformer · AST", year: "2026", image: "/work/logic-lens-1.webp", href: "/projets/logic-lens", internal: true },
  { name: "TikTok Studio", desc: "Montage vidéo automatique 100 % local", tags: "Electron · React · Python · Whisper", year: "2026", image: "/work/tiktok-1.webp", href: "" },
  { name: "Kinka", desc: "E-commerce manga, panier hybride, JWT", tags: "Node · Express · MySQL", year: "2026", image: "/work/kinka-1.webp", href: "https://github.com/Abdoulrazack1/Kinka" },
  { name: "Safari Frenzy", desc: "Mini-jeu pixel-art, API de scores", tags: "Canvas · Express · SQLite", year: "2026", image: "/work/safari-1.webp", href: "https://abdoulrazack1.github.io/safari-frenzy/" },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
export const nextProject = (slug: string) => {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
};
