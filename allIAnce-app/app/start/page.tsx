'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const GOLD = 'linear-gradient(90deg,#a6643c,#d9b451,#f2dc9b,#d9b451)';

export default function Start() {
  const [code, setCode] = useState('');
  const router = useRouter();
  return (
    <main style={{ minHeight: '100vh', background: '#0d0d0d', color: '#ece7dd',
                   fontFamily: 'system-ui, sans-serif', display: 'flex', flexDirection: 'column',
                   alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <h1 style={{ fontSize: 56, fontWeight: 800, margin: 0, backgroundImage: GOLD,
                   WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
        All(IA)nce
      </h1>
      <p style={{ color: '#9a948a', marginTop: 8 }}>ou comment faire alliance avec l&apos;IA</p>
      <input value={code} onChange={e => setCode(e.target.value)} placeholder="TIA-XXXX-XXXX"
             style={{ marginTop: 28, width: 'min(600px,90vw)', padding: 16, borderRadius: 10,
                      background: '#141418', color: '#ece7dd', fontSize: 16, textAlign: 'center',
                      border: '1px solid rgba(217,180,81,0.35)' }} />
      <button onClick={() => code && router.push('/assessment/' + encodeURIComponent(code))}
              disabled={!code}
              style={{ marginTop: 16, padding: '12px 26px', borderRadius: 10, border: 'none',
                       cursor: code ? 'pointer' : 'not-allowed', fontWeight: 700, color: '#2a1e0a',
                       backgroundImage: GOLD, opacity: code ? 1 : 0.5 }}>
        Commencer
      </button>
    </main>
  );
}
