-- Social posting agent: Meta connections, cadence settings, post queue.

CREATE TABLE IF NOT EXISTS public.social_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  brand_id uuid NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  platform text NOT NULL CHECK (platform = ANY (ARRAY['facebook'::text, 'instagram'::text])),
  page_id text NOT NULL,
  page_name text,
  ig_user_id text,
  access_token_encrypted text NOT NULL,
  token_expires_at timestamptz,
  connected_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status = ANY (ARRAY['active'::text, 'revoked'::text, 'expired'::text])),
  UNIQUE (brand_id, platform)
);

CREATE INDEX IF NOT EXISTS social_connections_brand_id_idx
  ON public.social_connections (brand_id);

ALTER TABLE public.social_connections ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.social_post_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  brand_id uuid NOT NULL UNIQUE REFERENCES public.brands(id) ON DELETE CASCADE,
  frequency text NOT NULL DEFAULT 'daily' CHECK (
    frequency = ANY (ARRAY['daily'::text, 'weekdays'::text, '3x_week'::text, 'weekly'::text])
  ),
  timezone text NOT NULL DEFAULT 'America/Toronto',
  preferred_hour integer NOT NULL DEFAULT 10 CHECK (preferred_hour >= 0 AND preferred_hour <= 23),
  enabled boolean NOT NULL DEFAULT true,
  look_ahead_days integer NOT NULL DEFAULT 7 CHECK (look_ahead_days >= 1 AND look_ahead_days <= 30)
);

ALTER TABLE public.social_post_settings ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.social_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  brand_id uuid NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  caption text NOT NULL DEFAULT '',
  image_asset_id uuid REFERENCES public.brand_assets(id) ON DELETE SET NULL,
  image_url text,
  platforms text[] NOT NULL DEFAULT '{facebook,instagram}',
  status text NOT NULL DEFAULT 'pending_approval' CHECK (
    status = ANY (ARRAY[
      'pending_approval'::text,
      'approved'::text,
      'rejected'::text,
      'scheduled'::text,
      'publishing'::text,
      'published'::text,
      'failed'::text
    ])
  ),
  scheduled_for timestamptz NOT NULL,
  published_at timestamptz,
  facebook_post_id text,
  instagram_post_id text,
  error_message text,
  approved_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_at timestamptz,
  generation_meta jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS social_posts_brand_id_idx ON public.social_posts (brand_id);
CREATE INDEX IF NOT EXISTS social_posts_status_scheduled_idx
  ON public.social_posts (status, scheduled_for);
CREATE INDEX IF NOT EXISTS social_posts_brand_scheduled_idx
  ON public.social_posts (brand_id, scheduled_for);

ALTER TABLE public.social_posts ENABLE ROW LEVEL SECURITY;

-- Read access for staff + brand members (tokens never exposed via API).
CREATE POLICY social_connections_select ON public.social_connections
  FOR SELECT TO authenticated
  USING (public.is_brand_member(brand_id));

CREATE POLICY social_post_settings_select ON public.social_post_settings
  FOR SELECT TO authenticated
  USING (public.is_brand_member(brand_id));

CREATE POLICY social_posts_select ON public.social_posts
  FOR SELECT TO authenticated
  USING (public.is_brand_member(brand_id));
