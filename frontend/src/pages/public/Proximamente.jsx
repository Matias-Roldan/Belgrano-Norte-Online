// pages/public/Proximamente.jsx
// ─────────────────────────────────────────────
// Pagina placeholder para secciones en desarrollo.
// ─────────────────────────────────────────────
import { useSecureNavigate } from '../../hooks/useSecureNavigate';
import { T } from '../../utils/constantes';
import { sanitizarTexto } from '../../utils/sanitizar';

export default function Proximamente({ titulo }) {
  const navigate     = useSecureNavigate();
  const tituloSeguro = sanitizarTexto(String(titulo || ''), 80);

  return (
    <div style={{ backgroundColor: T.bgPage, minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Source Sans 3', sans-serif" }}>
      <header style={{ background: T.bgWhite, boxShadow: `0 2px 8px rgba(0,0,0,0.08)`, position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '1rem 1.5rem', maxWidth: '680px', margin: '0 auto', width: '100%', gap: '1rem' }}>
          <button onClick={() => navigate('/')} style={{ background: T.bgWhite, border: `2px solid ${T.borde}`, color: T.textSub, padding: '0.6rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '600', whiteSpace: 'nowrap', minHeight: '44px' }}>
            Volver
          </button>
          <div style={{ fontSize: '1.2rem', fontWeight: '700', fontFamily: "'Lora', serif", color: T.textPri }}>{tituloSeguro}</div>
        </div>
        <div style={{ height: '3px', background: `linear-gradient(90deg, ${T.red}, #E74C3C)` }}/>
      </header>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center', gap: '1rem' }}>
        <div style={{ fontSize: '4rem' }} aria-hidden="true">🚧</div>
        <div style={{ fontSize: '1.5rem', fontWeight: '700', fontFamily: "'Lora', serif", color: T.textPri }}>Proximamente</div>
        <div style={{ fontSize: '1rem', color: T.textSub, maxWidth: '280px', lineHeight: 1.5 }}>Esta seccion esta en desarrollo.</div>
        <button onClick={() => navigate('/')} style={{ marginTop: '1rem', background: T.red, color: '#fff', border: 'none', borderRadius: '10px', padding: '0.85rem 2rem', fontSize: '1rem', fontWeight: '700', cursor: 'pointer' }}>
          Ir al inicio
        </button>
      </div>
    </div>
  );
}
