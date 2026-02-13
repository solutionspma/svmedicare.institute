# 🚀 Deployment — SV Medicare Institute (Ascension Mode)

**Live URL:** https://svmedicare-institue.netlify.app (or svmedicare.institute)
**Site ID:** `bd062cce-9787-4edc-8be9-32ea31304216` — this is the actual svmedicare.institute site.

Uses **static export** (output: "export") — bulletproof deploy, no serverless. Plain HTML/CSS/JS.

---

## Quick Deploy (CLI)

```bash
cd ascension-app

# Link to svmedicare.institute site (one-time)
netlify link --id bd062cce-9787-4edc-8be9-32ea31304216

# Build + deploy
npm run build
netlify deploy --prod --dir=out
```

---

## Deploy from Git (Auto-deploy)

1. Push this repo to GitHub
2. In [Netlify Dashboard](https://app.netlify.com) → **svmedicare-institue** (site ID above) → **Site settings** → **Build & deploy**
3. Confirm:
   - **Base directory:** `ascension-app` (so Netlify builds from that folder)
   - **Build command:** `npm run build`
4. Add environment variables (Site settings → Environment variables):
   - `NEXT_PUBLIC_SUPABASE_URL` — your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — your Supabase anon key
5. Trigger a deploy (or push to your connected branch)

---

## What Gets Deployed

- **Level 0 landing** — Cinematic "DISCIPLINE. KNOWLEDGE. DOMINANCE."
- **Dashboard** — XP meter, rank ladder, 3 missions
- **Missions** — `/missions/1`, `/missions/2`, `/missions/3` with CLEAR animation

Netlify uses the **OpenNext** adapter for Next.js — zero config for App Router, SSR, image optimization.

---

## Troubleshooting

**Build fails:** Ensure `ascension-app/package.json` has all deps. Run `npm install` in `ascension-app/` locally first.

**Wrong site deploying:** Run `netlify link --id bd062cce-9787-4edc-8be9-32ea31304216` to link CLI to this site.

**Supabase 404s:** Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Netlify env vars, then redeploy.
