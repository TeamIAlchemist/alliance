'use client';
import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { ITEMS, SCORED_COUNT, SECTION_LABELS, SECTION_ORDER, Item } from '@/lib/instrument';
import { score, bandA_, polarity } from '@/lib/scoring';
import { EXPL as EXPL_, POL_LABELS } from '@/lib/analysis';
const EXPL: any = EXPL_;
const posFor = (A: number, B: number) => { const a = (A - 5) / 20, b = (B - 4) / 16; return Math.max(0, Math.min(1, 0.5 + (b - a) / 2)); };

const GOLD = 'linear-gradient(90deg,#a6643c,#d9b451,#f2dc9b,#d9b451)';
type Lang = 'fr' | 'en';
const STR = {
  fr: { title: 'Diagnostic All(IA)nce', id: 'Votre identifiant (prénom, initiales ou pseudo)',
        low: 'Pas du tout', high: 'Tout à fait', optional: '(facultatif)', required: '(obligatoire)',
        submit: 'Envoyer mes réponses', progress: 'répondues', done: 'Merci — vos réponses sont enregistrées.',
        need: 'Renseignez votre identifiant pour commencer.',
        thanks: 'Merci !', saved: 'Vos réponses sont enregistrées. Voici votre positionnement personnel :', red: 'Reddition', res: 'Résistance', finish: 'Terminer' },
  en: { title: 'All(IA)nce diagnostic', id: 'Your identifier (first name, initials or nickname)',
        low: 'Not at all', high: 'Fully', optional: '(optional)', required: '(required)',
        submit: 'Submit my answers', progress: 'answered', done: 'Thank you - your answers have been saved.',
        need: 'Enter your identifier to begin.',
        thanks: 'Thank you!', saved: 'Your answers are saved. Here is your personal positioning:', red: 'Surrender', res: 'Resistance', finish: 'Finish' },
};

