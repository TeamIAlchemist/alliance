import { createClient } from '@supabase/supabase-js';
// Navigateur (cle anon/publishable) - lecture facilitateur via RLS, jamais d'insert de reponses.
export const supabaseBrowser = () =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
// Serveur (service_role/secret) - SECRET, contourne RLS. A n'utiliser QUE dans les routes API.
export const supabaseAdmin = () =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } });
