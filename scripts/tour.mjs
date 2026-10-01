// Visite automatisée : capture la page à plusieurs profondeurs de scroll.
import puppeteer from "puppeteer-core";
import path from "node:path";
const [url = "http://localhost:3002/", out = "shots", w = "1440", h = "900", steps = "10", stepPx = "900", intro = "6500"] = process.argv.slice(2);
const chrome = path.join(process.env.USERPROFILE, ".cache/puppeteer/chrome/win64-148.0.7778.97/chrome-win64/chrome.exe");
const browser = await puppeteer.launch({ executablePath: chrome, headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
await page.setViewport({ width: +w, height: +h, deviceScaleFactor: 1, isMobile: +w < 700, hasTouch: +w < 700 });
await page.goto(url, { waitUntil: "networkidle2", timeout: 90000 });
await new Promise((r) => setTimeout(r, +intro));
await page.mouse.move(+w / 2, +h / 2);
for (let i = 0; i <= +steps; i++) {
  await page.screenshot({ path: `${out}-${String(i).padStart(2, "0")}.png` });
  await page.mouse.wheel({ deltaY: +stepPx });
  await new Promise((r) => setTimeout(r, 1800));
}
console.log("height", await page.evaluate(() => document.documentElement.scrollHeight), "errors", JSON.stringify(errors.slice(0, 8)));
await browser.close();
