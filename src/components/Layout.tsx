import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

const NAV_LINKS = [
  { to: '/search', label: 'Search' },
  { to: '/explore', label: 'Explore' },
  { to: '/surprise', label: 'Surprise Me' },
];

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
        <NavLink
          to="/"
          style={{
            fontSize: '24px',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #ff6b9d, #c084fc, #22d3ee)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px',
            textDecoration: 'none',
          }}
        >
          MixLab
        </NavLink>

        <div style={{ display: 'flex', gap: '24px' }}>
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                color: isActive ? '#f0e6ff' : 'rgba(240,230,255,0.6)',
                fontSize: '14px',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'color 0.2s',
                borderBottom: isActive ? '1px solid rgba(192,132,252,0.5)' : '1px solid transparent',
                paddingBottom: '2px',
              })}
            >
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
      <main style={{ paddingTop: '0' }}>{children}</main>
    </div>
  );
}
