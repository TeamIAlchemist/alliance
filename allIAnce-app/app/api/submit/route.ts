import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { hashCode } from '../../../lib/code';
import { score } from '../../../lib/scoring';

// POST { code, participant, lang, answers, open } — scoring serveur puis insertion.
export async function POST(req: NextRequest) {
  const { code, participant, lang, answers, open } = await req.json();
  if (!code || !participant || !answers) return NextResponse.json({ error: 'missing' }, { status: 400 });

  const db = supabaseAdmin();
  // 1) résoudre l'équipe par le hash du code
  const { data: team } = await db.from('teams').select('id').eq('code_hash', hashCode(code)).single();
  if (!team) return NextResponse.json({ error: 'code inconnu' }, { status: 404 });

  // 2) vague ouverte (créée à la volée si besoin)
  let { data: wave } = await db.from('waves').select('id').eq('team_id', team.id).is('closed_at', null)
                               .order('opened_at', { ascending: false }).limit(1).single();
  if (!wave) {
    const ins = await db.from('waves').insert({ team_id: team.id }).select('id').single();
    wave = ins.data!;
  }

  // 3) scoring CÔTÉ SERVEUR + insertion
  const scores = score(answers);
  const { error } = await db.from('responses').insert({
    wave_id: wave.id, participant, lang: lang || 'fr',
    answers, open_answers: open || {}, scores
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
