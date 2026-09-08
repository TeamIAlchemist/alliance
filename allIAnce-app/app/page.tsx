'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Accueil : le répondant saisit le code d'équipe (branding à porter depuis AllIAnce_webapp.html)
export default function Home() {
  const [code, setCode] = useState('');
  const router = useRouter();
  return (
    <main style={{ maxWidth: 520, margin: '10vh auto', textAlign: 'center', color: '#ece7dd' }}>
      <h1 style={{ background: 'linear-gradient(90deg,#a6643c,#f2dc9b,#d9b451)', WebkitBackgroundClip: 'text', color: 'transparent' }}>All(IA)nce</h1>
      <p style={{ color: '#9a948a' }}>ou comment faire alliance avec l'IA</p>
      <input value={code} onChange={e => setCode(e.target.value)} placeholder="TIA-XXXX-XXXX"
             style={{ width: '100%', padding: 12, marginTop: 20 }} />
      <button onClick={() => router.push('/assessment/' + encodeURIComponent(code))}
              style={{ marginTop: 12, padding: '12px 20px' }}>Commencer</button>
    </main>
  );
}
