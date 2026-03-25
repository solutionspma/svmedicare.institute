#!/usr/bin/env node
/**
 * Fetches Pexels images for SV Medicare Institute
 * Run: PEXELS_API_KEY=xxx node scripts/fetch-pexels-images.js
 * Images saved to public/assets/pexels/
 * Deduplicates by photo ID. ~42 images (3x original).
 */

const fs = require("fs");
const path = require("path");
const https = require("https");

const API_KEY = process.env.PEXELS_API_KEY;
const OUT_DIR = path.join(__dirname, "../public/assets/pexels");
const TARGET_COUNT = 42;

if (!API_KEY) {
  console.error("Set PEXELS_API_KEY in environment");
  process.exit(1);
}

// Contextual searches — Live Transfers first (agent headset/phone), then certification, missions, etc.
const SEARCHES = [
  { query: "agent headset phone call", count: 4 },
  { query: "call center agent headset", count: 4 },
  { query: "insurance agent on phone", count: 3 },
  { query: "senior citizen on phone call", count: 3 },
  { query: "doctor professional office desk", count: 3 },
  { query: "doctor stethoscope medical", count: 2 },
  { query: "healthcare professional senior consultation", count: 3 },
  { query: "agent discussing documents senior couple", count: 3 },
  { query: "medical appointment professional", count: 2 },
  { query: "senior medical consultation office", count: 2 },
  { query: "professional office desk workspace", count: 2 },
  { query: "Medicare healthcare office", count: 2 },
  { query: "compliance professional documents", count: 2 },
  { query: "enrollment paperwork senior", count: 2 },
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
  const seenIds = new Set();
  let idx = 0;

  for (const { query, count } of SEARCHES) {
    if (idx >= TARGET_COUNT) break;
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${Math.min(count * 2, 15)}`;
    const data = await fetch(url);
    if (!data.photos?.length) continue;

    for (const photo of data.photos) {
      if (idx >= TARGET_COUNT) break;
      if (seenIds.has(photo.id)) continue;
      seenIds.add(photo.id);

      const src = photo.src?.large2x || photo.src?.large || photo.src?.original;
      if (!src) continue;

      const ext = path.extname(new URL(src).pathname) || ".jpg";
      const filename = `pexels_${idx}${ext}`;
      const filepath = path.join(OUT_DIR, filename);
      await download(src, filepath);
      manifest.push({
        id: photo.id,
        filename,
        alt: photo.alt || query,
        photographer: photo.photographer,
        url: photo.url,
      });
      idx++;
    }
  }

  fs.writeFileSync(path.join(OUT_DIR, "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log(`Saved ${manifest.length} unique images to ${OUT_DIR}`);
}

main().catch(console.error);
