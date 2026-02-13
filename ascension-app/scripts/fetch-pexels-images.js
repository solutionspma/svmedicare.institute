#!/usr/bin/env node
/**
 * Fetches Pexels images for SV Medicare Institute
 * Run: PEXELS_API_KEY=xxx node scripts/fetch-pexels-images.js
 * Images saved to public/assets/pexels/
 */

const fs = require("fs");
const path = require("path");
const https = require("https");

const API_KEY = process.env.PEXELS_API_KEY;
const OUT_DIR = path.join(__dirname, "../public/assets/pexels");

if (!API_KEY) {
  console.error("Set PEXELS_API_KEY in environment");
  process.exit(1);
}

const SEARCHES = [
  { query: "doctor stethoscope professional office", count: 2 },
  { query: "insurance agent senior citizen meeting", count: 2 },
  { query: "healthcare professional senior desk", count: 2 },
  { query: "agent discussing documents senior couple", count: 2 },
  { query: "senior medical appointment professional", count: 2 },
  { query: "professional agent paperwork elderly", count: 2 },
  { query: "warm office desk professional", count: 2 },
];

function fetch(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { Authorization: API_KEY } }, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => resolve(JSON.parse(data)));
    });
    req.on("error", reject);
  });
}

function download(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const file = fs.createWriteStream(filepath);
      res.pipe(file);
      file.on("finish", () => {
        file.close();
        resolve();
      });
    }).on("error", reject);
  });
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const manifest = [];
  let idx = 0;

  for (const { query, count } of SEARCHES) {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${count}`;
    const data = await fetch(url);
    if (!data.photos?.length) continue;

    for (const photo of data.photos.slice(0, count)) {
      const src = photo.src?.large2x || photo.src?.large || photo.src?.original;
      if (!src) continue;
      const ext = path.extname(new URL(src).pathname) || ".jpg";
      const filename = `pexels_${idx}${ext}`;
      const filepath = path.join(OUT_DIR, filename);
      await download(src, filepath);
      manifest.push({
        filename,
        alt: photo.alt || query,
        photographer: photo.photographer,
        url: photo.url,
      });
      idx++;
    }
  }

  fs.writeFileSync(path.join(OUT_DIR, "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log(`Saved ${manifest.length} images to ${OUT_DIR}`);
}

main().catch(console.error);
