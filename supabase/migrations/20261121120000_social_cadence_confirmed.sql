-- Track whether the client has chosen posting frequency (onboarding gate).

ALTER TABLE public.social_post_settings
  ADD COLUMN IF NOT EXISTS cadence_confirmed boolean NOT NULL DEFAULT false;
