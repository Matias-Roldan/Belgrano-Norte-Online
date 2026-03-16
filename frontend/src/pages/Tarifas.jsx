// frontend/src/pages/Tarifas.jsx
// ─────────────────────────────────────────────
// BELGRANO NORTE — Tarifas
// ─────────────────────────────────────────────
import { useNavigate } from 'react-router-dom';

// ── PALETA ────────────────────────────────────
const T = {
  bgPage:    '#F5F5F0',
  bgWhite:   '#FFFFFF',
  red:       '#C0392B',
  redLight:  '#FDECEA',
  redBorde:  '#E8A09A',
  blue:      '#1A6FAA',
  blueLight: '#EAF3FB',
  textPri:   '#1A1A1A',
  textSub:   '#555555',
  textMuted: '#999999',
  borde:     '#E0E0E0',
  sombra:    'rgba(0,0,0,0.07)',
  verde:     '#27AE60',
  verdeLight:'#EDFAF3',
  verdeBorde:'#A9DFBF',
};

const SECCIONES = [
  { seccion: '1° Sección', precio: '$280', color: T.verde,   bg: T.verdeLight, borde: T.verdeBorde },
  { seccion: '2° Sección', precio: '$360', color: T.blue,    bg: T.blueLight,  borde: '#9AC4E2'    },
  { seccion: '3° Sección', precio: '$450', color: '#7D3C98', bg: '#F5EEF8',    borde: '#C39BD3'    },
];

const GRATUITOS = [
  { ico: '👶', texto: 'Menores de 3 (tres) años' },
  { ico: '👴', texto: 'Jubilados y pensionados' },
  { ico: '🎒', texto: 'Estudiantes primarios de escuelas públicas' },
  { ico: '♿', texto: 'Personas con discapacidad' },
];

