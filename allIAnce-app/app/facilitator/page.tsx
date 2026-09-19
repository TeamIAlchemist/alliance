'use client';
import { useEffect, useMemo, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase';
import { polarity, bandA_, bandB_, bandC5_, bandAtr_ } from '@/lib/scoring';
import { POL_LABELS, COMP_LABELS, EXPL as EXPL_ } from '@/lib/analysis';
import { RC } from '@/lib/report-content';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ScatterChart, Scatter, XAxis, YAxis,
  ReferenceArea, ReferenceLine, ResponsiveContainer, Legend, Tooltip,
} from 'recharts';

const EXPL: any = EXPL_;
const GOLD = 'linear-gradient(90deg,#a6643c,#d9b451,#f2dc9b,#d9b451)';
// Palette RAPPORT (feuille claire, calee sur les PDF de reference)
const INK = '#1a1a1a', MUT = '#666', GH = '#8a6a12', GN = '#c69214', ACC = '#a6791f',
  LINE = '#eadfbf', TRACK = '#efe7d2', BOX = '#faf6ea', BOXB = '#ecdca0';
type Lang = 'fr' | 'en';
let _db: ReturnType<typeof supabaseBrowser> | null = null;
const getDb = () => (_db ??= supabaseBrowser());

type Client = { id: string; name: string };
type Team = { id: string; name: string };
type Resp = { participant: string; scores: any; open_answers: any };

const posFor = (A: number, B: number) => { const a = (A - 5) / 20, b = (B - 4) / 16; return Math.max(0, Math.min(1, 0.5 + (b - a) / 2)); };
const COMP_OPENS: [string, string][] = [['K4', 'crea'], ['K8', 'cur'], ['K12', 'col'], ['K16', 'cri'], ['K20', 'com']];
const STOP = new Set("le la les de des du un une et a en que qui pour par sur dans avec est sont se ce cette mon ma mes notre nos vous je il elle on au aux ou si me mais comme tout the a an of to and in on for with is are be it that this you we they my our your as at or not more less very so do does did has have had can could would about from than then into out".split(' '));

