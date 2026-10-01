// Filme l'intro : captures à intervalles réguliers depuis une session neuve.
import puppeteer from "puppeteer-core";
import path from "node:path";
const [url = "http://localhost:3002/", out = "film", w = "1440", h = "900"] = process.argv.slice(2);
const chrome = path.join(process.env.USERPROFILE, ".cache/puppeteer/chrome/win64-148.0.7778.97/chrome-win64/chrome.exe");
const b = await puppeteer.launch({ executablePath: chrome, headless: true });
const p = await b.newPage();
const errs = [];
p.on("pageerror", (e) => errs.push(e.message));
await p.setViewport({ width: +w, height: +h, isMobile: +w < 700, hasTouch: +w < 700 });
await p.goto(url, { waitUntil: "domcontentloaded" });
const t0 = Date.now();
for (const ms of [500, 1200, 1900, 2600, 3300, 4000, 4600, 5200, 5800, 6600, 7600]) {
  await new Promise((r) => setTimeout(r, Math.max(0, ms - (Date.now() - t0))));
  await p.screenshot({ path: `${out}-${String(ms).padStart(5, "0")}.png` });
}
console.log("errors", JSON.stringify(errs));
await b.close();
