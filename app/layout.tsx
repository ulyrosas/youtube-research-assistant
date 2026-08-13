export const metadata = { title: 'YouTube Research Assistant' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0, background: '#0b0e14', color: '#e6e9f0' }}>
        {children}
      </body>
    </html>
  );
}
