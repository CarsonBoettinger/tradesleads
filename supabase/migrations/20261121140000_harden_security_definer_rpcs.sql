-- Harden SECURITY DEFINER RPCs and app_settings exposure.
-- Trigger helpers keep EXECUTE for the roles that own the trigger path;
-- public PostgREST callers (anon / authenticated) are revoked where unsafe.

-- Fix mutable search_path on trigger timestamp helpers
ALTER FUNCTION public.set_posts_updated_at() SET search_path = public;
ALTER FUNCTION public.set_presence_reports_updated_at() SET search_path = public;

-- Revoke direct RPC execution of sensitive definer functions from API roles.
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.publish_agent_post(
  text, text, text, text, text, text, text, text[], text, text
) FROM PUBLIC, anon, authenticated;

-- Keep helpers available to authenticated RLS policies; block anonymous probing.
REVOKE ALL ON FUNCTION public.is_staff() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.is_brand_member(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_staff() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_brand_member(uuid) TO authenticated;

-- Service role (and postgres) retain EXECUTE for server-side blog publish + triggers.
GRANT EXECUTE ON FUNCTION public.publish_agent_post(
  text, text, text, text, text, text, text, text[], text, text
) TO service_role;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres, service_role;
GRANT EXECUTE ON FUNCTION public.rls_auto_enable() TO postgres, service_role;

-- Explicit deny policies on app_settings (contains blog_agent_token).
-- Service role bypasses RLS; anon/authenticated get no rows.
DROP POLICY IF EXISTS app_settings_no_direct_access ON public.app_settings;
CREATE POLICY app_settings_no_direct_access
  ON public.app_settings
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);
