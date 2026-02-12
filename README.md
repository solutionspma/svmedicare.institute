# SV Medicare Institute — Ascension Mode

Elite Medicare training for healthcare and insurance professionals. Dark cinematic, interactive, gamified platform.

**Live:** https://svmedicare-institue.netlify.app

## Structure

- **ascension-app/** — Next.js app (App Router, static export). This is the only deployable site.
- **PDFs/** — Official Medicare, AHIP, compliance training materials.

## Deploy

```bash
cd ascension-app
npm run build
netlify deploy --prod --dir=out
```

See [DEPLOY.md](DEPLOY.md) for details.
