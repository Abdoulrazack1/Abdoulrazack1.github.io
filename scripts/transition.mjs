import puppeteer from "puppeteer-core";
import path from "node:path";
const chrome = path.join(process.env.USERPROFILE, ".cache/puppeteer/chrome/win64-148.0.7778.97/chrome-win64/chrome.exe");
const b = await puppeteer.launch({ executablePath: chrome, headless: true });
const p = await b.newPage();
const errs=[]; p.on("pageerror", e=>errs.push(e.message));
await p.setViewport({ width: 1440, height: 900 });
await p.goto("" + (process.env.BASE || "http://localhost:3002/") + "", { waitUntil: "networkidle2" });
await new Promise(r => setTimeout(r, 5000));
await p.evaluate(() => document.querySelector('a.card[href="/projets/galactic-brain"]').scrollIntoView());
await new Promise(r => setTimeout(r, 1500));
await p.click('a.card[href="/projets/galactic-brain"]');
const out = process.env.TEMP + "/pf/t";
for (const [i, ms] of [[0, 450], [1, 650], [2, 1400], [3, 2600]]) { await new Promise(r => setTimeout(r, ms)); await p.screenshot({ path: `${out}${i}.png` }); }
console.log(p.url(), "scrollY", await p.evaluate(() => scrollY), errs);
await b.close();
