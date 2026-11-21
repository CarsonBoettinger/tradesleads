-- Website generation engine: brands, sites, jobs, assets, auth profiles.
-- Applied remotely via Supabase; kept in repo for local/CI parity.

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  full_name text,
  email text,
  role text NOT NULL DEFAULT 'client' CHECK (role = ANY (ARRAY['staff'::text, 'client'::text]))
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  place_id text,
  trade text,
  phone text,
  email text,
  website text,
  address text,
  town text,
  lat double precision,
  lng double precision,
  maps_uri text,
  status text NOT NULL DEFAULT 'draft' CHECK (status = ANY (ARRAY['draft'::text, 'generating'::text, 'ready'::text, 'published'::text, 'failed'::text])),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS brands_place_id_idx ON public.brands (place_id);
CREATE INDEX IF NOT EXISTS brands_status_idx ON public.brands (status);
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.brand_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  brand_id uuid NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'owner' CHECK (role = ANY (ARRAY['owner'::text, 'viewer'::text])),
  UNIQUE (brand_id, user_id)
);

CREATE INDEX IF NOT EXISTS brand_members_user_id_idx ON public.brand_members (user_id);
ALTER TABLE public.brand_members ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.brand_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  brand_id uuid NOT NULL UNIQUE REFERENCES public.brands(id) ON DELETE CASCADE,
  place_id text,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  source_urls text[] NOT NULL DEFAULT '{}',
  fetched_at timestamptz
);

ALTER TABLE public.brand_profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.brand_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  brand_id uuid NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind = ANY (ARRAY['logo'::text, 'hero'::text, 'gallery'::text, 'og'::text, 'other'::text])),
  storage_path text NOT NULL,
  public_url text,
  source_url text,
  attribution text,
  usage_notes text,
  width integer,
  height integer,
  sort_order integer NOT NULL DEFAULT 0,
  is_primary boolean NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS brand_assets_brand_id_idx ON public.brand_assets (brand_id);
ALTER TABLE public.brand_assets ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.site_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  brand_id uuid NOT NULL UNIQUE REFERENCES public.brands(id) ON DELETE CASCADE,
  template_id text NOT NULL DEFAULT 'trade-local-v1',
  theme jsonb NOT NULL DEFAULT '{}'::jsonb,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  seo jsonb NOT NULL DEFAULT '{}'::jsonb,
  keywords jsonb NOT NULL DEFAULT '{}'::jsonb,
  qa jsonb NOT NULL DEFAULT '{}'::jsonb,
  published_at timestamptz
);

ALTER TABLE public.site_configs ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.generation_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  brand_id uuid NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'queued' CHECK (status = ANY (ARRAY['queued'::text, 'running'::text, 'ready'::text, 'failed'::text])),
  phase text NOT NULL DEFAULT 'queued',
  attempts integer NOT NULL DEFAULT 0,
  error_message text,
  prompt_tokens integer,
  completion_tokens integer,
  estimated_cost_usd numeric(10,6),
  started_at timestamptz,
  completed_at timestamptz,
  qa jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS generation_jobs_brand_id_idx ON public.generation_jobs (brand_id);
CREATE INDEX IF NOT EXISTS generation_jobs_status_idx ON public.generation_jobs (status);
ALTER TABLE public.generation_jobs ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.generation_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  job_id uuid NOT NULL REFERENCES public.generation_jobs(id) ON DELETE CASCADE,
  brand_id uuid NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  phase text NOT NULL,
  level text NOT NULL DEFAULT 'info' CHECK (level = ANY (ARRAY['info'::text, 'warn'::text, 'error'::text])),
  message text NOT NULL,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS generation_logs_job_id_idx ON public.generation_logs (job_id);
ALTER TABLE public.generation_logs ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'staff'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_brand_member(target_brand uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_staff() OR EXISTS (
    SELECT 1 FROM public.brand_members m
    WHERE m.brand_id = target_brand AND m.user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'client')
  )
  ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
