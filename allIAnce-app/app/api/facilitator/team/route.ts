import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { hashCode } from '@/lib/code';

// Cree un client (si clientName) et une equipe, AU NOM du facilitateur authentifie.
// On utilise son access token pour que la RLS assigne owner = auth.uid() correctement.
// Le code brut n'est jamais stocke : on stocke seulement son hash (avec CODE_HASH_SALT).
export async function POST(req: NextRequest) {
  const { clientId, clientName, teamName, code, accessToken } = await req.json();
  if (!teamName || !code || !accessToken) return NextResponse.json({ error: 'missing' }, { status: 400 });

  const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${accessToken}` } }, auth: { persistSession: false } }
  );

  let cid = clientId;
  if (!cid && clientName) {
    const { data, error } = await db.from('clients').insert({ name: clientName }).select('id').single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    cid = data.id;
  }
  if (!cid) return NextResponse.json({ error: 'client requis' }, { status: 400 });

  const { error } = await db.from('teams').insert({ client_id: cid, name: teamName, code_hash: hashCode(code) });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
