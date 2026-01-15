-- Ensure uniqueness so we can safely upsert by user_id / (user_id,currency)
CREATE UNIQUE INDEX IF NOT EXISTS profiles_user_id_key ON public.profiles (user_id);
CREATE UNIQUE INDEX IF NOT EXISTS assets_user_currency_key ON public.assets (user_id, currency);
CREATE UNIQUE INDEX IF NOT EXISTS user_roles_user_id_role_key ON public.user_roles (user_id, role);

-- Bootstrap rows for a newly signed-in user (called from the client after signup/login)
CREATE OR REPLACE FUNCTION public.bootstrap_user(_username text DEFAULT NULL, _email text DEFAULT NULL, _wallet_address text DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Create / update profile
  INSERT INTO public.profiles (user_id, email, username, wallet_address)
  VALUES (auth.uid(), _email, _username, _wallet_address)
  ON CONFLICT (user_id)
  DO UPDATE SET
    email = COALESCE(public.profiles.email, EXCLUDED.email),
    username = COALESCE(public.profiles.username, EXCLUDED.username),
    wallet_address = COALESCE(public.profiles.wallet_address, EXCLUDED.wallet_address);

  -- Ensure default role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (auth.uid(), 'user')
  ON CONFLICT (user_id, role) DO NOTHING;

  -- Ensure default assets
  INSERT INTO public.assets (user_id, currency, balance, frozen_balance)
  VALUES
    (auth.uid(), 'USDT', 0, 0),
    (auth.uid(), 'BTC', 0, 0),
    (auth.uid(), 'ETH', 0, 0)
  ON CONFLICT (user_id, currency) DO NOTHING;
END;
$$;