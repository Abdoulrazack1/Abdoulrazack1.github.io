import puppeteer from "puppeteer-core";
import path from "node:path";
const chrome = path.join(process.env.USERPROFILE, ".cache/puppeteer/chrome/win64-148.0.7778.97/chrome-win64/chrome.exe");
const b = await puppeteer.launch({ executablePath: chrome, headless: true });
const p = await b.newPage();
await p.setViewport({ width: 1440, height: 900 });
await p.goto("http://localhost:3002/", { waitUntil: "domcontentloaded" });
// Échantillonne : quelle image est au-dessus (dernière révélée) vs quelle légende est affichée.
const samples = [];
for (let k = 0; k < 40; k++) {
  await new Promise((r) => setTimeout(r, 100));
  samples.push(await p.evaluate(() => {
    const imgs = [...document.querySelectorAll(".loader__img")];
    let top = 0;
    imgs.forEach((im, i) => { const c = getComputedStyle(im).clipPath; if (i === 0 || c === "none" || /inset\(0(px|%)? 0(px|%)? 0(px|%)? 0(px|%)?\)/.test(c) || c.startsWith("inset(0%") || (c.startsWith("inset(") && parseFloat(c.slice(6)) < 50)) top = i; });
    const idx = document.querySelector(".loader__caption-index")?.textContent;
    return `${top}:${idx}`;
  }));
}
console.log(samples.join(" "));
await b.close();
