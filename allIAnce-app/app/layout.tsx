export const metadata = { title: 'All(IA)nce', description: 'ou comment faire alliance avec l\'IA' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, minHeight: '100vh', background: '#0d0d0d', color: '#ece7dd', fontFamily: 'system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
