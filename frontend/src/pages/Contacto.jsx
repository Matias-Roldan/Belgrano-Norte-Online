// frontend/src/pages/Contacto.jsx
// ─────────────────────────────────────────────
// BELGRANO NORTE — Contacto
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
};

const CONTACTOS = [
  {
    ico: '📍',
    titulo: 'Dirección',
    linea1: 'Av. Dr. Ramos Mejía 1430',
    linea2: 'Estación Retiro, Buenos Aires',
    color:  '#7D3C98',
    bg:     '#F5EEF8',
    href:   'https://maps.google.com/?q=Av.+Dr.+Ramos+Mejía+1430+Buenos+Aires',
    accion: 'Ver en mapa',
  },
  {
    ico: '🕐',
    titulo: 'Horario de atención',
    linea1: 'Lunes a Viernes',
    linea2: '8:00 a 20:00 hs',
    color:  '#D35400',
    bg:     '#FEF0E7',
  },
  {
    ico: '📞',
    titulo: 'Teléfono',
    linea1: '0800-777-3377',
    color:  '#1A6FAA',
    bg:     '#EAF3FB',
  },
  {
    ico: '✉️',
    titulo: 'Correo electrónico',
    linea1: 'atencionalpasajero@ferrovias.com.ar',
    color:  '#C0392B',
    bg:     '#FDECEA',
  },
];

export default function Contacto() {
  const navigate = useNavigate();

  return (
    <div style={s.root}>

      {/* ── HEADER ── */}
      <header style={s.header}>
        <div style={s.headerInner}>
          <button onClick={() => navigate('/')} style={s.btnVolver}>← Volver</button>
          <div style={s.headerCentro}>
            <div style={s.headerTitulo}>Contacto</div>
            <div style={s.headerSub}>Atención al Pasajero</div>
          </div>
          <div style={{ minWidth: '80px' }} />
        </div>
        <div style={s.headerLine} />
      </header>

      <main style={s.main}>

        {/* ── INTRO ── */}
        <div style={s.panel}>
          <div style={s.panelTitulo}>Oficina de Atención al Pasajero</div>
          <p style={s.panelTxt}>
            Contacto con el <strong>Tren Belgrano Norte</strong> — Empresa Ferrovías.
            Podés comunicarte por teléfono, correo electrónico o acercarte
            personalmente a la oficina en Estación Retiro.
          </p>
        </div>

        {/* ── CARDS DE CONTACTO ── */}
        {CONTACTOS.map((item, i) => (
          <div key={i} style={{ ...s.card, borderLeft: `4px solid ${item.color}` }}>
            <div style={{ ...s.cardIcoWrap, background: item.bg }}>
              <span style={s.cardIco}>{item.ico}</span>
            </div>
            <div style={s.cardBody}>
              <div style={{ ...s.cardTitulo, color: item.color }}>{item.titulo}</div>
              <div style={s.cardLinea1}>{item.linea1}</div>
              <div style={s.cardLinea2}>{item.linea2}</div>
            </div>
            {item.href && (
              <a href={item.href} target="_blank" rel="noreferrer" style={{
                ...s.cardAccion,
                color:       item.color,
                background:  item.bg,
                borderColor: item.color + '55',
              }}>
                {item.accion}
              </a>
            )}
          </div>
        ))}

        {/* ── AVISO ── */}
        <div style={s.aviso}>
          <span style={s.avisoIco}>ℹ️</span>
          <span style={s.avisoTxt}>
            Este sitio no pertenece a Ferrovías ni a ningún organismo oficial.
            Para consultas formales dirigirse directamente a los canales indicados.
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

  panel: {
    background: T.bgWhite, border: `1.5px solid ${T.borde}`,
    borderRadius: '16px', padding: '1.4rem',
    marginBottom: '1rem', boxShadow: `0 2px 8px ${T.sombra}`,
  },
  panelTitulo: {
    fontSize: '1.1rem', fontWeight: '600', color: T.textPri,
    fontFamily: "'Lora', serif", marginBottom: '0.6rem',
  },
  panelTxt: {
    fontSize: '0.95rem', color: T.textSub,
    lineHeight: 1.6, margin: 0,
  },

  card: {
    display: 'flex', alignItems: 'center', gap: '1rem',
    background: T.bgWhite, border: `1.5px solid ${T.borde}`,
    borderRadius: '12px', padding: '1rem 1.2rem',
    marginBottom: '0.8rem', boxShadow: `0 2px 8px ${T.sombra}`,
    borderLeftWidth: '4px', borderLeftStyle: 'solid',
  },
  cardIcoWrap: {
    width: '44px', height: '44px', minWidth: '44px',
    borderRadius: '10px', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  cardIco:    { fontSize: '1.4rem' },
  cardBody:   { flex: 1 },
  cardTitulo: {
    fontSize: '0.78rem', fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: '0.05em',
    marginBottom: '0.2rem',
  },
  cardLinea1: { fontSize: '0.97rem', fontWeight: '600', color: T.textPri },
  cardLinea2: { fontSize: '0.85rem', color: T.textSub },
  cardAccion: {
    fontSize: '0.8rem', fontWeight: '700',
    padding: '6px 12px', borderRadius: '8px',
    border: '1.5px solid', textDecoration: 'none',
    whiteSpace: 'nowrap', flexShrink: 0,
  },

  aviso: {
    display: 'flex', alignItems: 'flex-start', gap: '0.7rem',
    background: '#FFFBEB', border: '1.5px solid #F0D060',
    borderRadius: '12px', padding: '1rem 1.2rem',
    marginTop: '0.4rem',
  },
  avisoIco: { fontSize: '1.1rem', marginTop: '1px' },
  avisoTxt: { fontSize: '0.88rem', color: '#7A6000', lineHeight: 1.5 },
};