// Collecte + optimisation des visuels de projets → public/work/*.webp
import sharp from "sharp";
import fs from "node:fs";
const W = "C:/laragon/www";
const PN = `${W}/portfolio-next/public`;
const CAB = `${W}/cabinet-avocat/apps/espace/captures`;
const map = {
  "portrait": `${PN}/img/profil.jpg`,
  "tsundoku-1": `${PN}/projects/tsundoku-1.webp`,
  "tsundoku-2": `${PN}/projects/tsundoku-2.webp`,
  "tsundoku-3": `${PN}/projects/tsundoku-3.webp`,
  "tsundoku-4": `${PN}/projects/tsundoku-4.webp`,
  "tsundoku-5": `${PN}/projects/tsundoku-5.webp`,
  "cycling-1": `${PN}/projects/cycling-1.webp`,
  "cycling-2": `${PN}/projects/cycling-2.webp`,
  "cycling-3": `${PN}/projects/cycling-3.webp`,
  "inko-1": `${PN}/projects/inko-1.webp`,
  "inko-2": `${PN}/projects/inko-2.webp`,
  "inko-3": `${PN}/projects/inko-3.webp`,
  "inko-4": `${PN}/projects/inko-4.webp`,
  "js-ranker-1": `${PN}/projects/js-ranker-1.webp`,
  "logic-lens-1": `${PN}/projects/logic-lens-1.webp`,
  "cabinet-1": `${CAB}/tableau-de-bord-bureau.png`,
  "cabinet-2": `${CAB}/dossiers-bureau.png`,
  "cabinet-3": `${CAB}/rendez-vous-bureau.png`,
  "cabinet-4": `${CAB}/cabinet-revue-acces-bureau.png`,
  "cabinet-5": `${CAB}/connexion-bureau.png`,
  "cabinet-m1": `${CAB}/tableau-de-bord-mobile.png`,
  "cabinet-m2": `${CAB}/dossiers-mobile.png`,
  "galactic-1": "C:/Users/PC/galactic-brain-mcp/screenshots/banner.png",
  "inkstudio-1": "scripts/inkstudio-src.png",
  "kinka-1": `${W}/Kinka/docs/screenshots/01_accueil.png`,
  "kinka-2": `${W}/Kinka/docs/screenshots/03_catalogue.png`,
  "safari-1": `${W}/safari-frenzy/public/screenshots/title.png`,
  "tiktok-1": `${W}/tiktok-auto-editor/assets/avatars/_montage.png`,
};
fs.mkdirSync("public/work", { recursive: true });
for (const [name, src] of Object.entries(map)) {
  if (!fs.existsSync(src)) { console.log("MISSING", name, src); continue; }
  const mobile = name.includes("-m") || name === "portrait";
  const info = await sharp(src).resize({ width: mobile ? 900 : 1800, withoutEnlargement: true }).webp({ quality: 80 }).toFile(`public/work/${name}.webp`);
  console.log(name, info.width + "x" + info.height, Math.round(info.size / 1024) + "KB");
}
