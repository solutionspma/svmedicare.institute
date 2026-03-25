# SV Medicare Institute — Ascension Mode

Elite Medicare training platform for healthcare and insurance professionals.
Content from **The Only Medicare Book You Need**.

## Stack

- **Next.js 16** (App Router)
- **Framer Motion** — cinematic transitions
- **Tailwind CSS** — custom design tokens
- **Pexels** — wooden/healthcare background images
- **Supabase** — Auth, Database, Storage

## Features

- 🎓 **6 Certification Modules** — Medicare basics to advanced compliance
- 🎧 **Audio Narration** — ElevenLabs integration for module introductions
- 🎥 **Live Presenter Mode** — Zoom, Teams, Cisco, openmeeting.space integration
- 🎯 **Interactive Lessons** — Scenario-based learning with mini-exams
- 🏆 **Gamification** — XP system, missions, trivia, rank progression
- 📊 **Progress Tracking** — LocalStorage + Supabase sync
- 🎨 **Cinematic Design** — Dark theme with gold accents and smooth animations

## Quick Start

```bash
npm install
cp .env.example .env.local
# Add PEXELS_API_KEY (and optionally Supabase) to .env.local
npm run dev
```

### Fetch fresh Pexels images

```bash
PEXELS_API_KEY=your-key node scripts/fetch-pexels-images.js
```

Open [http://localhost:3000](http://localhost:3000) for the Level 0 cinematic landing.

## Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Copy `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`
3. Run migrations in the Supabase SQL editor (Dashboard → SQL Editor), or use the CLI:

```bash
npx supabase init   # if not already
npx supabase link   # link to your project
npx supabase db push
```

Migrations are in `supabase/migrations/`:
- `20250211000000_initial_schema.sql` — Tables: profiles, theme_state, xp_records, modules, etc.
- `20250211000001_rls_policies.sql` — Row-level security
- `20250211000002_seed_data.sql` — 3 starter missions
- `20250302000000_audio_storage.sql` — Audio storage bucket for narration

## Audio Narration

Add audio narration to module introductions using ElevenLabs:

1. Generate audio files in ElevenLabs
2. Upload to Supabase Storage (`audio/module-intros/`)
3. Update URLs in `src/data/certification.ts`

See [AUDIO-SETUP.md](AUDIO-SETUP.md) for detailed instructions.

## Live Presenter Mode

Enable live video conferencing on any module for real-time instruction:

```typescript
// src/data/live-sessions.ts
"1": {
  enabled: true,
  platform: "openmeeting",  // zoom | teams | cisco | openmeeting
  meetingUrl: "https://openmeeting.space/medicare-basics",
  presenterName: "Debbie Thompson",
}
```

**Supported platforms:**
- ✅ Zoom
- ✅ Microsoft Teams
- ✅ Cisco WebEx
- ✅ openmeeting.space

See [LIVE-PRESENTER-SETUP.md](LIVE-PRESENTER-SETUP.md) for detailed configuration.

## Routes

| Route | Description |
|-------|-------------|
| `/` | Cinematic landing (Knowledge. Confidence. Excellence.) |
| `/dashboard` | XP meter, missions, trivia, live transfers |
| `/missions/[id]` | Mission detail + completion "CLEAR" animation |
| `/trivia` | 5-category Medicare trivia game with speech feedback |
| `/transfers` | Live Transfers guide — scripts, compliance, best practices |

## Design

- **Level 0**: Dark matte, kinetic typography, gold accents, light sweep
- **Level 1+**: HUD-style UI, rank ladder, mission cards
- Custom spacing (break the 4/8/16 grid), layered shadows, `cubic-bezier` easing
