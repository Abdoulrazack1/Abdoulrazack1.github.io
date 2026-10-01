// Génère l'image de partage (Open Graph) 1200×630 à partir d'un gabarit HTML.
import puppeteer from "puppeteer-core";
import path from "node:path";
import fs from "node:fs";
const chrome = path.join(process.env.USERPROFILE, ".cache/puppeteer/chrome/win64-148.0.7778.97/chrome-win64/chrome.exe");
const portrait = "data:image/webp;base64," + fs.readFileSync("public/work/portrait.webp").toString("base64");
const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Instrument+Sans:wght@400;500&family=JetBrains+Mono&display=swap" rel="stylesheet">
<style>
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#f3eee5;color:#1c1915;font-family:'Instrument Sans';position:relative;overflow:hidden}
.p{position:absolute;right:56px;top:56px;width:330px;height:518px;border-radius:12px;background:url(${portrait}) center 30%/cover}
.l{position:absolute;left:64px;top:60px;font:12px 'JetBrains Mono';letter-spacing:.16em;text-transform:uppercase;color:rgba(28,25,21,.55)}
h1{position:absolute;left:60px;top:150px;width:700px;font:400 82px/0.98 'Instrument Serif';letter-spacing:-.025em}
h1 em{color:#e24c25}
.f{position:absolute;left:64px;bottom:60px;display:flex;gap:14px;align-items:center;font-size:20px}
.dot{width:10px;height:10px;border-radius:50%;background:#2fbf6b}
.b{position:absolute;left:0;bottom:0;height:8px;width:100%;background:#e24c25}
</style></head><body>
<div class="l">Portfolio — Développeur full-stack</div>
<h1>Abdoulrazack Abdillahi, développeur basé à <em>Lille</em>.</h1>
<div class="f"><span class="dot"></span>Ouvert à toute opportunité · CDI, freelance, alternance</div>
<div class="p"></div><div class="b"></div>
</body></html>`;
const b = await puppeteer.launch({ executablePath: chrome, headless: true });
const p = await b.newPage();
await p.setViewport({ width: 1200, height: 630 });
await p.setContent(html, { waitUntil: "networkidle0" });
await p.evaluate(() => document.fonts.ready);
await p.screenshot({ path: "public/og.png" });
await b.close();
console.log("public/og.png");
