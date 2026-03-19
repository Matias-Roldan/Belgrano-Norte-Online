// components/NavBar.jsx
// ─────────────────────────────────────────────
// Barra de navegacion inferior sticky.
// Se oculta automaticamente en las rutas del panel admin.
// ─────────────────────────────────────────────
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSecureNavigate } from '../src/hooks/useSecureNavigate';
import { T, RUTAS_SIN_NAV } from '../src/utils/constantes';

const NAV_ITEMS = [
  {
    label: 'Inicio', ruta: '/',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    label: 'Quienes Somos', ruta: '/quienes-somos',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  {
    label: 'Recorrido', ruta: '/recorrido',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/>
        <path d="M6 17V7a2 2 0 0 1 2-2h8"/>
        <polyline points="15 3 18 6 15 9"/>
      </svg>
    ),
  },
  {
    label: 'Tarifa', ruta: '/tarifa',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
        <line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ),
  },
  {
    label: 'Estaciones', ruta: '/estaciones',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M3 9h18M9 21V9"/>
      </svg>
    ),
  },
  {
    label: 'Contacto', ruta: '/contacto',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
];

export default function NavBar() {
  const navigate = useSecureNavigate();
  const location = useLocation();
  const [hover, setHover] = useState(null);

  if (RUTAS_SIN_NAV.some(r => location.pathname.startsWith(r))) return null;

  return (
    <nav style={nav.bar} role="navigation" aria-label="Navegacion principal">
      <div style={nav.inner}>
        {NAV_ITEMS.map(item => {
          const activo   = location.pathname === item.ruta;
          const hovering = hover === item.ruta;
          return (
            <button
              key={item.ruta}
              onClick={() => navigate(item.ruta)}
              onMouseEnter={() => setHover(item.ruta)}
              onMouseLeave={() => setHover(null)}
              aria-current={activo ? 'page' : undefined}
              aria-label={item.label}
              style={{
                ...nav.btn,
                color:      activo ? T.red : hovering ? T.red : T.textMuted,
                background: activo ? T.redLight : hovering ? '#FEF8F8' : 'transparent',
                borderTop:  `2px solid ${activo ? T.red : 'transparent'}`,
              }}
            >
              <span style={{ ...nav.icon, opacity: activo ? 1 : hovering ? 0.85 : 0.55 }}>
                {item.icon}
              </span>
              <span style={{
                ...nav.label,
                fontWeight: activo ? '700' : '500',
                color: activo ? T.red : hovering ? T.red : T.textMuted,
              }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

const nav = {
  bar: {
    position: 'sticky', bottom: 0, zIndex: 200,
    background: T.bgWhite,
    borderTop: `1px solid ${T.borde}`,
    boxShadow: '0 -2px 12px rgba(0,0,0,0.07)',
  },
  inner: {
    display: 'flex', justifyContent: 'space-around', alignItems: 'stretch',
    maxWidth: '680px', margin: '0 auto',
  },
  btn: {
    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', gap: '3px',
    padding: '0.55rem 0.2rem 0.6rem',
    transition: 'all 0.15s ease',
    borderRadius: 0, minWidth: 0,
    borderTop: '2px solid transparent',
  },
  icon:  { display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'opacity 0.15s' },
  label: { fontSize: '0.62rem', letterSpacing: '0.01em', lineHeight: 1, transition: 'color 0.15s', whiteSpace: 'nowrap' },
};
