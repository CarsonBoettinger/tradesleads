-- Opaque preview slugs + custom domain launch fields for generated sites.

ALTER TABLE public.brands
  ADD COLUMN IF NOT EXISTS custom_domain text,
  ADD COLUMN IF NOT EXISTS custom_domain_www boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS domain_status text NOT NULL DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS domain_error text,
  ADD COLUMN IF NOT EXISTS domain_verified_at timestamptz,
  ADD COLUMN IF NOT EXISTS ssl_provisioned_at timestamptz;

ALTER TABLE public.brands
  DROP CONSTRAINT IF EXISTS brands_domain_status_check;

ALTER TABLE public.brands
  ADD CONSTRAINT brands_domain_status_check
  CHECK (
    domain_status = ANY (
      ARRAY[
        'none'::text,
        'pending_dns'::text,
        'pending_ssl'::text,
        'live'::text,
        'error'::text
      ]
    )
  );

CREATE UNIQUE INDEX IF NOT EXISTS brands_custom_domain_uidx
  ON public.brands (custom_domain)
  WHERE custom_domain IS NOT NULL;

-- Backfill name-based slugs to opaque tokens so previews are not guessable.
DO $$
DECLARE
  r record;
  candidate text;
  alphabet constant text := '0123456789abcdefghjkmnpqrstvwxyz';
  i int;
  tries int;
BEGIN
  FOR r IN
    SELECT id, slug
    FROM public.brands
    WHERE slug ~ '[a-z]'
      AND (
        slug ~ '-'
        OR length(slug) > 16
        OR slug ~ '(plumbing|hvac|electric|roof|landscap|contract|heating|cooling|service|company|inc|llc)'
        OR slug !~ '^[0-9abcdefghjkmnpqrstvwxyz]{10,20}$'
      )
  LOOP
    tries := 0;
    LOOP
      candidate := '';
      FOR i IN 1..12 LOOP
        candidate := candidate || substr(
          alphabet,
          1 + floor(random() * length(alphabet))::int,
          1
        );
      END LOOP;
      EXIT WHEN NOT EXISTS (
        SELECT 1 FROM public.brands b WHERE b.slug = candidate
      );
      tries := tries + 1;
      EXIT WHEN tries > 40;
    END LOOP;

    IF tries <= 40 THEN
      -- Keep lead sources in sync with the new slug.
      UPDATE public.leads
      SET source = 'site:' || candidate
      WHERE source = 'site:' || r.slug;

      UPDATE public.brands
      SET slug = candidate, updated_at = now()
      WHERE id = r.id;
    END IF;
  END LOOP;
END $$;
