# SV Medicare Institute — Checkpoint

**Date:** Feb 12, 2026  
**Status:** Working well. Save point before break.

---

## What’s Done

### App structure
- **ascension-app/** — Next.js (App Router), static export, deploys to Netlify
- **Live:** https://svmedicare-institue.netlify.app (site ID: `bd062cce-9787-4edc-8be9-32ea31304216`)
- **Deploy:** `cd ascension-app && netlify link --id bd062cce-9787-4edc-8be9-32ea31304216` (one-time), then `npm run build && netlify deploy --prod --dir=out`

### Pages
- `/` — Cinematic landing
- `/dashboard` — XP meter, missions
- `/certification` — Certification hub (6 modules)
- `/certification/[moduleId]` — Module pages with 20/80 layout (filetree + content)
- `/certification/exam` — Certification exam
- `/trivia` — Trivia game
- `/transfers` — Live Transfers guide
- `/missions/[id]` — Mission pages

### Module learning flow
1. **Left sidebar (20%)** — Filetree of topics
2. **Main area (80%)** — Topic intro + learning objectives
3. **Click objective** → Full lesson expands inline (scenarios, narrative, key concepts, application, takeaway)
4. **Completion** — Only via passing the mini exam (no click-through “Mark complete”)

### Data
- `certification.ts` — 6 modules, objectives
- `module-content.ts` — Topic/subtopic hierarchy
- `topic-lessons.ts` — Scenario-based lessons (AHIP QA Key, Your Medicare Benefits)
- `objectives-content.ts` — 5+ pages per objective (popup-style content)
- `trivia.ts` — 56+ questions, 6 categories

### Completed features
- 20/80 layout with filetree sidebar
- Topic → objectives → full lesson flow
- Scenario-based lessons (Mrs. Foster SNF, Mr. Bauer SSDI, Mr. Moy Medigap, etc.)
- No click-through; completion only via mini exam
- Backend hook: `module-completion-config.ts` for future à la carte click-through
- Badge: “Module Complete” when mini exam passed
- Filetree checkmarks only after passing mini exam

### Removed
- Old Golden Outlook / netlify-site
- Old course-in-a-box
- Click-through “Mark complete” button

---

## Where to Pick Up

### Immediate next steps
- Add more scenario lessons for modules 3–6 (only some topics have full lessons)
- Add audio files under `/public/assets/audio/` (paths in module-content)
- Add ElevenLabs clips under `/public/assets/elevenlabs/`

### Later
- Backend: wire `canClickThroughModule()` for users who previously completed unchanged modules
- Supabase: auth, progress persistence (currently localStorage)
- More content from PDFs in folder

---

## Key Files

| File | Purpose |
|------|---------|
| `ascension-app/src/app/certification/[moduleId]/ModuleClient.tsx` | Module page, flow, mini exam |
| `ascension-app/src/data/topic-lessons.ts` | Scenario lessons, topic–objective mapping |
| `ascension-app/src/data/module-content.ts` | Topic tree |
| `ascension-app/src/lib/module-completion-config.ts` | Future click-through config |
| `ascension-app/src/components/LessonCanvas.tsx` | Lesson display (no Mark complete) |

---

## Deploy

```bash
cd ascension-app
npm run build
netlify deploy --prod --dir=out
```
