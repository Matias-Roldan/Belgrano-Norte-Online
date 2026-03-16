// frontend/src/pages/Recorrido.jsx
// ─────────────────────────────────────────────
// BELGRANO NORTE — Recorrido
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
};

// ── ESTACIONES ────────────────────────────────
const ESTACIONES = [
  { id: 1,  nombre: 'Retiro',               sub: 'Ciudad de Buenos Aires', cabecera: true  },
  { id: 2,  nombre: 'Saldías',              sub: 'Ciudad de Buenos Aires'                  },
  { id: 3,  nombre: 'Ciudad Universitaria', sub: 'Ciudad de Buenos Aires'                  },
  { id: 4,  nombre: 'A. Del Valle',         sub: 'Vicente López'                           },
  { id: 5,  nombre: 'M. M. Padilla',        sub: 'Vicente López'                           },
  { id: 6,  nombre: 'Florida',              sub: 'Vicente López'                           },
  { id: 7,  nombre: 'Munro',                sub: 'Vicente López'                           },
  { id: 8,  nombre: 'Carapachay',           sub: 'Vicente López'                           },
  { id: 9,  nombre: 'Villa Adelina',        sub: 'San Isidro'                              },
  { id: 10, nombre: 'Boulogne Sur Mer',     sub: 'San Isidro'                              },
  { id: 11, nombre: 'Vice Alte. Montes',    sub: 'San Isidro'                              },
  { id: 12, nombre: 'Don Torcuato',         sub: 'Tigre'                                   },
  { id: 13, nombre: 'A. Sourdeaux',         sub: 'Malvinas Argentinas'                     },
  { id: 14, nombre: 'Villa de Mayo',        sub: 'Malvinas Argentinas'                     },
  { id: 15, nombre: 'Los Polvorines',       sub: 'Malvinas Argentinas'                     },
  { id: 16, nombre: 'Ing. Pablo Nogués',    sub: 'Malvinas Argentinas'                     },
  { id: 17, nombre: 'Grand Bourg',          sub: 'Malvinas Argentinas'                     },
  { id: 18, nombre: 'Tierras Altas',        sub: 'Malvinas Argentinas'                     },
  { id: 19, nombre: 'Tortuguitas',          sub: 'Malvinas Argentinas'                     },
  { id: 20, nombre: 'Manuel Alberti',       sub: 'Pilar'                                   },
  { id: 21, nombre: 'Del Viso',             sub: 'Pilar'                                   },
  { id: 22, nombre: 'Cecilia Grienson',     sub: 'Pilar',                                  },
  { id: 23, nombre: 'Villa Rosa',           sub: 'Pilar', cabecera: true                   },
];

