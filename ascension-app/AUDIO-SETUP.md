# Audio Narration Setup Guide

This guide explains how to add audio narration to the certification module pages using ElevenLabs and Supabase Storage.

## Overview

Each certification module can have an audio narration of its introduction text. The audio player appears below the module title and description on each module page.

## Step 1: Generate Audio with ElevenLabs

1. Go to [ElevenLabs](https://elevenlabs.io/)
2. Copy the module description text from `/ascension-app/src/data/certification.ts`
3. Generate the audio using your preferred voice
4. Download the audio file (MP3 format recommended for best compatibility)
5. Name the file following this pattern: `module-{id}-intro.mp3`
   - Example: `module-1-intro.mp3`, `module-2-intro.mp3`, etc.

## Step 2: Upload to Supabase Storage

### Option A: Using Supabase Dashboard (Easiest)

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/supjsnjsbtxsehmsjicv
2. Navigate to **Storage** in the left sidebar
3. Find or create the `audio` bucket (should be public)
4. Create a folder called `module-intros` if it doesn't exist
5. Upload your audio files to `audio/module-intros/`
6. After uploading, click on the file and copy the public URL

### Option B: Using Supabase CLI

```bash
# From the ascension-app directory
cd ascension-app

# Upload a single file
npx supabase storage upload audio/module-intros/module-1-intro.mp3 ./path/to/your/module-1-intro.mp3

# Upload multiple files
npx supabase storage upload audio/module-intros/ ./audio-files/*.mp3
```

### Option C: Using JavaScript/API

```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Upload file
const file = event.target.files[0] // from file input
const { data, error } = await supabase.storage
  .from('audio')
  .upload(`module-intros/module-1-intro.mp3`, file, {
    cacheControl: '3600',
    upsert: true
  })

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('audio')
  .getPublicUrl('module-intros/module-1-intro.mp3')

console.log(publicUrl)
```

## Step 3: Update Module Configuration

1. Open `/ascension-app/src/data/certification.ts`
2. Find the module you want to add audio to
3. Uncomment and update the `audioUrl` field with your Supabase public URL:

```typescript
{
  id: "1",
  title: "Medicare Program Basics",
  description: "Eligibility, Parts A & B, Original Medicare, premiums, and Medigap.",
  // ... other fields ...
  audioUrl: "https://supjsnjsbtxsehmsjicv.supabase.co/storage/v1/object/public/audio/module-intros/module-1-intro.mp3",
}
```

## Step 4: Test

1. Run your development server: `npm run dev`
2. Navigate to `/certification/1` (or whichever module you added audio to)
3. You should see the audio player below the module description
4. Click play to test the audio

## File Naming Convention

Keep your audio files organized:
- `module-1-intro.mp3` - Medicare Program Basics
- `module-2-intro.mp3` - Plan Types & Benefits
- `module-3-intro.mp3` - Compliance & Marketing
- `module-4-intro.mp3` - Communications & Marketing Rules
- `module-5-intro.mp3` - Fraud, Waste & Abuse
- `module-6-intro.mp3` - Enrollment & Election Periods

## Audio Specifications

**Recommended settings:**
- Format: MP3
- Bitrate: 128kbps (good balance of quality and file size)
- Sample Rate: 44.1kHz
- Channels: Mono (stereo is fine but not necessary for voice)
- Max file size: 10MB (set in Supabase bucket)

## Updating Audio

To replace audio for a module:
1. Upload the new file with the same name to Supabase Storage (use `upsert: true`)
2. The URL remains the same, so no code changes needed
3. Users may need to refresh their browser to hear the new audio (browser caching)

## Removing Audio

To remove audio from a module:
1. Comment out or remove the `audioUrl` line in `certification.ts`
2. The audio player will show a placeholder message instead

## Troubleshooting

**Audio not playing:**
- Check browser console for CORS errors
- Verify the Supabase bucket is set to public
- Ensure the file URL is correct and accessible
- Check file format is supported (MP3, WAV, OGG, etc.)

**File upload fails:**
- Check file size (must be under 10MB)
- Verify file mime type is in the allowed list
- Ensure you're authenticated with Supabase when uploading

**Audio quality issues:**
- Increase bitrate in ElevenLabs export settings
- Use MP3 or AAC format for best web compatibility
- Avoid over-compressing the audio

## Supabase Storage Structure

```
audio/ (bucket)
└── module-intros/
    ├── module-1-intro.mp3
    ├── module-2-intro.mp3
    ├── module-3-intro.mp3
    ├── module-4-intro.mp3
    ├── module-5-intro.mp3
    └── module-6-intro.mp3
```

## Getting Your Supabase URLs

Your Supabase storage URLs follow this pattern:
```
https://supjsnjsbtxsehmsjicv.supabase.co/storage/v1/object/public/audio/module-intros/[FILENAME]
```

Example: `https://supjsnjsbtxsehmsjicv.supabase.co/storage/v1/object/public/audio/module-intros/module-1-intro.mp3`
