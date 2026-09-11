'use client';
import { useRouter } from 'next/navigation';

const GOLD = 'linear-gradient(90deg,#a6643c,#d9b451,#f2dc9b,#d9b451)';

export default function Home() {
  const router = useRouter();
  return (
    <main style={{ minHeight: '100vh', background: '#0d0d0d', color: '#ece7dd',
                   fontFamily: 'system-ui, sans-serif', padding: 24 }}>
      {/* Barre du haut */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    maxWidth: 960, margin: '0 auto' }}>
        <span style={{ letterSpacing: '0.25em', fontSize: 14, fontWeight: 700, color: '#c9b98f' }}>
          TEAM IALCHEMIST
        </span>
        {/* Selecteur de langue : visuel pour l'instant, a cabler avec la vraie traduction */}
        <span style={{ border: '1px solid rgba(217,180,81,0.4)', borderRadius: 999,
                       padding: '4px 12px', fontSize: 13, color: '#c9b98f' }}>EN</span>
      </div>

      {/* Carte centrale */}
      <section style={{ maxWidth: 720, margin: '32px auto', background: '#141418',
                        border: '1px solid rgba(217,180,81,0.18)', borderRadius: 20,
                        padding: '40px 28px', textAlign: 'center' }}>
        {/* Marque : ton vrai logo + wordmark, extraits de AllIAnce_webapp.html */}
        <img src="/logo.jpg" alt="Team IAlchemist" width={180} height={180}
             style={{ borderRadius: 12, display: 'block', margin: '0 auto' }} />
        <img src="/wordmark.jpg" alt="All(IA)nce"
             style={{ display: 'block', margin: '24px auto 0', maxWidth: 'min(420px,80%)' }} />
        <p style={{ color: '#9a948a', marginTop: 8 }}>ou comment faire alliance avec l&apos;IA</p>

        <p style={{ color: '#b8b2a7', maxWidth: 520, margin: '20px auto 0', lineHeight: 1.6 }}>
          Un miroir en quelques minutes : ou en etes-vous, individuellement et en equipe,
          dans votre relation a l&apos;IA &mdash; entre reddition et resistance ?
        </p>

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginTop: 28 }}>
          <button onClick={() => router.push('/start')}
                  style={{ padding: '14px 22px', borderRadius: 10, border: 'none', cursor: 'pointer',
                           fontWeight: 700, color: '#2a1e0a', backgroundImage: GOLD }}>
            Je reponds au diagnostic
          </button>
          <button onClick={() => router.push('/facilitator')}
                  style={{ padding: '14px 22px', borderRadius: 10, cursor: 'pointer', fontWeight: 700,
                           background: 'transparent', color: '#e7c86a',
                           border: '1px solid rgba(217,180,81,0.6)' }}>
            Espace facilitateur
          </button>
        </div>

        <p style={{ color: '#8a8378', marginTop: 22, fontSize: 14 }}>Turn AI adoption into gold</p>
      </section>

      <footer style={{ textAlign: 'center', color: '#6f6a60', fontSize: 13, marginTop: 8 }}>
        All(IA)nce &middot; Team IAlchemist &middot; Diagnostic de reddition cognitive &mdash; prototype web
      </footer>
    </main>
  );
}
