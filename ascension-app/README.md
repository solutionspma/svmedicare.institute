# SV Medicare Institute — Ascension Mode

Elite Medicare training platform for healthcare and insurance professionals.
Content from **The Only Medicare Book You Need**.

## Stack

- **Next.js 16** (App Router)
- **Framer Motion** — cinematic transitions
- **Tailwind CSS** — custom design tokens
- **Pexels** — wooden/healthcare background images
- **Supabase** — Auth + Database (optional)

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
