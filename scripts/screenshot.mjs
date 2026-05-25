/**
 * screenshot.mjs — takes a screenshot of the given URL
 * Usage: node screenshot.mjs <url> [label]
 * Output: ./temporary screenshots/screenshot-N[-label].png
 */
import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const url = process.argv[2] || "http://localhost:3000";
const label = process.argv[3] || "";

const outDir = path.join(__dirname, "temporary screenshots");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// Auto-increment screenshot number
const existing = fs.readdirSync(outDir).filter((f) => f.endsWith(".png"));
const nums = existing.map((f) => parseInt(f.match(/screenshot-(\d+)/)?.[1] ?? "0")).filter(Boolean);
const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;

const filename = label
  ? `screenshot-${next}-${label}.png`
  : `screenshot-${next}.png`;
const outPath = path.join(outDir, filename);

(async () => {
  console.log(`📸 Screenshotting ${url} …`);
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
  await page.screenshot({ path: outPath, fullPage: false });
  await browser.close();
  console.log(`✓ Saved: ${outPath}`);
})();
