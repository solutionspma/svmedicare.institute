# Supabase Setup - Quick Start

Your Supabase project is configured and ready!

## 🔧 Credentials (Already Set Up)

✅ `.env.local` created with your Supabase credentials  
✅ Project URL: `https://supjsnjsbtxsehmsjicv.supabase.co`  
✅ All audio URL examples updated in code

## 📝 Next Steps (Once Your DB Finishes Setting Up)

### 1. Run the Audio Storage Migration

Once your Supabase database is ready, run this migration to create the audio storage bucket:

```bash
cd ascension-app

# If you have Supabase CLI installed:
npx supabase db push

# OR manually run the migration in Supabase Dashboard:
# Go to SQL Editor and run the migration file:
# supabase/migrations/20250302000000_audio_storage.sql
```

### 2. Create the Audio Bucket (Alternative Method)

If the migration doesn't work, you can create the bucket manually:

1. Go to https://supabase.com/dashboard/project/supjsnjsbtxsehmsjicv/storage/buckets
2. Click "New Bucket"
3. Name it: `audio`
4. Set it to **Public**
5. Set file size limit: 10MB
6. Allowed MIME types: `audio/mpeg, audio/mp3, audio/wav, audio/ogg, audio/webm, audio/aac, audio/m4a`

### 3. Upload Your Audio Files

Follow the guide in [AUDIO-SETUP.md](AUDIO-SETUP.md) to:
- Generate audio with ElevenLabs
- Upload to `audio/module-intros/` folder
- Update the URLs in [src/data/certification.ts](src/data/certification.ts)

### 4. Test Your Setup

```bash
# Start the dev server
npm run dev

# Visit any certification module page
open http://localhost:3000/certification/1
```

You should see:
- The audio player component below the module title
- A placeholder message (until you upload audio files)

## 📂 Audio File Organization

Upload your ElevenLabs audio files to this structure in Supabase Storage:

```
audio/ (bucket)
└── module-intros/
    ├── module-1-intro.mp3  ← Medicare Program Basics
    ├── module-2-intro.mp3  ← Plan Types & Benefits
    ├── module-3-intro.mp3  ← Compliance & Marketing
    ├── module-4-intro.mp3  ← Communications & Marketing Rules
    ├── module-5-intro.mp3  ← Fraud, Waste & Abuse
    └── module-6-intro.mp3  ← Enrollment & Election Periods
```

## 🔗 Your Audio URLs Will Be:

```
https://supjsnjsbtxsehmsjicv.supabase.co/storage/v1/object/public/audio/module-intros/module-1-intro.mp3
https://supjsnjsbtxsehmsjicv.supabase.co/storage/v1/object/public/audio/module-intros/module-2-intro.mp3
...etc
```

## ✏️ Activating Audio on a Module

In [src/data/certification.ts](src/data/certification.ts), uncomment the `audioUrl` line:

```typescript
{
  id: "1",
  title: "Medicare Program Basics",
  // Change this:
  // audioUrl: "https://supjsnjsbtxsehmsjicv.supabase.co/storage/v1/object/public/audio/module-intros/module-1-intro.mp3",
  
  // To this:
  audioUrl: "https://supjsnjsbtxsehmsjicv.supabase.co/storage/v1/object/public/audio/module-intros/module-1-intro.mp3",
}
```

## 🎯 Quick Test (Before Uploading Audio)

You can test the audio player with any public MP3 URL temporarily:

```typescript
audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
```

This validates the player works before you generate your actual audio files.

## 🆘 Troubleshooting

**"Audio storage bucket not found"**
- Run the migration or create the bucket manually in Supabase Dashboard

**Audio doesn't play**
- Check browser console for errors
- Verify the bucket is set to "Public"
- Try accessing the URL directly in a new browser tab

**Need help?**
- Check [AUDIO-SETUP.md](AUDIO-SETUP.md) for detailed instructions
- Verify credentials in `.env.local` are correct