export default function Recorrido() {
  const navigate = useNavigate();

  return (
    <div style={s.root}>

      {/* ── HEADER ── */}
      <header style={s.header}>
        <div style={s.headerInner}>
          <button onClick={() => navigate('/')} style={s.btnVolver}>← Volver</button>
          <div style={s.headerCentro}>
            <div style={s.headerTitulo}>Recorrido</div>
            <div style={s.headerSub}>Ramal Retiro – Villa Rosa</div>
          </div>
          <div style={{ minWidth: '80px' }} />
        </div>
        <div style={s.headerLine} />
      </header>

      <main style={s.main}>

        {/* ── INTRO ── */}
        <div style={s.panel}>
          <div style={s.panelTitulo}>Línea Belgrano Norte</div>
          <p style={s.panelTxt}>
            El Ferrocarril Belgrano Norte tiene un recorrido de <strong>54 kilómetros</strong> de
            extensión entre las cabeceras de estación <strong>Retiro</strong>, en la Ciudad de
            Buenos Aires, y la estación <strong>Villa Rosa</strong> en el Partido de Pilar.
          </p>
          <div style={s.statsRow}>
            <div style={s.stat}>
              <div style={s.statNum}>54</div>
              <div style={s.statLbl}>km de extensión</div>
            </div>
            <div style={s.stat}>
              <div style={{ ...s.statNum, color: T.blue }}>{ESTACIONES.length}</div>
              <div style={s.statLbl}>estaciones</div>
            </div>
            <div style={s.stat}>
              <div style={{ ...s.statNum, color: '#7D3C98' }}>2</div>
              <div style={s.statLbl}>cabeceras</div>
            </div>
          </div>
        </div>

        {/* ── CABECERAS ── */}
        <div style={s.cabecrasRow}>
          <div style={{ ...s.cabeceraCard, borderTop: `4px solid ${T.red}` }}>
            <div style={s.cabeceraIco}>🚉</div>
            <div style={s.cabeceraLbl}>Cabecera sur</div>
            <div style={{ ...s.cabeceraNombre, color: T.red }}>Retiro</div>
            <div style={s.cabeceraDesc}>Ciudad de Buenos Aires</div>
          </div>
          <div style={s.flechaConector}>
            <div style={s.flechaLinea} />
            <div style={s.flechaTxt}>54 km · 22 estaciones</div>
            <div style={s.flechaLinea} />
          </div>
          <div style={{ ...s.cabeceraCard, borderTop: `4px solid ${T.blue}` }}>
            <div style={s.cabeceraIco}>🚉</div>
            <div style={s.cabeceraLbl}>Cabecera norte</div>
            <div style={{ ...s.cabeceraNombre, color: T.blue }}>Villa Rosa</div>
            <div style={s.cabeceraDesc}>Partido de Pilar</div>
          </div>
        </div>

        {/* ── LISTA DE ESTACIONES ── */}
        <div style={s.listaPanel}>
          <div style={s.listaTitulo}>Estaciones del recorrido</div>

          {ESTACIONES.map((est, idx) => (
            <div key={est.id} style={s.filaEst}>

              {/* Línea vertical + punto */}
              <div style={s.lineaCol}>
                {idx > 0 && <div style={{ ...s.lineaSeg, background: T.borde }} />}
                <div style={{
                  ...s.dot,
                  background:  est.cabecera ? T.textPri : T.bgWhite,
                  border:      `3px solid ${est.cabecera ? T.textPri : T.borde}`,
                  width:       est.cabecera ? '16px' : '11px',
                  height:      est.cabecera ? '16px' : '11px',
                }} />
                {idx < ESTACIONES.length - 1 && (
                  <div style={{ ...s.lineaSeg, background: T.borde }} />
                )}
              </div>

              {/* Info */}
              <div style={{
                ...s.estRow,
                background:  est.cabecera ? T.bgPage : T.bgWhite,
                borderColor: est.cabecera ? T.borde  : T.borde,
                borderLeft:  est.cabecera
                  ? `4px solid ${idx === 0 ? T.red : T.blue}`
                  : `4px solid transparent`,
              }}>
                <div style={s.estNumero}>{idx + 1}</div>
                <div style={s.estInfo}>
                  <div style={{
                    ...s.estNombre,
                    fontWeight: est.cabecera ? '700' : '500',
                    color: est.cabecera
                      ? (idx === 0 ? T.red : T.blue)
                      : T.textPri,
                  }}>
                    {est.nombre}
                    {est.cabecera && (
                      <span style={s.cabBadge}>Cabecera</span>
                    )}
                  </div>
                  <div style={s.estSub}>{est.sub}</div>
                </div>
              </div>

            </div>
          ))}
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
    lineHeight: 1.6, marginBottom: '1.2rem', margin: '0 0 1.2rem',
  },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.8rem' },
  stat: {
    background: T.bgPage, borderRadius: '10px',
    padding: '0.8rem', textAlign: 'center',
    border: `1px solid ${T.borde}`,
  },
  statNum: {
    fontSize: '1.8rem', fontWeight: '700', color: T.red,
    fontFamily: "'Lora', serif", lineHeight: 1,
  },
  statLbl: { fontSize: '0.75rem', color: T.textMuted, marginTop: '3px' },

  // Cabeceras
  cabecrasRow: {
    display: 'flex', alignItems: 'center',
    gap: '0.5rem', marginBottom: '1rem',
  },
  cabeceraCard: {
    flex: 1, background: T.bgWhite,
    border: `1.5px solid ${T.borde}`,
    borderRadius: '12px', padding: '1rem',
    textAlign: 'center',
    boxShadow: `0 2px 8px ${T.sombra}`,
  },
  cabeceraIco:    { fontSize: '1.5rem', marginBottom: '0.3rem' },
  cabeceraLbl:    { fontSize: '0.72rem', color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' },
  cabeceraNombre: { fontSize: '1.1rem', fontWeight: '700', fontFamily: "'Lora', serif", margin: '0.2rem 0' },
  cabeceraDesc:   { fontSize: '0.8rem', color: T.textSub },
  flechaConector: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '0 4px' },
  flechaLinea:    { width: '1px', height: '20px', background: T.borde },
  flechaTxt:      { fontSize: '0.7rem', color: T.textMuted, whiteSpace: 'nowrap', textAlign: 'center' },

  // Lista estaciones
  listaPanel: {
    background: T.bgWhite, border: `1.5px solid ${T.borde}`,
    borderRadius: '16px', padding: '1.4rem',
    boxShadow: `0 2px 8px ${T.sombra}`,
  },
  listaTitulo: {
    fontSize: '1.1rem', fontWeight: '600', color: T.textPri,
    fontFamily: "'Lora', serif", marginBottom: '1rem',
  },

  filaEst:  { display: 'flex', alignItems: 'stretch', gap: '0.8rem', marginBottom: '3px' },
  lineaCol: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20px', flexShrink: 0 },
  lineaSeg: { width: '2px', flex: 1, minHeight: '8px' },
  dot:      { borderRadius: '50%', flexShrink: 0, transition: 'all 0.2s' },

  estRow: {
    flex: 1, display: 'flex', alignItems: 'center',
    gap: '0.8rem', padding: '0.6rem 0.9rem',
    borderRadius: '8px', border: `1px solid ${T.borde}`,
    borderLeftWidth: '4px', borderLeftStyle: 'solid',
  },
  estNumero: {
    fontSize: '0.75rem', fontWeight: '700',
    color: T.textMuted, minWidth: '18px',
    textAlign: 'right', fontFamily: "'Lora', serif",
  },
  estInfo:   { flex: 1 },
  estNombre: {
    fontSize: '0.95rem', display: 'flex',
    alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap',
  },
  estSub:    { fontSize: '0.76rem', color: T.textMuted, marginTop: '1px' },
  cabBadge: {
    fontSize: '0.68rem', fontWeight: '600',
    border: `1px solid ${T.borde}`, borderRadius: '5px',
    padding: '1px 6px', background: T.bgPage, color: T.textSub,
  },
};