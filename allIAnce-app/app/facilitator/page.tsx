'use client';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase';
// Espace facilitateur : authentifié (Supabase Auth). RLS garantit qu'on ne voit QUE ses clients.
// TODO(dev): 1) login Supabase  2) liste clients/équipes (+ suppression)  3) cartographie & rapport
//            4) génération PDF côté serveur (voir build_report.py comme spec visuelle)
export default function Facilitator() {
  const [clients, setClients] = useState<any[]>([]);
  useEffect(() => {
    const db = supabaseBrowser();
    db.from('clients').select('id,name').then(({ data }) => setClients(data || []));
  }, []);
  return (
    <main style={{ maxWidth: 900, margin: '4vh auto', padding: 20 }}>
      <h2>Clients actifs</h2>
      <ul>{clients.map(c => <li key={c.id}>{c.name}</li>)}</ul>
    </main>
  );
}
