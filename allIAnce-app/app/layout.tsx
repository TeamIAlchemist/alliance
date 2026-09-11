export const metadata = {
  title: 'All(IA)nce',
  description: 'ou comment faire alliance avec l\u2019IA',
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, background: '#111', color: '#ece7dd', fontFamily: 'system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
