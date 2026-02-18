-- Add admin bootstrap function and policy to allow first admin creation
BEGIN;

-- Function to check if any admin exists
CREATE OR REPLACE FUNCTION public.admin_exists()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE role = 'admin'
  );
$$;

-- Ensure authenticated users can execute the function
GRANT EXECUTE ON FUNCTION public.admin_exists() TO authenticated;

-- Policy to allow the very first admin to self-assign the admin role
DROP POLICY IF EXISTS "Bootstrap: first admin can self-assign" ON public.user_roles;
CREATE POLICY "Bootstrap: first admin can self-assign"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  NOT public.admin_exists()
  AND auth.uid() = user_id
  AND role = 'admin'::public.app_role
);

COMMIT;