// Captures mobile (390×844) de l'accueil et d'une étude de cas, pour contrôle visuel.
// Usage : node scripts/mobile-shots.mjs <dossier-de-sortie> [url-de-base]
import puppeteer from "puppeteer-core";

const out = process.argv[2] ?? ".";
const base = process.argv[3] ?? "http://localhost:3002";
const browser = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: "new",
});
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true });

const shoot = async (url, name, selectors) => {
  await page.goto(base + url, { waitUntil: "networkidle0" });
  await page.evaluate(() => document.documentElement.classList.remove("js-reveal"));
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  console.log(`${name}: débordement horizontal ${overflow}px`);
  await page.screenshot({ path: `${out}/${name}-0.png` });
  for (const [i, sel] of selectors.entries()) {
    await page.evaluate((s) => document.querySelector(s)?.scrollIntoView(), sel);
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({ path: `${out}/${name}-${i + 1}.png` });
  }
};

await shoot("/", "home", [".bento", ".shows", ".rows", "#apropos", "#parcours", "#contact"]);
await shoot("/projets/tsundoku/", "case", [".case__shot", ".metrics"]);
await browser.close();
