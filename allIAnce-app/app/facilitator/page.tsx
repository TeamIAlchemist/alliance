'use client';
import { useEffect, useMemo, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase';
import { polarity, bandA_, bandB_, bandC5_, bandAtr_ } from '@/lib/scoring';
import { POL_LABELS, COMP_LABELS, EXPL as EXPL_ } from '@/lib/analysis';
const EXPL: any = EXPL_;
import { RC } from '@/lib/report-content';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ScatterChart, Scatter, XAxis, YAxis,
  ReferenceArea, ReferenceLine, ResponsiveContainer, Legend, Tooltip,
} from 'recharts';

const GOLD = 'linear-gradient(90deg,#a6643c,#d9b451,#f2dc9b,#d9b451)';
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
  const R = RC[lang];

  useEffect(() => { getDb().auth.getSession().then(({ data }) => setAuthed(!!data.session)); }, []);
  useEffect(() => { if (authed) getDb().from('clients').select('id,name').then(({ data }) => setClients(data || [])); }, [authed]);

  async function login() { setErr(''); const { error } = await getDb().auth.signInWithPassword({ email, password: pass }); if (error) setErr(error.message); else setAuthed(true); }
  async function logout() { await getDb().auth.signOut(); setAuthed(false); setClients([]); setTeams([]); setResps([]); setTeamName(''); }
  async function createTeam() {
    setMsg('');
    const { data } = await getDb().auth.getSession();
    const r = await fetch('/api/facilitator/team', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientName: nc, teamName: nt, code: ncode, accessToken: data.session?.access_token }) });
    if (r.ok) { setMsg((lang === 'fr' ? 'Cree. Code a diffuser : ' : 'Created. Code to share: ') + ncode); setNc(''); setNt(''); setNcode('');
      getDb().from('clients').select('id,name').then(({ data }) => setClients(data || [])); }
    else setMsg('Erreur : ' + ((await r.json()).error || r.status));
  }
  async function openClient(c: Client) { setClientName(c.name); const { data } = await getDb().from('teams').select('id,name').eq('client_id', c.id); setTeams(data || []); setResps([]); setTeamName(''); }
  async function openTeam(tm: Team) {
    setTeamName(tm.name);
    const { data: waves } = await getDb().from('waves').select('id').eq('team_id', tm.id);
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

  const H3 = ({ c }: { c: string }) => <h3 style={{ color: '#d9b451', fontSize: 14, letterSpacing: 1, textTransform: 'uppercase', borderBottom: '1px solid #26241d', paddingBottom: 6, marginTop: 26 }}>{c}</h3>;
  const P = ({ c }: { c: string }) => <p style={{ color: '#b8b2a7', fontSize: 13.5, lineHeight: 1.6 }}>{c}</p>;
  const Bar = ({ lab, val, max }: { lab: string; val: number; max: number }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '6px 0' }} className="brk">
      <div style={{ width: 150, fontSize: 12, color: '#9a948a' }}>{lab}</div>
      <div style={{ flex: 1, height: 8, background: '#26241d', borderRadius: 6, overflow: 'hidden' }}><div style={{ height: '100%', width: Math.max(0, Math.min(100, val / max * 100)) + '%', backgroundImage: GOLD }} /></div>
      <div style={{ width: 54, textAlign: 'right', fontSize: 12 }}>{val.toFixed(1)}/{max}</div>
    </div>
  );
  const Interp = ({ pill, e }: { pill: string; e: any }) => (
    <div style={{ background: '#101012', border: '1px solid #26241d', borderLeft: '3px solid #d9b451', borderRadius: 8, padding: '10px 12px', margin: '8px 0', fontSize: 13.5 }} className="brk">
      <span style={{ border: '1px solid #d9b451', color: '#d9b451', borderRadius: 20, fontSize: 10, padding: '1px 8px', textTransform: 'uppercase', marginRight: 6 }}>{pill}</span>
      <span>{e.t}</span>{e.c && <div style={{ color: '#9a948a', marginTop: 4, fontStyle: 'italic' }}>&#10148; {e.c}</div>}
    </div>
  );
  const kpi = (n: string, l: string) => <div style={{ flex: 1, minWidth: 130, background: '#101012', border: '1px solid #26241d', borderRadius: 10, padding: 14, textAlign: 'center' }}><div style={{ fontSize: 22, fontWeight: 800, color: '#f2dc9b' }}>{n}</div><div style={{ fontSize: 11, color: '#9a948a', textTransform: 'uppercase', letterSpacing: 1 }}>{l}</div></div>;
  const atrBand = A ? (bandAtr_(A.mAtr) as string) : 'sain';
  const atrLabel = { fr: { sain: 'Sain', vigil: 'Vigilance', prob: 'Atrophie probable' }, en: { sain: 'Healthy', vigil: 'Watch', prob: 'Likely atrophy' } }[lang][atrBand as 'sain'];
  const bA = A ? (bandA_(A.mA) as string) : 'low', bB = A ? (bandB_(A.mB) as string) : 'low', pol = A ? (polarity(A.mA, A.mB) as string) : 'watch';
  const bI = A ? (bandC5_(A.mCInd) as string) : 'low', bS = A ? (bandC5_(A.mCSig) as string) : 'low';
  const kStages = ['socialized', 'selfAuthoring', 'selfTransforming'];
  const bandPill = (b: string) => (({ fr: { low: 'Faible', mid: 'Moyen', high: 'Eleve' }, en: { low: 'Low', mid: 'Average', high: 'High' } } as any)[lang][b]);

  return (
    <main style={wrap}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="noprint">
        <h2 style={{ margin: 0 }}>{lang === 'fr' ? 'Clients' : 'Clients'}</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          <span onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')} style={{ cursor: 'pointer', border: '1px solid rgba(217,180,81,0.4)', borderRadius: 999, padding: '4px 12px', fontSize: 13, color: '#c9b98f' }}>{lang === 'fr' ? 'EN' : 'FR'}</span>
          {teamName && <span onClick={() => window.print()} style={{ cursor: 'pointer', border: '1px solid rgba(217,180,81,0.4)', borderRadius: 999, padding: '4px 12px', fontSize: 13, color: '#c9b98f' }}>{lang === 'fr' ? 'Imprimer / PDF' : 'Print / PDF'}</span>}
          <span onClick={logout} style={{ cursor: 'pointer', border: '1px solid rgba(217,180,81,0.25)', borderRadius: 999, padding: '4px 12px', fontSize: 13, color: '#9a948a' }}>{lang === 'fr' ? 'Se deconnecter' : 'Sign out'}</span>
        </div>
      </div>

      <div className="noprint" style={{ background: '#141418', border: '1px solid rgba(217,180,81,0.15)', borderRadius: 12, padding: 14, marginTop: 14 }}>
        <div style={{ fontSize: 12, color: '#9a948a', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>{lang === 'fr' ? 'Nouvelle equipe' : 'New team'}</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input placeholder={lang === 'fr' ? 'Nom du client' : 'Client name'} value={nc} onChange={e => setNc(e.target.value)} style={{ flex: 1, minWidth: 140, padding: 10, borderRadius: 8, background: '#0d0d0d', color: '#ece7dd', border: '1px solid rgba(217,180,81,0.25)' }} />
          <input placeholder={lang === 'fr' ? "Nom de l'equipe" : 'Team name'} value={nt} onChange={e => setNt(e.target.value)} style={{ flex: 1, minWidth: 140, padding: 10, borderRadius: 8, background: '#0d0d0d', color: '#ece7dd', border: '1px solid rgba(217,180,81,0.25)' }} />
          <input placeholder="TIA-XXXX-XXXX" value={ncode} onChange={e => setNcode(e.target.value)} style={{ flex: 1, minWidth: 140, padding: 10, borderRadius: 8, background: '#0d0d0d', color: '#ece7dd', border: '1px solid rgba(217,180,81,0.25)' }} />
          <button onClick={createTeam} disabled={!nt || !ncode || !nc} style={{ padding: '10px 18px', borderRadius: 8, border: 'none', fontWeight: 700, color: '#2a1e0a', backgroundImage: GOLD, cursor: 'pointer' }}>{lang === 'fr' ? 'Creer' : 'Create'}</button>
        </div>
        {msg && <div style={{ fontSize: 13, color: '#c9b98f', marginTop: 8 }}>{msg}</div>}
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }} className="noprint">
        {clients.map(c => <button key={c.id} onClick={() => openClient(c)} style={{ padding: '8px 14px', borderRadius: 8, background: '#141418', color: '#e7c86a', border: '1px solid rgba(217,180,81,0.4)', cursor: 'pointer' }}>{c.name}</button>)}
        {!clients.length && <p style={{ color: '#9a948a' }}>{lang === 'fr' ? 'Aucun client. Cree une equipe ci-dessus.' : 'No client yet. Create a team above.'}</p>}
      </div>
      {teams.length > 0 && <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }} className="noprint">
        {teams.map(tm => <button key={tm.id} onClick={() => openTeam(tm)} style={{ padding: '8px 14px', borderRadius: 8, background: '#141418', color: '#ece7dd', border: '1px solid rgba(217,180,81,0.25)', cursor: 'pointer' }}>{tm.name}</button>)}
      </div>}
      {teamName && !A && <p style={{ color: '#9a948a', marginTop: 20 }}>{lang === 'fr' ? 'Aucune reponse pour cette equipe.' : 'No responses for this team.'}</p>}

      {A && <section style={{ marginTop: 20 }}>
        {/* En-tete */}
        <div style={{ textAlign: 'center', borderBottom: '2px solid #d9b451', paddingBottom: 14 }} className="brk">
          <img src="/wordmark.jpg" alt="All(IA)nce" style={{ maxWidth: 240 }} />
          <div style={{ fontWeight: 700, marginTop: 8 }}>{R.reportTitle} · {clientName} — {teamName}</div>
          <div style={{ color: '#9a948a', fontSize: 13, fontStyle: 'italic' }}>{R.subtitle} · {new Date().toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB')}</div>
        </div>
        <P c={R.intro} />

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 12 }} className="brk">
          {kpi(String(A.n), R.kpi.resp)}{kpi(A.mA.toFixed(0) + '/25', R.kpi.red)}{kpi(A.mB.toFixed(0) + '/20', R.kpi.res)}{kpi((POL_LABELS as any)[lang][polarity(A.mA, A.mB)], R.kpi.pol)}
        </div>
        <H3 c={R.howToReadTitle} />{R.howToRead.map((x, i) => <P key={i} c={x} />)}

        {/* Polarite */}
        <H3 c={R.polTitle} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#9a948a' }}><span>{R.kpi.red}</span><span>{R.kpi.res}</span></div>
        <div style={{ position: 'relative', height: 16, borderRadius: 10, background: 'linear-gradient(90deg,#a6643c,#3a3a3e,#1f3d3d)', border: '1px solid #26241d' }}>
          <div style={{ position: 'absolute', top: -4, left: (posFor(A.mA, A.mB) * 100).toFixed(1) + '%', width: 4, height: 24, background: '#f2dc9b', borderRadius: 3, transform: 'translateX(-50%)' }} />
        </div>
        <P c={R.polText} />

        {/* Carte */}
        <H3 c={R.mapTitle} />
        <div style={{ height: 320 }} className="brk"><ResponsiveContainer><ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
          <ReferenceArea x1={4} x2={12} y1={18} y2={25} fill="#a6643c" fillOpacity={0.10} />
          <ReferenceArea x1={12} x2={20} y1={5} y2={18} fill="#1f3d3d" fillOpacity={0.16} />
          <ReferenceLine x={12} stroke="#ffffff22" /><ReferenceLine y={18} stroke="#ffffff22" />
          <XAxis type="number" dataKey="x" domain={[4, 20]} tick={{ fill: '#9a948a', fontSize: 11 }} />
          <YAxis type="number" dataKey="y" domain={[5, 25]} tick={{ fill: '#9a948a', fontSize: 11 }} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name={R.kpi.pol} data={A.scatter} fill="#f2dc9b" />
          <Scatter data={[{ x: A.mB, y: A.mA }]} fill="#a6643c" shape="star" />
        </ScatterChart></ResponsiveContainer></div>
        <P c={R.mapText} />
        <ul style={{ color: '#b8b2a7', fontSize: 13 }}>{[R.postures.over, R.postures.rigid, R.postures.healthy, R.postures.erratic].map((x, i) => <li key={i} style={{ margin: '4px 0' }}>{x}</li>)}</ul>

        <Interp pill={R.kpi.red + ' \u00b7 ' + bandPill(bA)} e={EXPL[lang].A[bA]} />
        <Interp pill={R.kpi.res + ' \u00b7 ' + bandPill(bB)} e={EXPL[lang].B[bB]} />
        <Interp pill={(POL_LABELS as any)[lang][pol]} e={{ t: EXPL[lang].POL[pol], c: '' }} />

        {/* 5 C */}
        <H3 c={R.compTitle} />
        <div style={{ height: 320 }} className="brk"><ResponsiveContainer><RadarChart data={A.radar} outerRadius={110}>
          <PolarGrid stroke="#333" /><PolarAngleAxis dataKey="comp" tick={{ fill: '#ece7dd', fontSize: 11 }} />
          <Radar name={R.compLegend.cap} dataKey="cap" stroke="#d9b451" fill="#d9b451" fillOpacity={0.18} />
          <Radar name={R.compLegend.sig} dataKey="sig" stroke="#a6643c" fill="#a6643c" fillOpacity={0.15} />
          <Legend wrapperStyle={{ color: '#ece7dd', fontSize: 11 }} />
        </RadarChart></ResponsiveContainer></div>
        <P c={R.compText} /><P c={R.compP21} />
        <ul style={{ color: '#b8b2a7', fontSize: 13 }}>{R.compRefs.map((x, i) => <li key={i} style={{ margin: '4px 0' }}>{x}</li>)}</ul>

        <Interp pill={R.compLegend.cap + ' \u00b7 ' + bandPill(bI)} e={EXPL[lang].C5IND[bI]} />
        <Interp pill={R.compLegend.sig + ' \u00b7 ' + bandPill(bS)} e={EXPL[lang].C5SIG[bS]} />

        {/* HSD */}
        <H3 c={R.hsdTitle} /><P c={R.hsdText} />
        <Bar lab="Container" val={A.hsd[0]} max={15} /><Bar lab="Difference" val={A.hsd[1]} max={15} /><Bar lab="Exchange" val={A.hsd[2]} max={10} />
        <ul style={{ color: '#b8b2a7', fontSize: 13 }}>{R.hsdDefs.map((x, i) => <li key={i} style={{ margin: '4px 0' }}>{x}</li>)}</ul>

        <P c={(lang === 'fr' ? 'Maillon faible ici : ' : 'Weakest link here: ') + ['Container', 'Difference', 'Exchange'][A.weakHsd] + '.'} />

        {/* Atrophie */}
        <H3 c={R.atrTitle + ' : ' + (A.mAtr > 0 ? '+' : '') + A.mAtr.toFixed(1) + '  ·  ' + atrLabel} />
        <P c={R.atrText} />
        <ul style={{ color: '#b8b2a7', fontSize: 13 }}>{R.atrLevels.map((x, i) => <li key={i} style={{ margin: '4px 0' }}>{x}</li>)}</ul>

        <Interp pill={atrLabel} e={EXPL[lang].ATR[atrBand]} />

        {/* Kegan */}
        <H3 c={R.keganTitle} /><P c={R.keganText} />
        <Bar lab={R.keganNames[0]} val={A.kg[0]} max={10} /><Bar lab={R.keganNames[1]} val={A.kg[1]} max={10} /><Bar lab={R.keganNames[2]} val={A.kg[2]} max={10} />
        <ul style={{ color: '#b8b2a7', fontSize: 13 }}>{R.keganDefs.map((x, i) => <li key={i} style={{ margin: '4px 0' }}>{x}</li>)}</ul>
        <P c={(lang === 'fr' ? "Tendance de l'equipe : centre de gravite sur l'esprit " : "Team tendency: centre of gravity on the ") + R.keganNames[A.domK] + (lang === 'fr' ? ". Indicateur, non un verdict : on grandit par elargissement." : " mind. An indicator, not a verdict: we grow by broadening.")} />

        <Interp pill={R.keganNames[A.domK]} e={EXPL[lang].KEGAN[kStages[A.domK]]} />

        {/* Vision / nuage */}
        <H3 c={R.visionTitle} /><P c={R.visionText} />
        {(() => {
          const freq: Record<string, number> = {};
          resps.forEach(r => (r.open_answers?.J4 || '').toLowerCase().split(/[^0-9a-zà-ÿ]+/i).forEach((w: string) => { w = w.trim(); if (w.length >= 4 && !STOP.has(w)) freq[w] = (freq[w] || 0) + 1; }));
          const words = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 40);
          if (!words.length) return null; const mx = words[0][1], mn = words[words.length - 1][1];
          return <div style={{ background: '#101012', border: '1px solid #26241d', borderRadius: 10, padding: 12, lineHeight: 2, textAlign: 'center' }} className="brk">
            {words.map(([w, f]) => <span key={w} style={{ display: 'inline-block', margin: '3px 9px', color: '#f2dc9b', fontWeight: 700, fontSize: 15 + (mx === mn ? 6 : (f - mn) / (mx - mn) * 30) }}>{w}</span>)}
          </div>;
        })()}

        {/* Ou se situe chacun */}
        <H3 c={R.whereTitle} /><P c={R.whereText} />
        <div>{resps.map((r, i) => <div key={i} style={{ borderTop: '1px solid #26241d', padding: '8px 0' }} className="brk">
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <b>{r.participant}</b><span style={{ color: '#9a948a', fontSize: 13 }}>{R.kpi.red} {r.scores.A}/25 · {R.kpi.res} {r.scores.B}/20</span>
            <span style={{ color: '#e7c86a', fontSize: 13 }}>{(POL_LABELS as any)[lang][r.scores.pol]}</span>
          </div>
          {r.open_answers?.J4 && <div style={{ color: '#b8b2a7', fontSize: 13, fontStyle: 'italic' }}>« {r.open_answers.J4} »</div>}
        </div>)}</div>

        {/* Reponses ouvertes par competence */}
        <H3 c={R.openTitle} /><P c={R.openText} />
        {COMP_OPENS.map(([code, k]) => {
          const ans = resps.filter(r => r.open_answers?.[code]);
          if (!ans.length) return null;
          return <div key={code} style={{ margin: '8px 0' }} className="brk">
            <div style={{ color: '#e7c86a', fontSize: 13, fontWeight: 700 }}>{(COMP_LABELS as any)[lang][k]}</div>
            {ans.map((r, i) => <div key={i} style={{ color: '#b8b2a7', fontSize: 13 }}>« {r.open_answers[code]} » <span style={{ color: '#6f6a60' }}>— {r.participant}</span></div>)}
          </div>;
        })}

        {/* Premier pas */}
        <H3 c={R.firstStepTitle} /><P c={R.firstStepText} />
        {resps.filter(r => r.open_answers?.L6).map((r, i) => <div key={i} style={{ color: '#b8b2a7', fontSize: 13 }}><b>{r.participant}</b> : {r.open_answers.L6}</div>)}

        {/* Cadres */}
        <H3 c={R.framesTitle} /><P c={R.framesText} />
        <ul style={{ color: '#b8b2a7', fontSize: 13 }}>{R.frames.map((x, i) => <li key={i} style={{ margin: '6px 0' }}>{x}</li>)}</ul>

        {/* Conclusion */}
        <div style={{ border: '1px solid rgba(217,180,81,0.4)', borderRadius: 12, padding: 16, marginTop: 20 }} className="brk">
          <H3 c={R.conclTitle} /><P c={R.concl} />
        </div>
        <div style={{ textAlign: 'center', color: '#6f6a60', fontSize: 12, marginTop: 16 }}>All(IA)nce · Team IAlchemist · Turn AI adoption into gold</div>
      </section>}
      <style>{`@media print{.noprint{display:none!important}main{max-width:100%;background:#fff}.brk{break-inside:avoid;page-break-inside:avoid}}`}</style>
    </main>
  );
}
