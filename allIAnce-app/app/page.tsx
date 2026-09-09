'use client';
import { useRouter } from 'next/navigation';

const GOLD = 'linear-gradient(90deg,#a6643c,#d9b451,#f2dc9b,#d9b451)';

export default function Home() {
  const router = useRouter();
  return (
    <main style={{ minHeight: '100vh', background: '#0d0d0d', color: '#ece7dd',
                   fontFamily: 'system-ui, sans-serif', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    maxWidth: 960, margin: '0 auto' }}>
        <span style={{ letterSpacing: '0.25em', fontSize: 14, fontWeight: 700, color: '#c9b98f' }}>
          TEAM IALCHEMIST
        </span>
        <span style={{ border: '1px solid rgba(217,180,81,0.4)', borderRadius: 999,
                       padding: '4px 12px', fontSize: 13, color: '#c9b98f' }}>EN</span>
      </div>

      <section style={{ maxWidth: 720, margin: '32px auto', background: '#141418',
                        border: '1px solid rgba(217,180,81,0.18)', borderRadius: 20,
                        padding: '40px 28px', textAlign: 'center' }}>
        {/* Marque - PLACEHOLDER. Pour ton vrai logo : depose-le en /public/logo.png puis
            remplace ce <div>...</div> par  <img src="/logo.png" alt="Team IAlchemist" width={180} height={180} /> */}
        <div style={{ width: 180, height: 180, margin: '0 auto', borderRadius: 12, background: '#000',
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      justifyContent: 'center', gap: 10 }}>
          <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#a6643c" /><stop offset="0.5" stopColor="#f2dc9b" />
                <stop offset="1" stopColor="#d9b451" />
              </linearGradient>
            </defs>
            <rect x="16" y="16" width="32" height="32" transform="rotate(45 32 32)"
                  fill="none" stroke="url(#g)" strokeWidth="2" />
            <rect x="27" y="27" width="10" height="10" transform="rotate(45 32 32)" fill="url(#g)" />
          </svg>
          <span style={{ letterSpacing: '0.22em', fontSize: 12, fontWeight: 700, color: '#c9b98f' }}>
            TEAM IALCHEMIST
          </span>
          <span style={{ letterSpacing: '0.14em', fontSize: 7, color: '#8a7d55' }}>
            TURN AI ADOPTION INTO GOLD
          </span>
        </div>

        <h1 style={{ fontSize: 64, fontWeight: 800, margin: '24px 0 0', backgroundImage: GOLD,
                     WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
          All(IA)nce
        </h1>
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
