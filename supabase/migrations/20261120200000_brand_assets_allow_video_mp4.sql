-- Allow hero MP4 uploads in brand-assets storage.
UPDATE storage.buckets
SET
  allowed_mime_types = ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'image/x-icon',
    'video/mp4'
  ],
  file_size_limit = 52428800
WHERE id = 'brand-assets';