export default function Facilitator() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [lang, setLang] = useState<Lang>('fr');
  const [email, setEmail] = useState(''); const [pass, setPass] = useState(''); const [err, setErr] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [resps, setResps] = useState<Resp[]>([]);
  const [teamName, setTeamName] = useState(''); const [clientName, setClientName] = useState('');
  const [nc, setNc] = useState(''); const [nt, setNt] = useState(''); const [ncode, setNcode] = useState(''); const [msg, setMsg] = useState('');
  const [tree, setTree] = useState<any[]>([]); const [pendingDel, setPendingDel] = useState('');
  const [showReport, setShowReport] = useState(false);
  const R = RC[lang];

  useEffect(() => { getDb().auth.getSession().then(({ data }) => setAuthed(!!data.session)); }, []);
  useEffect(() => { if (authed) loadTree(); }, [authed]);

  async function login() { setErr(''); const { error } = await getDb().auth.signInWithPassword({ email, password: pass }); if (error) setErr(error.message); else setAuthed(true); }
  async function logout() { await getDb().auth.signOut(); setAuthed(false); setClients([]); setTeams([]); setResps([]); setTeamName(''); }
  async function createTeam() {
    setMsg('');
    const { data } = await getDb().auth.getSession();
    const r = await fetch('/api/facilitator/team', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientName: nc, teamName: nt, code: ncode, accessToken: data.session?.access_token }) });
    if (r.ok) { setMsg((lang === 'fr' ? 'Créé. Code à diffuser : ' : 'Created. Code to share: ') + ncode); setNc(''); setNt(''); setNcode('');
      loadTree(); }
    else setMsg('Erreur : ' + ((await r.json()).error || r.status));
  }
  async function loadTree() {
    const { data: cs } = await getDb().from('clients').select('id,name');
    const cl = cs || []; setClients(cl);
    const cids = cl.map((c: any) => c.id);
    if (!cids.length) { setTree([]); return; }
    const { data: ts } = await getDb().from('teams').select('id,name,client_id').in('client_id', cids);
    const tl = ts || []; const tids = tl.map((t: any) => t.id);
    const w2t: Record<string, string> = {}; const cnt: Record<string, number> = {}; const mem: Record<string, string[]> = {};
    if (tids.length) {
      const { data: ws } = await getDb().from('waves').select('id,team_id').in('team_id', tids);
      (ws || []).forEach((w: any) => { w2t[w.id] = w.team_id; });
      const wids = Object.keys(w2t);
      if (wids.length) {
        const { data: rs } = await getDb().from('responses').select('wave_id,participant').in('wave_id', wids);
        (rs || []).forEach((r: any) => { const t = w2t[r.wave_id]; if (!t) return; cnt[t] = (cnt[t] || 0) + 1; (mem[t] = mem[t] || []); if (!mem[t].includes(r.participant)) mem[t].push(r.participant); });
      }
    }
    setTree(cl.map((c: any) => ({ id: c.id, name: c.name,
      teams: tl.filter((t: any) => t.client_id === c.id).map((t: any) => ({ id: t.id, name: t.name, count: cnt[t.id] || 0, members: mem[t.id] || [] })) })));
  }
  async function deleteClient(id: string) {
    if (pendingDel !== 'c:' + id) { setPendingDel('c:' + id); return; }
    setPendingDel(''); await getDb().from('clients').delete().eq('id', id); setResps([]); setTeamName(''); loadTree();
  }
  async function deleteTeam(id: string) {
    if (pendingDel !== 't:' + id) { setPendingDel('t:' + id); return; }
    setPendingDel(''); await getDb().from('teams').delete().eq('id', id); setResps([]); setTeamName(''); loadTree();
  }
  async function openTeam(teamId: string, tName: string, cName: string) {
    setTeamName(tName); setClientName(cName); setShowReport(false);
    const { data: waves } = await getDb().from('waves').select('id').eq('team_id', teamId);
    const ids = (waves || []).map((w: any) => w.id); if (!ids.length) { setResps([]); return; }
    const { data } = await getDb().from('responses').select('participant,scores,open_answers').in('wave_id', ids); setResps(data || []);
  }

  const A = useMemo(() => {
    const n = resps.length; if (!n) return null;
    const mean = (f: (s: any) => number) => resps.reduce((a, r) => a + f(r.scores), 0) / n;
    const cm = (k: string, i: number) => resps.reduce((a, r) => a + (r.scores.comp?.[k]?.[i] || 0), 0) / n;
    const keys = ['crea', 'cur', 'col', 'cri', 'com'];
    const hsd = [mean(s => s.container), mean(s => s.difference), mean(s => s.exchange)];
    const kg = [mean(s => s.kSoc || 0), mean(s => s.kAut || 0), mean(s => s.kTra || 0)];
    return {
      n, mA: mean(s => s.A), mB: mean(s => s.B), mAtr: mean(s => s.atrophy), mCInd: mean(s => s.cInd), mCSig: mean(s => s.cSig), hsd, kg,
      radar: keys.map(k => ({ comp: (COMP_LABELS as any)[lang][k], cap: cm(k, 0), sig: cm(k, 2) })),
      scatter: resps.map(r => ({ x: r.scores.B, y: r.scores.A, name: r.participant })),
      weakHsd: hsd.indexOf(Math.min(...hsd)), domK: kg.indexOf(Math.max(...kg)),
    };
  }, [resps, lang]);

  const wrap: React.CSSProperties = { minHeight: '100vh', background: '#0d0d0d', color: '#ece7dd', fontFamily: 'system-ui, sans-serif', maxWidth: 960, margin: '0 auto', padding: 24 };
  if (authed === null) return <main style={wrap}>...</main>;
  if (!authed) return (
    <main style={{ ...wrap, maxWidth: 420 }}>
      <h2 style={{ backgroundImage: GOLD, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>{lang === 'fr' ? 'Espace facilitateur' : 'Facilitator space'}</h2>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: 12, marginTop: 12, borderRadius: 8, background: '#141418', color: '#ece7dd', border: '1px solid rgba(217,180,81,0.35)' }} />
      <input placeholder={lang === 'fr' ? 'Mot de passe' : 'Password'} type="password" value={pass} onChange={e => setPass(e.target.value)} style={{ width: '100%', padding: 12, marginTop: 10, borderRadius: 8, background: '#141418', color: '#ece7dd', border: '1px solid rgba(217,180,81,0.35)' }} />
      <button onClick={login} style={{ marginTop: 14, padding: '12px 22px', borderRadius: 10, border: 'none', fontWeight: 700, color: '#2a1e0a', backgroundImage: GOLD, cursor: 'pointer' }}>Entrer</button>
      {err && <p style={{ color: '#e08a6a', fontSize: 13 }}>{err}</p>}
    </main>
  );

  // --- Composants du RAPPORT (feuille claire) ---
  const H3 = ({ c }: { c: string }) => <h3 style={{ color: GH, fontSize: 14, letterSpacing: 1, textTransform: 'uppercase', borderBottom: '1px solid ' + LINE, paddingBottom: 6, marginTop: 26 }}>{c}</h3>;
  const P = ({ c }: { c: string }) => <p style={{ color: '#333', fontSize: 13.5, lineHeight: 1.6 }}>{c}</p>;
  const UL = ({ items }: { items: readonly string[] }) => <ul style={{ color: '#333', fontSize: 13, paddingLeft: 18 }}>{items.map((x, i) => <li key={i} style={{ margin: '5px 0' }}>{x}</li>)}</ul>;
  const Bar = ({ lab, val, max }: { lab: string; val: number; max: number }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '6px 0' }} className="brk">
      <div style={{ width: 160, fontSize: 12.5, color: '#444' }}>{lab}</div>
      <div style={{ flex: 1, height: 12, background: TRACK, borderRadius: 6, overflow: 'hidden' }}><div style={{ height: '100%', width: Math.max(0, Math.min(100, val / max * 100)) + '%', background: '#d9b451' }} /></div>
      <div style={{ width: 52, textAlign: 'right', fontSize: 12.5, color: '#333' }}>{val.toFixed(1)}/{max}</div>
    </div>
  );
  const Interp = ({ pill, e }: { pill: string; e: any }) => (
    <div style={{ background: BOX, border: '1px solid ' + BOXB, borderLeft: '3px solid #d9b451', borderRadius: 8, padding: '10px 12px', margin: '8px 0', fontSize: 13.5, color: '#333' }} className="brk">
      <span style={{ border: '1px solid ' + GN, color: GH, borderRadius: 20, fontSize: 10, padding: '1px 8px', textTransform: 'uppercase', marginRight: 6 }}>{pill}</span>
      <span>{e.t}</span>{e.c && <div style={{ color: '#7a6a3a', marginTop: 4, fontStyle: 'italic' }}>&#10148; {e.c}</div>}
    </div>
  );
  const kpi = (n: string, l: string) => <div style={{ flex: 1, minWidth: 130, background: '#fff', border: '1px solid ' + BOXB, borderRadius: 10, padding: 14, textAlign: 'center' }}><div style={{ fontSize: 20, fontWeight: 800, color: GN }}>{n}</div><div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>{l}</div></div>;
  const atrBand = A ? (bandAtr_(A.mAtr) as string) : 'sain';
  const atrLabel = { fr: { sain: 'Sain', vigil: 'Vigilance', prob: 'Atrophie probable' }, en: { sain: 'Healthy', vigil: 'Watch', prob: 'Likely atrophy' } }[lang][atrBand as 'sain'];
  const bA = A ? (bandA_(A.mA) as string) : 'low', bB = A ? (bandB_(A.mB) as string) : 'low', pol = A ? (polarity(A.mA, A.mB) as string) : 'watch';
  const bI = A ? (bandC5_(A.mCInd) as string) : 'low', bS = A ? (bandC5_(A.mCSig) as string) : 'low';
  const kStages = ['socialized', 'selfAuthoring', 'selfTransforming'];
  const bandPill = (b: string) => (({ fr: { low: 'Faible', mid: 'Moyen', high: 'Élevé' }, en: { low: 'Low', mid: 'Average', high: 'High' } } as any)[lang][b]);

  return (
    <main style={wrap}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="noprint">
        <h2 style={{ margin: 0 }}>Clients</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          <span onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')} style={{ cursor: 'pointer', border: '1px solid rgba(217,180,81,0.4)', borderRadius: 999, padding: '4px 12px', fontSize: 13, color: '#c9b98f' }}>{lang === 'fr' ? 'EN' : 'FR'}</span>
          {teamName && !showReport && <span onClick={() => setShowReport(true)} style={{ cursor: 'pointer', border: '1px solid rgba(217,180,81,0.4)', borderRadius: 999, padding: '4px 12px', fontSize: 13, color: '#c9b98f' }}>{lang === 'fr' ? 'Rapport complet' : 'Full report'}</span>}
          {teamName && showReport && <span onClick={() => setShowReport(false)} style={{ cursor: 'pointer', border: '1px solid rgba(217,180,81,0.4)', borderRadius: 999, padding: '4px 12px', fontSize: 13, color: '#c9b98f' }}>{lang === 'fr' ? '← Synthèse' : '← Summary'}</span>}
          {teamName && showReport && <span onClick={() => window.print()} style={{ cursor: 'pointer', border: '1px solid rgba(217,180,81,0.4)', borderRadius: 999, padding: '4px 12px', fontSize: 13, color: '#c9b98f' }}>{lang === 'fr' ? 'Imprimer / PDF' : 'Print / PDF'}</span>}
          <span onClick={logout} style={{ cursor: 'pointer', border: '1px solid rgba(217,180,81,0.25)', borderRadius: 999, padding: '4px 12px', fontSize: 13, color: '#9a948a' }}>{lang === 'fr' ? 'Se déconnecter' : 'Sign out'}</span>
        </div>
      </div>

      <div className="noprint" style={{ background: '#141418', border: '1px solid rgba(217,180,81,0.15)', borderRadius: 12, padding: 14, marginTop: 14 }}>
        <div style={{ fontSize: 12, color: '#9a948a', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>{lang === 'fr' ? 'Nouvelle équipe' : 'New team'}</div>
        <div style={{ fontSize: 12, color: '#6f6a60', marginBottom: 8 }}>{lang === 'fr' ? 'Remplis les trois champs : entreprise, équipe, puis le code que les participants saisiront.' : 'Fill all three: company, team, then the code participants will enter.'}</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input placeholder={lang === 'fr' ? 'Nom du client (entreprise)' : 'Client name (company)'} value={nc} onChange={e => setNc(e.target.value)} style={{ flex: 1, minWidth: 140, padding: 10, borderRadius: 8, background: '#0d0d0d', color: '#ece7dd', border: '1px solid rgba(217,180,81,0.25)' }} />
          <input placeholder={lang === 'fr' ? "Nom de l'équipe" : 'Team name'} value={nt} onChange={e => setNt(e.target.value)} style={{ flex: 1, minWidth: 140, padding: 10, borderRadius: 8, background: '#0d0d0d', color: '#ece7dd', border: '1px solid rgba(217,180,81,0.25)' }} />
          <input placeholder={lang === 'fr' ? 'Code à distribuer (ex. TIA-2026-MKTG)' : 'Code to share (e.g. TIA-2026-MKTG)'} value={ncode} onChange={e => setNcode(e.target.value)} style={{ flex: 1, minWidth: 140, padding: 10, borderRadius: 8, background: '#0d0d0d', color: '#ece7dd', border: '1px solid rgba(217,180,81,0.25)' }} />
          <button onClick={createTeam} disabled={!nt || !ncode || !nc} style={{ padding: '10px 18px', borderRadius: 8, border: 'none', fontWeight: 700, color: '#2a1e0a', backgroundImage: GOLD, cursor: 'pointer' }}>{lang === 'fr' ? 'Créer' : 'Create'}</button>
        </div>
        {msg && <div style={{ fontSize: 13, color: '#c9b98f', marginTop: 8 }}>{msg}</div>}
      </div>

      <div style={{ marginTop: 16 }} className="noprint">
        {!tree.length && <p style={{ color: '#9a948a' }}>{lang === 'fr' ? 'Aucun client. Crée une équipe ci-dessus.' : 'No client yet. Create a team above.'}</p>}
        {tree.map((c: any) => (
          <div key={c.id} style={{ background: '#141418', border: '1px solid rgba(217,180,81,0.18)', borderRadius: 12, padding: 14, marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
              <div style={{ fontWeight: 700, color: '#e7c86a', fontSize: 15 }}>{c.name}</div>
              <span onClick={() => deleteClient(c.id)} style={{ cursor: 'pointer', fontSize: 12, color: pendingDel === 'c:' + c.id ? '#e07a6a' : '#8a8378', border: '1px solid ' + (pendingDel === 'c:' + c.id ? '#c0392b' : 'rgba(217,180,81,0.25)'), borderRadius: 8, padding: '4px 10px' }}>
                {pendingDel === 'c:' + c.id ? (lang === 'fr' ? 'Confirmer la suppression ?' : 'Confirm delete?') : (lang === 'fr' ? 'Supprimer le client' : 'Delete client')}
              </span>
            </div>
            {!c.teams.length && <div style={{ color: '#6f6a60', fontSize: 13, marginTop: 8 }}>{lang === 'fr' ? 'Aucune équipe.' : 'No team.'}</div>}
            {c.teams.map((t: any) => (
              <div key={t.id} style={{ borderTop: '1px solid #26241d', padding: '10px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{ color: '#ece7dd' }}>{t.name}</span>
                  <span style={{ fontSize: 11, borderRadius: 20, padding: '1px 8px', border: '1px solid ' + (t.count ? '#3a7a4a' : 'rgba(217,180,81,0.25)'), color: t.count ? '#7fca8f' : '#9a948a' }}>
                    {t.count ? (lang === 'fr' ? `Actif \u00b7 ${t.count} r\u00e9ponse(s)` : `Active \u00b7 ${t.count} response(s)`) : (lang === 'fr' ? 'En attente' : 'Awaiting')}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => openTeam(t.id, t.name, c.name)} disabled={!t.count} style={{ padding: '6px 12px', borderRadius: 8, border: 'none', fontWeight: 700, fontSize: 13, color: '#2a1e0a', backgroundImage: GOLD, cursor: t.count ? 'pointer' : 'not-allowed', opacity: t.count ? 1 : 0.4 }}>{lang === 'fr' ? 'Voir le rapport' : 'View report'}</button>
                  <span onClick={() => deleteTeam(t.id)} style={{ cursor: 'pointer', fontSize: 12, color: pendingDel === 't:' + t.id ? '#e07a6a' : '#8a8378', border: '1px solid ' + (pendingDel === 't:' + t.id ? '#c0392b' : 'rgba(217,180,81,0.25)'), borderRadius: 8, padding: '5px 10px' }}>{pendingDel === 't:' + t.id ? (lang === 'fr' ? 'Confirmer ?' : 'Confirm?') : (lang === 'fr' ? 'Supprimer' : 'Delete')}</span>
                </div>
                </div>
                {t.members.length > 0 && <div style={{ fontSize: 12, color: '#9a948a', marginTop: 6 }}>{(lang === 'fr' ? 'Membres : ' : 'Members: ') + t.members.join(', ')}</div>}
              </div>
            ))}
          </div>
        ))}
      </div>
      {teamName && !A && <p style={{ color: '#9a948a', marginTop: 20 }}>{lang === 'fr' ? 'Aucune réponse pour cette équipe.' : 'No responses for this team.'}</p>}

      {A && !showReport && (
        <section style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <h2 style={{ margin: 0, backgroundImage: GOLD, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>{clientName} \u2014 {teamName}</h2>
            <button onClick={() => setShowReport(true)} style={{ padding: '8px 16px', borderRadius: 10, border: 'none', fontWeight: 700, color: '#2a1e0a', backgroundImage: GOLD, cursor: 'pointer' }}>{lang === 'fr' ? 'Voir le rapport complet' : 'View full report'}</button>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 14 }}>
            {[[String(A.n), R.kpi.resp], [A.mA.toFixed(0) + '/25', R.kpi.red], [A.mB.toFixed(0) + '/20', R.kpi.res], [(POL_LABELS as any)[lang][polarity(A.mA, A.mB)], R.kpi.pol]].map((x: any, i) => (
              <div key={i} style={{ flex: 1, minWidth: 130, background: '#101012', border: '1px solid #26241d', borderRadius: 10, padding: 14, textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#f2dc9b' }}>{x[0]}</div>
                <div style={{ fontSize: 11, color: '#9a948a', textTransform: 'uppercase', letterSpacing: 1 }}>{x[1]}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#9a948a', marginTop: 16 }}><span>{R.kpi.red}</span><span>{R.kpi.res}</span></div>
          <div style={{ position: 'relative', height: 16, borderRadius: 10, background: 'linear-gradient(90deg,#a6643c,#3a3a3e,#1f3d3d)', border: '1px solid #26241d' }}>
            <div style={{ position: 'absolute', top: -4, left: (posFor(A.mA, A.mB) * 100).toFixed(1) + '%', width: 4, height: 24, background: '#f2dc9b', borderRadius: 3, transform: 'translateX(-50%)' }} />
          </div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 18 }}>
            <div style={{ flex: 1, minWidth: 300 }}>
              <h3 style={{ color: '#d9b451', fontSize: 13, letterSpacing: 1, textTransform: 'uppercase' }}>{R.mapTitle}</h3>
              <div style={{ height: 300 }}><ResponsiveContainer><ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
                <ReferenceArea x1={4} x2={12} y1={18} y2={25} fill="#a6643c" fillOpacity={0.14} label={{ value: (POL_LABELS as any)[lang].over, position: 'insideTopLeft', fill: 'rgba(236,231,221,0.6)', fontSize: 11, fontWeight: 600 }} />
                <ReferenceArea x1={12} x2={20} y1={18} y2={25} fill="#a6643c" fillOpacity={0} label={{ value: (POL_LABELS as any)[lang].erratic, position: 'insideTopRight', fill: 'rgba(236,231,221,0.6)', fontSize: 11, fontWeight: 600 }} />
                <ReferenceArea x1={4} x2={12} y1={5} y2={18} fill="#1f3d3d" fillOpacity={0} label={{ value: (POL_LABELS as any)[lang].healthy, position: 'insideBottomLeft', fill: 'rgba(236,231,221,0.6)', fontSize: 11, fontWeight: 600 }} />
                <ReferenceArea x1={12} x2={20} y1={5} y2={18} fill="#1f3d3d" fillOpacity={0.18} label={{ value: (POL_LABELS as any)[lang].rigid, position: 'insideBottomRight', fill: 'rgba(236,231,221,0.6)', fontSize: 11, fontWeight: 600 }} />
                <ReferenceLine x={12} stroke="#ffffff22" /><ReferenceLine y={18} stroke="#ffffff22" />
                <XAxis type="number" dataKey="x" domain={[4, 20]} tick={{ fill: '#9a948a', fontSize: 11 }} />
                <YAxis type="number" dataKey="y" domain={[5, 25]} tick={{ fill: '#9a948a', fontSize: 11 }} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter data={A.scatter} fill="#f2dc9b" />
                <Scatter data={[{ x: A.mB, y: A.mA }]} fill="#a6643c" shape="star" />
              </ScatterChart></ResponsiveContainer></div>
            </div>
            <div style={{ flex: 1, minWidth: 300 }}>
              <h3 style={{ color: '#d9b451', fontSize: 13, letterSpacing: 1, textTransform: 'uppercase' }}>{R.compTitle}</h3>
              <div style={{ height: 300 }}><ResponsiveContainer><RadarChart data={A.radar} outerRadius={100}>
                <PolarGrid stroke="#333" /><PolarAngleAxis dataKey="comp" tick={{ fill: '#ece7dd', fontSize: 11 }} />
                <Radar name={R.compLegend.cap} dataKey="cap" stroke="#d9b451" fill="#d9b451" fillOpacity={0.20} />
                <Radar name={R.compLegend.sig} dataKey="sig" stroke="#a6643c" fill="#a6643c" fillOpacity={0.16} />
                <Legend wrapperStyle={{ color: '#ece7dd', fontSize: 11 }} />
              </RadarChart></ResponsiveContainer></div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginTop: 12 }}>
            <div style={{ flex: 1, minWidth: 280 }}>
              <h3 style={{ color: '#d9b451', fontSize: 13, letterSpacing: 1, textTransform: 'uppercase' }}>{R.hsdTitle}</h3>
              {[['Container', A.hsd[0], 15], ['Difference', A.hsd[1], 15], ['Exchange', A.hsd[2], 10]].map((x: any, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '6px 0' }}>
                  <div style={{ width: 100, fontSize: 12, color: '#9a948a' }}>{x[0]}</div>
                  <div style={{ flex: 1, height: 10, background: '#26241d', borderRadius: 6, overflow: 'hidden' }}><div style={{ height: '100%', width: (x[1] / x[2] * 100) + '%', background: '#d9b451' }} /></div>
                  <div style={{ width: 48, textAlign: 'right', fontSize: 12, color: '#ece7dd' }}>{x[1].toFixed(1)}/{x[2]}</div>
                </div>
              ))}
            </div>
            <div style={{ flex: 1, minWidth: 280 }}>
              <h3 style={{ color: '#d9b451', fontSize: 13, letterSpacing: 1, textTransform: 'uppercase' }}>{R.keganTitle}</h3>
              {[[R.keganNames[0], A.kg[0]], [R.keganNames[1], A.kg[1]], [R.keganNames[2], A.kg[2]]].map((x: any, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '6px 0' }}>
                  <div style={{ width: 150, fontSize: 12, color: '#9a948a' }}>{x[0]}</div>
                  <div style={{ flex: 1, height: 10, background: '#26241d', borderRadius: 6, overflow: 'hidden' }}><div style={{ height: '100%', width: (x[1] / 10 * 100) + '%', background: '#d9b451' }} /></div>
                  <div style={{ width: 48, textAlign: 'right', fontSize: 12, color: '#ece7dd' }}>{x[1].toFixed(1)}/10</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 14, color: '#b8b2a7', fontSize: 13 }}>{R.atrTitle} : <b style={{ color: '#f2dc9b' }}>{A.mAtr > 0 ? '+' : ''}{A.mAtr.toFixed(1)}</b> \u00b7 {atrLabel}</div>
          <div style={{ marginTop: 8, color: '#9a948a', fontSize: 13 }}>{(lang === 'fr' ? 'Membres : ' : 'Members: ') + resps.map(r => r.participant).filter((v, i, a) => a.indexOf(v) === i).join(', ')}</div>
        </section>
      )}

      {A && showReport && <section id="report" style={{ marginTop: 20, background: '#ffffff', color: INK, borderRadius: 12, padding: '30px 32px' }}>
        <div style={{ textAlign: 'center', borderBottom: '2px solid #d9b451', paddingBottom: 14 }} className="brk">
          <img src="/wordmark.jpg" alt="All(IA)nce" style={{ maxWidth: 230 }} />
          <div style={{ fontWeight: 700, marginTop: 8, color: INK }}>{R.reportTitle} · {clientName} — {teamName}</div>
          <div style={{ color: MUT, fontSize: 13, fontStyle: 'italic' }}>{R.subtitle} · {new Date().toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB')}</div>
        </div>
        <P c={R.intro} />

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 12 }} className="brk">
          {kpi(String(A.n), R.kpi.resp)}{kpi(A.mA.toFixed(0) + '/25', R.kpi.red)}{kpi(A.mB.toFixed(0) + '/20', R.kpi.res)}{kpi((POL_LABELS as any)[lang][polarity(A.mA, A.mB)], R.kpi.pol)}
        </div>
        <H3 c={R.howToReadTitle} />{R.howToRead.map((x, i) => <P key={i} c={x} />)}

        <H3 c={R.polTitle} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: MUT }}><span>{R.kpi.red}</span><span>{R.kpi.res}</span></div>
        <div style={{ position: 'relative', height: 16, borderRadius: 10, background: 'linear-gradient(90deg,#a6643c,#c9c3ba,#1f3d3d)', border: '1px solid ' + LINE }}>
          <div style={{ position: 'absolute', top: -4, left: (posFor(A.mA, A.mB) * 100).toFixed(1) + '%', width: 4, height: 24, background: '#8a6a12', borderRadius: 3, transform: 'translateX(-50%)' }} />
        </div>
        <P c={R.polText} />

        <H3 c={R.mapTitle} />
        <div style={{ height: 320 }} className="brk"><ResponsiveContainer><ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
          <ReferenceArea x1={4} x2={12} y1={18} y2={25} fill="#a6643c" fillOpacity={0.12} label={{ value: (POL_LABELS as any)[lang].over, position: 'insideTopLeft', fill: '#7a4a2a', fontSize: 11, fontWeight: 700 }} />
          <ReferenceArea x1={12} x2={20} y1={18} y2={25} fill="#a6643c" fillOpacity={0} label={{ value: (POL_LABELS as any)[lang].erratic, position: 'insideTopRight', fill: '#7a6a3a', fontSize: 11, fontWeight: 700 }} />
          <ReferenceArea x1={4} x2={12} y1={5} y2={18} fill="#a6643c" fillOpacity={0} label={{ value: (POL_LABELS as any)[lang].healthy, position: 'insideBottomLeft', fill: '#3a6a4a', fontSize: 11, fontWeight: 700 }} />
          <ReferenceArea x1={12} x2={20} y1={5} y2={18} fill="#1f3d3d" fillOpacity={0.12} label={{ value: (POL_LABELS as any)[lang].rigid, position: 'insideBottomRight', fill: '#2f5a52', fontSize: 11, fontWeight: 700 }} />
          <ReferenceLine x={12} stroke="#00000018" /><ReferenceLine y={18} stroke="#00000018" />
          <XAxis type="number" dataKey="x" domain={[4, 20]} tick={{ fill: MUT, fontSize: 11 }} />
          <YAxis type="number" dataKey="y" domain={[5, 25]} tick={{ fill: MUT, fontSize: 11 }} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name={R.kpi.pol} data={A.scatter} fill="#c69214" />
          <Scatter data={[{ x: A.mB, y: A.mA }]} fill="#a6643c" shape="star" />
        </ScatterChart></ResponsiveContainer></div>
        <P c={R.mapText} />
        <UL items={[R.postures.over, R.postures.rigid, R.postures.healthy, R.postures.erratic]} />

        <Interp pill={R.kpi.red + ' \u00b7 ' + bandPill(bA)} e={EXPL[lang].A[bA]} />
        <Interp pill={R.kpi.res + ' \u00b7 ' + bandPill(bB)} e={EXPL[lang].B[bB]} />
        <Interp pill={(POL_LABELS as any)[lang][pol]} e={{ t: EXPL[lang].POL[pol], c: '' }} />

        <H3 c={R.compTitle} />
        <div style={{ height: 320 }} className="brk"><ResponsiveContainer><RadarChart data={A.radar} outerRadius={110}>
          <PolarGrid stroke="#ccc" /><PolarAngleAxis dataKey="comp" tick={{ fill: '#333', fontSize: 11 }} />
          <Radar name={R.compLegend.cap} dataKey="cap" stroke="#d9b451" fill="#d9b451" fillOpacity={0.30} />
          <Radar name={R.compLegend.sig} dataKey="sig" stroke="#a6643c" fill="#a6643c" fillOpacity={0.20} />
          <Legend wrapperStyle={{ color: '#333', fontSize: 11 }} />
        </RadarChart></ResponsiveContainer></div>
        <P c={R.compText} /><P c={R.compP21} /><UL items={R.compRefs} />

        <Interp pill={R.compLegend.cap + ' \u00b7 ' + bandPill(bI)} e={EXPL[lang].C5IND[bI]} />
        <Interp pill={R.compLegend.sig + ' \u00b7 ' + bandPill(bS)} e={EXPL[lang].C5SIG[bS]} />

        <H3 c={R.hsdTitle} /><P c={R.hsdText} />
        <Bar lab="Container" val={A.hsd[0]} max={15} /><Bar lab="Difference" val={A.hsd[1]} max={15} /><Bar lab="Exchange" val={A.hsd[2]} max={10} />
        <UL items={R.hsdDefs} />
        <P c={(lang === 'fr' ? 'Maillon faible ici : ' : 'Weakest link here: ') + ['Container', 'Difference', 'Exchange'][A.weakHsd] + '.'} />

        <H3 c={R.atrTitle + ' : ' + (A.mAtr > 0 ? '+' : '') + A.mAtr.toFixed(1) + '  \u00b7  ' + atrLabel} />
        <P c={R.atrText} /><UL items={R.atrLevels} />
        <Interp pill={atrLabel} e={EXPL[lang].ATR[atrBand]} />

        <H3 c={R.keganTitle} /><P c={R.keganText} />
        <Bar lab={R.keganNames[0]} val={A.kg[0]} max={10} /><Bar lab={R.keganNames[1]} val={A.kg[1]} max={10} /><Bar lab={R.keganNames[2]} val={A.kg[2]} max={10} />
        <UL items={R.keganDefs} />
        <P c={(lang === 'fr' ? "Tendance de l'équipe : centre de gravité sur l'esprit " : 'Team tendency: centre of gravity on the ') + R.keganNames[A.domK] + (lang === 'fr' ? '.' : ' mind.')} />
        <Interp pill={R.keganNames[A.domK]} e={EXPL[lang].KEGAN[kStages[A.domK]]} />

        <H3 c={R.visionTitle} /><P c={R.visionText} />
        {(() => {
          const freq: Record<string, number> = {};
          resps.forEach(r => (r.open_answers?.J4 || '').toLowerCase().split(/[^0-9a-zà-ÿ]+/i).forEach((w: string) => { w = w.trim(); if (w.length >= 4 && !STOP.has(w)) freq[w] = (freq[w] || 0) + 1; }));
          const words = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 40);
          if (!words.length) return null; const mx = words[0][1], mn = words[words.length - 1][1];
          return <div style={{ background: BOX, border: '1px solid ' + BOXB, borderRadius: 10, padding: 12, lineHeight: 2, textAlign: 'center' }} className="brk">
            {words.map(([w, f]) => <span key={w} style={{ display: 'inline-block', margin: '3px 9px', color: ACC, fontWeight: 700, fontSize: 15 + (mx === mn ? 6 : (f - mn) / (mx - mn) * 30) }}>{w}</span>)}
          </div>;
        })()}

        <H3 c={R.whereTitle} /><P c={R.whereText} />
        <div>{resps.map((r, i) => <div key={i} style={{ borderTop: '1px solid #e7e7e7', padding: '8px 0' }} className="brk">
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <b style={{ color: INK }}>{r.participant}</b><span style={{ color: MUT, fontSize: 13 }}>{R.kpi.red} {r.scores.A}/25 · {R.kpi.res} {r.scores.B}/20</span>
            <span style={{ color: ACC, fontSize: 13 }}>{(POL_LABELS as any)[lang][r.scores.pol]}</span>
          </div>
          {r.open_answers?.J4 && <div style={{ color: '#555', fontSize: 13, fontStyle: 'italic' }}>« {r.open_answers.J4} »</div>}
        </div>)}</div>

        <H3 c={R.openTitle} /><P c={R.openText} />
        {COMP_OPENS.map(([code, k]) => {
          const ans = resps.filter(r => r.open_answers?.[code]); if (!ans.length) return null;
          return <div key={code} style={{ margin: '8px 0' }} className="brk">
            <div style={{ color: ACC, fontSize: 13, fontWeight: 700 }}>{(COMP_LABELS as any)[lang][k]}</div>
            {ans.map((r, i) => <div key={i} style={{ color: '#444', fontSize: 13 }}>« {r.open_answers[code]} » <span style={{ color: '#999' }}>— {r.participant}</span></div>)}
          </div>;
        })}

        <H3 c={R.firstStepTitle} /><P c={R.firstStepText} />
        {resps.filter(r => r.open_answers?.L6).map((r, i) => <div key={i} style={{ color: '#444', fontSize: 13 }}><b style={{ color: INK }}>{r.participant}</b> : {r.open_answers.L6}</div>)}

        <H3 c={R.framesTitle} /><P c={R.framesText} /><UL items={R.frames} />

        <div style={{ border: '1px solid ' + BOXB, background: '#fdfaf1', borderRadius: 12, padding: '4px 16px 16px', marginTop: 20 }} className="brk">
          <H3 c={R.conclTitle} /><P c={R.concl} />
        </div>
        <div style={{ textAlign: 'center', color: '#999', fontSize: 12, marginTop: 16 }}>All(IA)nce · Team IAlchemist · Turn AI adoption into gold</div>
      </section>}
      <style>{`@media print{.noprint{display:none!important}main{max-width:100%;background:#fff;padding:0}#report{border-radius:0}.brk{break-inside:avoid;page-break-inside:avoid}}`}</style>
    </main>
  );
}
