-- Migration: Audio Storage for Module Introductions
-- Creates a public storage bucket for audio narration files

-- Create storage bucket for audio files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'audio',
  'audio',
  true,
  10485760, -- 10MB limit per file
  ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/webm', 'audio/aac', 'audio/m4a']
)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read audio files (public bucket)
CREATE POLICY "Public audio files are readable by everyone"
ON storage.objects FOR SELECT
USING (bucket_id = 'audio');

-- Policy: Authenticated users can upload audio files
CREATE POLICY "Authenticated users can upload audio files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'audio' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'module-intros'
);

-- Policy: Authenticated users can update their uploaded audio
CREATE POLICY "Authenticated users can update audio files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'audio' 
  AND auth.role() = 'authenticated'
)
WITH CHECK (
  bucket_id = 'audio' 
  AND auth.role() = 'authenticated'
);

-- Policy: Authenticated users can delete audio files
CREATE POLICY "Authenticated users can delete audio files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'audio' 
  AND auth.role() = 'authenticated'
);

-- Create a view to easily list module intro audio files
CREATE OR REPLACE VIEW public.module_audio_files AS
SELECT 
  name,
  id,
  created_at,
  updated_at,
  metadata->>'size' as file_size,
  metadata->>'mimetype' as mime_type
FROM storage.objects
WHERE bucket_id = 'audio' 
  AND (storage.foldername(name))[1] = 'module-intros'
ORDER BY name;

-- Grant access to the view
GRANT SELECT ON public.module_audio_files TO authenticated, anon;

COMMENT ON TABLE storage.buckets IS 'Audio storage bucket for module introduction narrations';
COMMENT ON VIEW public.module_audio_files IS 'Lists all audio files in the module-intros folder';
