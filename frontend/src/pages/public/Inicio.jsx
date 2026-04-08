// pages/public/Inicio.jsx
// ─────────────────────────────────────────────
// Pantalla principal de la aplicacion.
// Muestra reloj, banner de servicios y accesos rapidos.
// ─────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { useSecureNavigate } from '../../hooks/useSecureNavigate';
import BannerServicios from '../../../components/BannerServicios';
import { T } from '../../utils/constantes';


// ── COMPONENTE PROXIMAMENTE ───────────────────
// Se mantiene aca porque solo lo usa la ruta /estaciones
// que esta definida como Proximamente en App.jsx
export function Proximamente({ titulo }) {
  const navigate = useSecureNavigate();
  const tituloSeguro = typeof titulo === 'string' ? titulo.slice(0, 80) : '';
  return (
    <div style={{ backgroundColor: T.bgPage, minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Source Sans 3', sans-serif" }}>
      <header style={{ background: T.bgWhite, boxShadow: `0 2px 8px rgba(0,0,0,0.08)`, position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '1rem 1.5rem', maxWidth: '680px', margin: '0 auto', width: '100%', gap: '1rem' }}>
          <button onClick={() => navigate('/')} style={{ background: T.bgWhite, border: `2px solid ${T.borde}`, color: T.textSub, padding: '0.6rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '600', whiteSpace: 'nowrap', minHeight: '44px' }}>Volver</button>
          <div style={{ fontSize: '1.2rem', fontWeight: '700', fontFamily: "'Lora', serif", color: T.textPri }}>{tituloSeguro}</div>
        </div>
        <div style={{ height: '3px', background: `linear-gradient(90deg, ${T.red}, #E74C3C)` }}/>
      </header>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center', gap: '1rem' }}>
        <div style={{ fontSize: '4rem' }} aria-hidden="true">🚧</div>
        <div style={{ fontSize: '1.5rem', fontWeight: '700', fontFamily: "'Lora', serif", color: T.textPri }}>Proximamente</div>
        <div style={{ fontSize: '1rem', color: T.textSub, maxWidth: '280px', lineHeight: 1.5 }}>Esta seccion esta en desarrollo.</div>
        <button onClick={() => navigate('/')} style={{ marginTop: '1rem', background: T.red, color: '#fff', border: 'none', borderRadius: '10px', padding: '0.85rem 2rem', fontSize: '1rem', fontWeight: '700', cursor: 'pointer' }}>Ir al inicio</button>
      </div>
    </div>
  );
}

// ── PANTALLA DE INICIO ────────────────────────
export default function Inicio() {
  const navigate = useSecureNavigate();
  const [hh,    setHh]    = useState('00');
  const [mm,    setMm]    = useState('00');
  const [colon, setColon] = useState(true);
  const [fecha, setFecha] = useState('');
  const [hover, setHover] = useState(null);

  useEffect(() => {
    const tick = () => {
      const n = new Date();
      setHh(String(n.getHours()).padStart(2, '0'));
      setMm(String(n.getMinutes()).padStart(2, '0'));
      setColon(c => !c);
      setFecha(n.toLocaleDateString('es-AR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const secciones = [
    {
      label: 'Tablero en Vivo', sub: 'Proximos trenes · Tiempo real',
      desc: 'Consulta cuando llega el proximo tren a tu estacion.',
      ruta: '/tablero', color: T.red, bgLight: T.redLight, borde: T.redBorde, stat: 'Activo', statC: T.verde,
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    },
    {
      label: 'Planificar Viaje', sub: 'Horarios por rango horario',
      desc: 'Busca todos los trenes disponibles en el horario que necesitas.',
      ruta: '/planificar', color: T.blue, bgLight: T.blueLight, borde: T.blueBorde, stat: 'Activo', statC: T.verde,
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    },
    {
      label: 'Avisos del Servicio', sub: 'Alertas y novedades activas',
      desc: 'Informate sobre cancelaciones, demoras y cambios en el recorrido.',
      ruta: '/avisos', color: T.orange, bgLight: T.orangeLight, borde: T.orangeBorde, stat: 'Ver avisos', statC: T.orange,
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    },
  ];

  return (
    <div style={s.root}>
      <header style={s.header} className="a1">
        <div style={s.headerInner}>
          <div style={s.logoWrap}>
            <div style={s.logoBox}>
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <rect x="2" y="10" width="28" height="15" rx="2.5" stroke={T.red} strokeWidth="2"/>
                <circle cx="8" cy="25" r="2.5" stroke={T.red} strokeWidth="2"/>
                <circle cx="24" cy="25" r="2.5" stroke={T.red} strokeWidth="2"/>
                <rect x="6" y="14" width="4" height="4" rx="1" fill={T.red} opacity="0.7"/>
                <rect x="14" y="14" width="4" height="4" rx="1" fill={T.red} opacity="0.7"/>
                <rect x="22" y="14" width="4" height="4" rx="1" fill={T.red} opacity="0.7"/>
                <path d="M3 12 L7 5 H25 L29 12" stroke={T.red} strokeWidth="2"/>
              </svg>
            </div>
            <div>
              <div style={s.logoNom}>Belgrano Norte</div>
              <div style={s.logoSub}>Trenes Argentinos · Buenos Aires</div>
            </div>
          </div>
          <div style={s.liveChip} role="status" aria-label="Datos en tiempo real">
            <span aria-hidden="true" style={s.liveDot}/>
            <span style={s.liveTxt}>EN VIVO</span>
          </div>
        </div>
        <div style={s.headerLine} role="presentation"/>
      </header>

      <div style={s.relojZona} className="a2" aria-label={`Hora actual: ${hh}:${mm}`}>
        <div style={s.relojFecha}>{fecha.charAt(0).toUpperCase() + fecha.slice(1)}</div>
        <div style={s.relojFila} aria-hidden="true">
          <span style={s.relojNum}>{hh}</span>
          <span style={{ ...s.relojColon, opacity: colon ? 1 : 0, transition: 'opacity 0.1s' }}>:</span>
          <span style={s.relojNum}>{mm}</span>
        </div>
      </div>

      <BannerServicios/>

      <main style={s.main}>
        <div style={s.mainTitulo} className="a3">Que queres hacer?</div>
        {secciones.map((sec, i) => {
          const on = hover === sec.ruta;
          return (
            <button
              key={sec.ruta}
              onClick={() => navigate(sec.ruta)}
              onMouseEnter={() => setHover(sec.ruta)}
              onMouseLeave={() => setHover(null)}
              className={`a${i + 3}`}
              aria-label={`${sec.label}: ${sec.desc}`}
              style={{ ...s.card, borderColor: on ? sec.color : T.borde, boxShadow: on ? `0 4px 20px ${sec.color}25` : `0 2px 8px ${T.sombra}`, transform: on ? 'translateY(-2px)' : 'translateY(0)' }}
            >
              <div style={{ ...s.cardFranja, background: sec.color }} aria-hidden="true"/>
              <div style={{ ...s.cardIconoWrap, background: sec.bgLight, color: sec.color }} aria-hidden="true">{sec.icon}</div>
              <div style={s.cardTextos}>
                <div style={{ ...s.cardLabel, color: T.textPri }}>{sec.label}</div>
                <div style={s.cardSub}>{sec.sub}</div>
                <div style={s.cardDesc}>{sec.desc}</div>
              </div>
              <div style={s.cardDerecha} aria-hidden="true">
                <div style={{ ...s.cardStat, color: sec.statC, background: `${sec.statC}15`, borderColor: `${sec.statC}44` }}>{sec.stat}</div>
                <div style={{ ...s.cardFlecha, color: sec.color }}>›</div>
              </div>
            </button>
          );
        })}
      </main>

      <footer style={s.footer} className="a6">
        <div style={s.footerLinea} role="presentation"/>
        <div style={s.footerTxt}>Belgrano Norte Online · 23 Estaciones · Buenos Aires</div>
        <div style={s.panelAccesoWrap}>
          <button
            onClick={() => navigate('/panel')}
            onMouseEnter={e => { e.currentTarget.style.background = T.slateLight; e.currentTarget.style.borderColor = T.slate; e.currentTarget.style.color = T.slate; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = T.slateBorde; e.currentTarget.style.color = T.textMuted; }}
            aria-label="Acceso al panel de operadores"
            style={s.panelBtn}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Panel de operadores
          </button>
        </div>
      </footer>
    </div>
  );
}

const s = {
  root:           { backgroundColor: T.bgPage, minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingBottom: '0' },
  header:         { background: T.bgWhite, boxShadow: `0 2px 8px ${T.sombra}`, position: 'sticky', top: 0, zIndex: 100 },
  headerInner:    { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', maxWidth: '680px', margin: '0 auto', width: '100%' },
  logoWrap:       { display: 'flex', alignItems: 'center', gap: '0.85rem', minWidth: 0 },
  logoBox:        { width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: T.redLight, border: `2px solid ${T.redBorde}`, borderRadius: '12px', flexShrink: 0 },
  logoNom:        { fontSize: '1.25rem', fontWeight: '700', color: T.textPri, fontFamily: "'Lora', serif", lineHeight: 1.1 },
  logoSub:        { fontSize: '0.72rem', color: T.textSub, marginTop: '2px' },
  liveChip:       { display: 'flex', alignItems: 'center', gap: '6px', background: '#FEF0F0', border: `1.5px solid ${T.redBorde}`, borderRadius: '20px', padding: '0.35rem 0.9rem', flexShrink: 0 },
  liveDot:        { width: '8px', height: '8px', borderRadius: '50%', backgroundColor: T.red, display: 'inline-block', flexShrink: 0, animation: 'pulse 1.6s infinite' },
  liveTxt:        { fontSize: '0.78rem', fontWeight: '700', color: T.red, letterSpacing: '0.05em' },
  headerLine:     { height: '3px', background: `linear-gradient(90deg, ${T.red}, #E74C3C)` },
  relojZona:      { textAlign: 'center', padding: '2rem 1.5rem 1rem', background: T.bgWhite, borderBottom: `1px solid ${T.borde}` },
  relojFecha:     { fontSize: '1rem', color: T.textSub, marginBottom: '0.4rem', fontFamily: "'Source Sans 3', sans-serif" },
  relojFila:      { display: 'flex', alignItems: 'center', justifyContent: 'center' },
  relojNum:       { fontSize: 'clamp(3.5rem, 16vw, 6rem)', fontWeight: '700', color: T.textPri, fontFamily: "'Lora', serif", letterSpacing: '-0.02em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' },
  relojColon:     { fontSize: 'clamp(2.8rem, 13vw, 5rem)', fontWeight: '300', color: T.textSub, margin: '0 0.3rem', lineHeight: 1 },
  main:           { flex: 1, display: 'flex', flexDirection: 'column', padding: '1.5rem', gap: '1rem', maxWidth: '680px', width: '100%', margin: '0 auto' },
  mainTitulo:     { fontSize: '1.1rem', fontWeight: '600', color: T.textSub, letterSpacing: '0.01em' },
  card:           { position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', gap: '1rem', background: T.bgCard, border: '2px solid', borderRadius: '16px', padding: '1.2rem 1.2rem 1.2rem 1rem', textAlign: 'left', transition: 'all 0.2s ease', minHeight: '96px', cursor: 'pointer', width: '100%', minWidth: 0 },
  cardFranja:     { position: 'absolute', left: 0, top: 0, bottom: 0, width: '5px' },
  cardIconoWrap:  { width: '52px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', flexShrink: 0 },
  cardTextos:     { flex: 1, minWidth: 0 },
  cardLabel:      { fontSize: '1.25rem', fontWeight: '700', fontFamily: "'Lora', serif", lineHeight: 1.2, marginBottom: '0.2rem' },
  cardSub:        { fontSize: '0.85rem', color: T.textSub, fontWeight: '500', marginBottom: '0.3rem' },
  cardDesc:       { fontSize: '0.82rem', color: T.textMuted, lineHeight: 1.4 },
  cardDerecha:    { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem', flexShrink: 0 },
  cardStat:       { fontSize: '0.72rem', fontWeight: '700', border: '1.5px solid', borderRadius: '20px', padding: '3px 10px', whiteSpace: 'nowrap' },
  cardFlecha:     { fontSize: '2rem', fontWeight: '300', lineHeight: 1 },
  footer:         { padding: '1.5rem', maxWidth: '680px', width: '100%', margin: '0 auto' },
  footerLinea:    { height: '1px', background: T.borde, marginBottom: '0.8rem' },
  footerTxt:      { textAlign: 'center', fontSize: '0.78rem', color: T.textMuted, marginBottom: '1rem' },
  panelAccesoWrap:{ display: 'flex', justifyContent: 'center' },
  panelBtn:       { display: 'inline-flex', alignItems: 'center', gap: '0.45rem', background: 'transparent', border: `1.5px solid ${T.slateBorde}`, borderRadius: '20px', padding: '0.45rem 1.1rem', fontSize: '0.8rem', fontWeight: '600', color: T.textMuted, cursor: 'pointer', transition: 'all 0.2s ease', fontFamily: "'Source Sans 3', sans-serif" },
};