export default function Assessment() {
  const { code } = useParams<{ code: string }>();
  const [lang, setLang] = useState<Lang>('fr');
  const [participant, setParticipant] = useState('');
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [open, setOpen] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [sc, setSc] = useState<any>(null);
  const t = STR[lang];

  const ordered = useMemo(() => {
    const bySec: Record<string, Item[]> = {};
    ITEMS.forEach(i => { (bySec[i.sec] = bySec[i.sec] || []).push(i); });
    return SECTION_ORDER.filter(s => bySec[s]).map(s => ({ sec: s, items: bySec[s] }));
  }, []);

  const answeredScored = Object.keys(answers).length;
  const opensDone = (open['J4'] || '').trim().length > 0 && (open['L6'] || '').trim().length > 0;
  const complete = answeredScored >= SCORED_COUNT && participant.trim().length > 0 && opensDone;

  async function submit() {
    setBusy(true);
    try {
      const r = await fetch('/api/submit', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, participant: participant.trim(), lang, answers, open }),
      });
      if (r.ok) { setSc(score(answers)); setDone(true); }
      else alert('Erreur : ' + ((await r.json()).error || r.status));
    } catch (e) { alert('Erreur réseau'); }
    setBusy(false);
  }

  if (done) return (
    <main style={{ minHeight: '100vh', background: '#0d0d0d', color: '#ece7dd',
                   fontFamily: 'system-ui, sans-serif', display: 'flex',
                   alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 560, width: '100%', textAlign: 'center' }}>
        <h2 style={{ backgroundImage: GOLD, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>{t.thanks}</h2>
        <p style={{ color: '#9a948a' }}>{t.saved}</p>
        {sc && <div style={{ background: '#141418', border: '1px solid rgba(217,180,81,0.18)', borderRadius: 12, padding: 20, marginTop: 12, textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#9a948a' }}><span>{t.red}</span><span>{t.res}</span></div>
          <div style={{ position: 'relative', height: 16, borderRadius: 10, background: 'linear-gradient(90deg,#a6643c,#3a3a3e,#1f3d3d)', border: '1px solid #26241d' }}>
            <div style={{ position: 'absolute', top: -4, left: (posFor(sc.A, sc.B) * 100).toFixed(1) + '%', width: 4, height: 24, background: '#f2dc9b', borderRadius: 3, transform: 'translateX(-50%)' }} />
          </div>
          <p style={{ color: '#b8b2a7', fontSize: 13.5, lineHeight: 1.6, marginTop: 12 }}>{EXPL[lang].A[bandA_(sc.A)].t} {EXPL[lang].POL[polarity(sc.A, sc.B)]}</p>
        </div>}
        <a href="/" style={{ display: 'inline-block', marginTop: 18, padding: '12px 24px', borderRadius: 10, fontWeight: 700, color: '#2a1e0a', backgroundImage: GOLD, textDecoration: 'none' }}>{t.finish}</a>
      </div>
    </main>
  );

  return (
    <main style={{ minHeight: '100vh', background: '#0d0d0d', color: '#ece7dd',
                   fontFamily: 'system-ui, sans-serif', maxWidth: 760, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>{t.title}</h2>
        <span onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
              style={{ cursor: 'pointer', border: '1px solid rgba(217,180,81,0.4)', borderRadius: 999,
                       padding: '4px 12px', fontSize: 13, color: '#c9b98f' }}>
          {lang === 'fr' ? 'EN' : 'FR'}
        </span>
      </div>

      {/* Progression */}
      <div style={{ position: 'sticky', top: 0, background: '#0d0d0d', padding: '10px 0', zIndex: 5 }}>
        <div style={{ height: 6, background: '#26241d', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: (answeredScored / SCORED_COUNT * 100) + '%', backgroundImage: GOLD }} />
        </div>
        <div style={{ fontSize: 13, color: '#9a948a', marginTop: 6 }}>
          {answeredScored} / {SCORED_COUNT} {t.progress}
        </div>
      </div>

      <label style={{ display: 'block', margin: '8px 0 6px', color: '#b8b2a7' }}>{t.id}</label>
      <input value={participant} onChange={e => setParticipant(e.target.value)}
             style={{ width: '100%', padding: 12, borderRadius: 8, background: '#141418', color: '#ece7dd',
                      border: '1px solid rgba(217,180,81,0.35)' }} />

      {ordered.map(({ sec, items }) => (
        <section key={sec}>
          <h3 style={{ color: '#e7c86a', marginTop: 28 }}>{SECTION_LABELS[sec][lang]}</h3>
          {items.map(it => (
            <div key={it.code} style={{ background: '#141418', border: '1px solid rgba(217,180,81,0.12)',
                                        borderRadius: 12, padding: 16, marginTop: 12 }}>
              <div style={{ marginBottom: 10 }}>
                {lang === 'fr' ? it.fr : it.en}{' '}
                {it.open && <span style={{ color: (it.code === 'J4' || it.code === 'L6') ? '#e7c86a' : '#8a8378', fontSize: 13 }}>{(it.code === 'J4' || it.code === 'L6') ? t.required : t.optional}</span>}
              </div>
              {it.open ? (
                <textarea value={open[it.code] || ''} onChange={e => setOpen({ ...open, [it.code]: e.target.value })}
                          rows={3} style={{ width: '100%', padding: 10, borderRadius: 8, background: '#0d0d0d',
                                            color: '#ece7dd', border: '1px solid rgba(217,180,81,0.2)' }} />
              ) : (
                <>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {[1, 2, 3, 4, 5].map(n => {
                      const sel = answers[it.code] === n;
                      return (
                        <div key={n} onClick={() => setAnswers({ ...answers, [it.code]: n })}
                             style={{ flex: 1, textAlign: 'center', padding: '10px 0', borderRadius: 8,
                                      cursor: 'pointer', fontWeight: 700,
                                      color: sel ? '#2a1e0a' : '#ece7dd',
                                                                            background: sel ? GOLD : '#0d0d0d',
                                      border: '1px solid rgba(217,180,81,0.25)' }}>{n}</div>
                      );
                    })}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8a8378',
                                fontSize: 12, marginTop: 6 }}>
                    <span>{t.low}</span><span>{t.high}</span>
                  </div>
                </>
              )}
            </div>
          ))}
        </section>
      ))}

      <button onClick={submit} disabled={!complete || busy}
              style={{ marginTop: 24, padding: '14px 24px', borderRadius: 10, border: 'none', width: '100%',
                       fontWeight: 700, color: '#2a1e0a', backgroundImage: GOLD,
                       cursor: complete && !busy ? 'pointer' : 'not-allowed',
                       opacity: complete && !busy ? 1 : 0.5 }}>
        {busy ? '...' : t.submit}
      </button>
      {!complete && <p style={{ color: '#8a8378', fontSize: 13, marginTop: 8 }}>{answeredScored < SCORED_COUNT ? (lang === 'fr' ? `Il reste ${SCORED_COUNT - answeredScored} question(s) à répondre.` : `${SCORED_COUNT - answeredScored} question(s) left.`) : !participant.trim() ? t.need : (lang === 'fr' ? 'Réponds aux deux dernières questions ouvertes (obligatoires).' : 'Answer the two final open questions (required).')}</p>}
    </main>
  );
}
