-- Month-ahead social drafts: default + backfill look_ahead_days to 30
ALTER TABLE public.social_post_settings
  ALTER COLUMN look_ahead_days SET DEFAULT 30;

UPDATE public.social_post_settings
SET look_ahead_days = 30,
    updated_at = now()
WHERE look_ahead_days = 7;
