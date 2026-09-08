'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
// TODO(dev): importer la liste des questions depuis un instrument.json partagé
// (à copier depuis AllIAnce_webapp.html — objet ITEMS, moins A3/H1). Rendu = échelles 1–5
// + zones de texte pour les questions ouvertes. Le SCORING est fait côté serveur (submit).
export default function Assessment() {
  const { code } = useParams<{ code: string }>();
  const [participant, setParticipant] = useState('');
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [open, setOpen] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  async function submit() {
    const r = await fetch('/api/submit', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, participant, lang: 'fr', answers, open })
    });
    if (r.ok) setDone(true); else alert('Erreur : ' + (await r.json()).error);
  }
  if (done) return <main style={{ padding: 40 }}>Merci — vos réponses sont enregistrées.</main>;
  return (
    <main style={{ maxWidth: 720, margin: '4vh auto', padding: 20 }}>
      <h2>Diagnostic All(IA)nce</h2>
      <input placeholder="Prénom, initiales ou code perso" value={participant}
             onChange={e => setParticipant(e.target.value)} style={{ width: '100%', padding: 10 }} />
      {/* TODO(dev): boucle sur les questions -> échelles 1–5 (answers) et textareas (open) */}
      <button onClick={submit} disabled={!participant} style={{ marginTop: 20 }}>Envoyer</button>
    </main>
  );
}
