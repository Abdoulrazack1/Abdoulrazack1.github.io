// Mesure la fluidité : intervalles entre frames pendant un scroll continu à la molette.
import puppeteer from "puppeteer-core";
import path from "node:path";
const [url = "http://localhost:3002/"] = process.argv.slice(2);
const chrome = path.join(process.env.USERPROFILE, ".cache/puppeteer/chrome/win64-148.0.7778.97/chrome-win64/chrome.exe");
const browser = await puppeteer.launch({ executablePath: chrome, headless: true, args: ["--no-sandbox", "--enable-gpu-rasterization"] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
if (process.env.THEME) await page.evaluateOnNewDocument((t) => localStorage.setItem("theme", t), process.env.THEME);
await page.goto(url, { waitUntil: "networkidle2", timeout: 90000 });
await new Promise((r) => setTimeout(r, 6000));
await page.mouse.move(600, 400);
await page.evaluate(() => {
  window.__f = [];
  let last = performance.now();
  const loop = (t) => { window.__f.push(t - last); last = t; if (window.__f.length < 100000) requestAnimationFrame(loop); };
  requestAnimationFrame(loop);
});
for (let i = 0; i < 90; i++) {
  await page.mouse.wheel({ deltaY: 120 });
  await page.mouse.move(500 + (i % 10) * 30, 400 + (i % 7) * 20);
  await new Promise((r) => setTimeout(r, 60));
}
await new Promise((r) => setTimeout(r, 800));
const f = await page.evaluate(() => window.__f.slice(2));
f.sort((a, b) => a - b);
const avg = f.reduce((a, b) => a + b, 0) / f.length;
const p95 = f[Math.floor(f.length * 0.95)];
const long = f.filter((x) => x > 25).length;
console.log(JSON.stringify({ frames: f.length, avgFps: +(1000 / avg).toFixed(1), p95ms: +p95.toFixed(1), framesOver25ms: long, pctJank: +((long / f.length) * 100).toFixed(1) }));
await browser.close();