export default function Tarifas() {
  const navigate = useNavigate();

  return (
    <div style={s.root}>

      {/* ── HEADER ── */}
      <header style={s.header}>
        <div style={s.headerInner}>
          <button onClick={() => navigate('/')} style={s.btnVolver}>← Volver</button>
          <div style={s.headerCentro}>
            <div style={s.headerTitulo}>Tarifas</div>
            <div style={s.headerSub}>Línea Belgrano Norte</div>
          </div>
          <div style={{ minWidth: '80px' }} />
        </div>
        <div style={s.headerLine} />
      </header>

      <main style={s.main}>

        {/* ── INTRO ── */}
        <div style={s.panel}>
          <div style={s.panelTitulo}>Precios y tarifas</div>
          <p style={s.panelTxt}>
            Tarifas actualizadas de boletos y abonos en el Tren Belgrano Norte.
            Precios para viajar según las estaciones.
          </p>
          {/* Aviso SUBE */}
          <div style={s.avisoSube}>
            <span style={s.avisoSubeIco}>💳</span>
            <span style={s.avisoSubeTxt}>
              <strong>Pagando con tarjeta SUBE el viaje es más barato.</strong>{' '}
              Sin SUBE el boleto tiene un costo de <strong>$900</strong> independientemente de la sección.
            </span>
          </div>
        </div>

        {/* ── BOLETO SIN SUBE ── */}
        <div style={{ ...s.card, borderLeft: `4px solid ${T.red}` }}>
          <div style={{ ...s.cardIcoWrap, background: T.redLight }}>
            <span style={s.cardIco}>🎫</span>
          </div>
          <div style={s.cardBody}>
            <div style={{ ...s.cardTitulo, color: T.red }}>Sin SUBE</div>
            <div style={s.cardDesc}>Boleto ida · Todas las secciones</div>
          </div>
          <div style={{ ...s.precioBadge, color: T.red, background: T.redLight, borderColor: T.redBorde }}>
            $900
          </div>
        </div>

        {/* ── SECCIONES CON SUBE ── */}
        <div style={s.seccionesPanel}>
          <div style={s.seccionesTitulo}>Boleto ida con SUBE</div>
          <div style={s.seccionesGrid}>
            {SECCIONES.map((sec, i) => (
              <div key={i} style={{
                ...s.seccionCard,
                borderTop: `4px solid ${sec.color}`,
              }}>
                <div style={{ ...s.seccionNombre, color: sec.color }}>{sec.seccion}</div>
                <div style={{ ...s.seccionPrecio, color: sec.color }}>{sec.precio}</div>
                <div style={s.seccionLbl}>por viaje</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── VIAJE GRATUITO ── */}
        <div style={s.gratisPanel}>
          <div style={s.gratisTituloWrap}>
            <span style={s.gratisIcoTit}>🎟️</span>
            <div style={{ ...s.gratisTitulo }}>Viajá gratis en el Belgrano Norte</div>
          </div>
          <div style={s.gratisSub}>
            Los siguientes pasajeros <strong>no pagan boleto:</strong>
          </div>
          {GRATUITOS.map((item, i) => (
            <div key={i} style={s.gratisItem}>
              <div style={s.gratisIcoWrap}>
                <span style={s.gratisIco}>{item.ico}</span>
              </div>
              <div style={s.grafisTxt}>{item.texto}</div>
              <div style={s.gratisBadge}>Gratis</div>
            </div>
          ))}
        </div>

        {/* ── AVISO ── */}
        <div style={s.aviso}>
          <span style={s.avisoIco}>ℹ️</span>
          <span style={s.avisoTxt}>
            Los precios pueden variar. Para información oficial consultá los canales
            de Ferrovías o la página de Trenes Argentinos.
          </span>
        </div>

      </main>
    </div>
  );
}

// ── ESTILOS ───────────────────────────────────
const s = {
  root: {
    backgroundColor: T.bgPage,
    minHeight: '100vh',
    fontFamily: "'Source Sans 3', 'Segoe UI', sans-serif",
    color: T.textPri,
  },
  header: {
    background: T.bgWhite,
    boxShadow: `0 2px 8px ${T.sombra}`,
    position: 'sticky', top: 0, zIndex: 100,
  },
  headerInner: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', padding: '1rem 1.5rem',
    maxWidth: '820px', margin: '0 auto', width: '100%',
  },
  btnVolver: {
    background: T.bgWhite, border: `2px solid ${T.borde}`,
    color: T.textSub, padding: '0.6rem 1rem',
    borderRadius: '8px', cursor: 'pointer',
    fontSize: '0.95rem', fontWeight: '600',
    whiteSpace: 'nowrap', minHeight: '44px',
  },
  headerCentro: { textAlign: 'center' },
  headerTitulo: {
    fontSize: '1.3rem', fontWeight: '700', color: T.textPri,
    fontFamily: "'Lora', serif", lineHeight: 1.1,
  },
  headerSub:  { fontSize: '0.75rem', color: T.textSub, marginTop: '2px' },
  headerLine: { height: '3px', background: `linear-gradient(90deg, ${T.red}, #E74C3C)` },

  main: { maxWidth: '820px', margin: '0 auto', padding: '1.5rem' },

  // Panel intro
  panel: {
    background: T.bgWhite, border: `1.5px solid ${T.borde}`,
    borderRadius: '16px', padding: '1.4rem',
    marginBottom: '1rem', boxShadow: `0 2px 8px ${T.sombra}`,
  },
  panelTitulo: {
    fontSize: '1.1rem', fontWeight: '600', color: T.textPri,
    fontFamily: "'Lora', serif", marginBottom: '0.5rem',
  },
  panelTxt: {
    fontSize: '0.95rem', color: T.textSub,
    lineHeight: 1.6, margin: '0 0 1rem',
  },
  avisoSube: {
    display: 'flex', alignItems: 'flex-start', gap: '0.7rem',
    background: T.verdeLight, border: `1.5px solid ${T.verdeBorde}`,
    borderRadius: '10px', padding: '0.9rem 1rem',
  },
  avisoSubeIco: { fontSize: '1.1rem', marginTop: '1px' },
  avisoSubeTxt: { fontSize: '0.88rem', color: '#1E5631', lineHeight: 1.5 },

  // Card sin SUBE
  card: {
    display: 'flex', alignItems: 'center', gap: '1rem',
    background: T.bgWhite, border: `1.5px solid ${T.borde}`,
    borderRadius: '12px', padding: '1rem 1.2rem',
    marginBottom: '1rem', boxShadow: `0 2px 8px ${T.sombra}`,
    borderLeftWidth: '4px', borderLeftStyle: 'solid',
  },
  cardIcoWrap: {
    width: '44px', height: '44px', minWidth: '44px',
    borderRadius: '10px', display: 'flex',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  cardIco:   { fontSize: '1.4rem' },
  cardBody:  { flex: 1 },
  cardTitulo: {
    fontSize: '1rem', fontWeight: '700',
    fontFamily: "'Lora', serif", marginBottom: '0.15rem',
  },
  cardDesc: { fontSize: '0.82rem', color: T.textSub },
  precioBadge: {
    fontSize: '1.4rem', fontWeight: '700',
    fontFamily: "'Lora', serif",
    padding: '6px 16px', borderRadius: '10px',
    border: '1.5px solid', flexShrink: 0,
  },

  // Secciones con SUBE
  seccionesPanel: {
    background: T.bgWhite, border: `1.5px solid ${T.borde}`,
    borderRadius: '16px', padding: '1.4rem',
    marginBottom: '1rem', boxShadow: `0 2px 8px ${T.sombra}`,
  },
  seccionesTitulo: {
    fontSize: '1rem', fontWeight: '600', color: T.textPri,
    fontFamily: "'Lora', serif", marginBottom: '1rem',
  },
  seccionesGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.8rem',
  },
  seccionCard: {
    background: T.bgPage, border: `1.5px solid ${T.borde}`,
    borderRadius: '12px', padding: '1rem',
    textAlign: 'center', borderTopWidth: '4px', borderTopStyle: 'solid',
  },
  seccionNombre: {
    fontSize: '0.78rem', fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem',
  },
  seccionPrecio: {
    fontSize: '1.8rem', fontWeight: '700',
    fontFamily: "'Lora', serif", lineHeight: 1,
  },
  seccionLbl: { fontSize: '0.72rem', color: T.textMuted, marginTop: '3px' },

  // Gratis
  gratisPanel: {
    background: T.bgWhite, border: `1.5px solid ${T.borde}`,
    borderRadius: '16px', padding: '1.4rem',
    marginBottom: '1rem', boxShadow: `0 2px 8px ${T.sombra}`,
  },
  gratisTituloWrap: {
    display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem',
  },
  gratisIcoTit:  { fontSize: '1.2rem' },
  gratisTitulo: {
    fontSize: '1rem', fontWeight: '600', color: T.textPri,
    fontFamily: "'Lora', serif",
  },
  gratisSub: {
    fontSize: '0.88rem', color: T.textSub,
    marginBottom: '1rem', paddingLeft: '0.2rem',
  },
  gratisItem: {
    display: 'flex', alignItems: 'center', gap: '0.9rem',
    padding: '0.7rem 0',
    borderBottom: `1px solid ${T.borde}`,
  },
  gratisIcoWrap: {
    width: '36px', height: '36px', minWidth: '36px',
    borderRadius: '8px', background: T.verdeLight,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  gratisIco:  { fontSize: '1.1rem' },
  grafisTxt:  { flex: 1, fontSize: '0.95rem', color: T.textPri },
  gratisBadge: {
    fontSize: '0.75rem', fontWeight: '700',
    color: T.verde, background: T.verdeLight,
    border: `1px solid ${T.verdeBorde}`,
    borderRadius: '6px', padding: '3px 10px', flexShrink: 0,
  },

  // Aviso final
  aviso: {
    display: 'flex', alignItems: 'flex-start', gap: '0.7rem',
    background: '#FFFBEB', border: '1.5px solid #F0D060',
    borderRadius: '12px', padding: '1rem 1.2rem',
  },
  avisoIco: { fontSize: '1.1rem', marginTop: '1px' },
  avisoTxt: { fontSize: '0.88rem', color: '#7A6000', lineHeight: 1.5 },
};