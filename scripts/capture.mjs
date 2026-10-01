// Capture d'écran d'un dossier statique via un mini-serveur + Chrome headless.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

const [root, out, w = "1600", h = "1000", wait = "2500"] = process.argv.slice(2);
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".json": "application/json", ".webmanifest": "application/json" };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p.endsWith("/")) p += "index.html";
  const f = path.join(root, p);
  fs.readFile(f, (err, buf) => {
    if (err) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { "Content-Type": types[path.extname(f)] || "application/octet-stream" });
    res.end(buf);
  });
}).listen(8099);

const chrome = path.join(process.env.USERPROFILE, ".cache/puppeteer/chrome/win64-148.0.7778.97/chrome-win64/chrome.exe");
const browser = await puppeteer.launch({ executablePath: chrome, headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: +w, height: +h, deviceScaleFactor: 1 });
await page.goto("http://127.0.0.1:8099/", { waitUntil: "networkidle2", timeout: 60000 }).catch(() => {});
if (process.env.CLICK_TEXT) {
  await page.evaluate((t) => { const el = [...document.querySelectorAll("button,a")].find((e) => e.textContent.includes(t)); el?.click(); }, process.env.CLICK_TEXT);
}
await new Promise((r) => setTimeout(r, +wait));
await page.screenshot({ path: out });
await browser.close();
server.close();
console.log("ok", out);
