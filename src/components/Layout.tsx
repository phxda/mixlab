import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(10, 10, 26, 0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div
          style={{
            fontSize: '24px',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #ff6b9d, #c084fc, #22d3ee)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px',
          }}
        >
          MixLab
        </div>
        <div style={{ display: 'flex', gap: '24px' }}>
          {['Search', 'Flavor Map', 'Surprise Me'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(' ', '-')}`}
              style={{
                color: 'rgba(240, 230, 255, 0.6)',
                fontSize: '14px',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#f0e6ff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(240, 230, 255, 0.6)')}
            >
              {item}
            </a>
          ))}
        </div>
      </nav>
      <main style={{ paddingTop: '0' }}>{children}</main>
    </div>
  );
}
