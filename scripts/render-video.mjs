// Rendu image par image de video/promo.html → MP4 (30 i/s, sans saccade).
// La timeline GSAP est en pause : on la positionne à chaque instant exact, puis on capture.
// Usage : node scripts/render-video.mjs [sortie.mp4] [fps]
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFileSync } from "node:child_process";
import puppeteer from "puppeteer-core";

const [out = "video/promo.mp4", fpsArg = "30"] = process.argv.slice(2);
const fps = +fpsArg;
const root = process.cwd();
const types = { ".html": "text/html", ".js": "text/javascript", ".webp": "image/webp", ".png": "image/png", ".css": "text/css", ".woff2": "font/woff2" };
const server = http
  .createServer((req, res) => {
    const f = path.join(root, decodeURIComponent(req.url.split("?")[0]));
    fs.readFile(f, (err, buf) => {
      if (err) return res.writeHead(404).end();
      res.writeHead(200, { "Content-Type": types[path.extname(f)] || "application/octet-stream" }).end(buf);
    });
  })
  .listen(8123);

const dir = process.env.KEEP || fs.mkdtempSync(path.join(os.tmpdir(), "promo-"));
fs.mkdirSync(dir, { recursive: true });
const chrome = path.join(process.env.USERPROFILE, ".cache/puppeteer/chrome/win64-148.0.7778.97/chrome-win64/chrome.exe");
const browser = await puppeteer.launch({ executablePath: chrome, headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 1 });
await page.goto("http://127.0.0.1:8123/video/promo.html", { waitUntil: "networkidle0" });
await page.evaluate(() => window.whenReady.then(() => true));

const duration = await page.evaluate(() => window.tl.duration());
const frames = Math.round(duration * fps);
for (let i = 0; i < frames; i++) {
  await page.evaluate((t) => {
    window.tl.seek(t, false);
  }, i / fps);
  await page.screenshot({ path: path.join(dir, `f${String(i).padStart(4, "0")}.png`) });
  if (i % 60 === 0) console.log(`frame ${i}/${frames}`);
}
await browser.close();
server.close();

execFileSync("ffmpeg", ["-y", "-framerate", String(fps), "-i", path.join(dir, "f%04d.png"), "-c:v", "libx264", "-preset", "slow", "-crf", "15", "-pix_fmt", "yuv420p", "-movflags", "+faststart", out], { stdio: "inherit" });
if (!process.env.KEEP) fs.rmSync(dir, { recursive: true, force: true });
console.log("OK", out);
