// [ARCHIVO: QuienesSomos.jsx] — AUDITADO ✓
import { useSecureNavigate } from '../../hooks/useSecureNavigate';
import { T }                 from '../../utils/constantes';

// [SEC-FIX] SVG controlados por tipo — reemplazan emojis en INFO y en el render
function IconoInfo({ tipo, color, size }) {
  var sz = size || 22;
  if (tipo === 'estacion') return (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <path d="M3 9h18M9 21V9"/>
    </svg>
  );
  if (tipo === 'empresa') return (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
  if (tipo === 'mapa') return (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
      <line x1="8" y1="2" x2="8" y2="18"/>
      <line x1="16" y1="6" x2="16" y2="22"/>
    </svg>
  );
  if (tipo === 'tren') return (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="7" width="20" height="12" rx="2"/>
      <circle cx="7" cy="19" r="2"/><circle cx="17" cy="19" r="2"/>
      <path d="M2 12h20M7 7V4M17 7V4"/>
    </svg>
  );
  return (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="12" x2="12" y2="16"/>
      <line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  );
}

// [SEC-FIX] Datos hardcodeados — sin emojis en el objeto de config
const INFO = [
  {
    tipoIco: 'estacion',
    titulo:  'Recorrido',
    texto:   'La línea recorre 54 kilómetros entre la estación Retiro (Ciudad de Buenos Aires) y la estación Villa Rosa, en el Partido de Pilar, área Metropolitana.',
    color:   T.red,
    bg:      T.redLight,
  },
  {
    tipoIco: 'empresa',
    titulo:  'Operadora',
    texto:   'La línea del Ferrocarril Belgrano Norte está administrada por la empresa Ferrovías, dentro del sistema de Trenes Argentinos.',
    color:   T.blue,
    bg:      '#EAF3FB',
  },
  {
    tipoIco: 'mapa',
    titulo:  'Área de cobertura',
    texto:   'El ferrocarril Belgrano Norte conecta la Ciudad Autónoma de Buenos Aires (CABA) con diferentes municipios del Conurbano Bonaerense.',
    color:   T.verde,
    bg:      '#EDFAF3',
  },
];

export default function QuienesSomos() {
  const navigate = useSecureNavigate(); // [SEC-FIX] navegacion segura con allowlist

  return (
    <div style={s.root}>

      <header style={s.header}>
        <div style={s.headerInner}>
          <button onClick={() => navigate('/')} style={s.btnVolver} aria-label="Volver al inicio">
            Volver
          </button>
          <div style={s.headerCentro}>
            <div style={s.headerTitulo}>Quiénes Somos</div>
            <div style={s.headerSub}>Línea Belgrano Norte</div>
          </div>
          <div style={{ minWidth: '80px' }}/>
        </div>
        <div style={s.headerLine}/>
      </header>

      <main style={s.main}>

        <div style={s.hero}>
          <div style={s.heroIco}>
            <IconoInfo tipo="tren" color={T.red} size={48}/>
          </div>
          <h1 style={s.heroTitulo}>Tren Belgrano Norte</h1>
          <p style={s.heroSub}>Recorrido · Estaciones · Horarios · Tarifas</p>
        </div>

        <div style={s.statsRow}>
          <div style={s.statCard}>
            <div style={s.statNum}>54</div>
            <div style={s.statLabel}>km de recorrido</div>
          </div>
          <div style={s.statCard}>
            <div style={{ ...s.statNum, color: T.blue }}>2</div>
            <div style={s.statLabel}>cabeceras</div>
          </div>
          <div style={s.statCard}>
            <div style={{ ...s.statNum, color: T.verde }}>1</div>
            <div style={s.statLabel}>línea operativa</div>
          </div>
        </div>

        {INFO.map(function(item, i) {
          return (
            <div key={i} style={{ ...s.card, borderLeft: '4px solid ' + item.color }}>
              <div style={{ ...s.cardIcoWrap, background: item.bg }}>
                <IconoInfo tipo={item.tipoIco} color={item.color} size={22}/>
              </div>
              <div style={s.cardBody}>
                <div style={{ ...s.cardTitulo, color: item.color }}>{item.titulo}</div>
                <div style={s.cardTexto}>{item.texto}</div>
              </div>
            </div>
          );
        })}

        <div style={s.panel}>
          <div style={s.panelTitulo}>Recorrido de la línea</div>
          <div style={s.rutaWrap}>
            <div style={s.rutaEstacion}>
              <div style={{ ...s.rutaDot, background: T.red }} aria-hidden="true"/>
              <div>
                <div style={s.rutaNombre}>Retiro</div>
                <div style={s.rutaSub}>Ciudad de Buenos Aires</div>
              </div>
            </div>
            <div style={s.rutaLinea}>
              <div style={s.rutaLineaBar} aria-hidden="true"/>
              <div style={s.rutaKm}>54 km</div>
            </div>
            <div style={s.rutaEstacion}>
              <div style={{ ...s.rutaDot, background: T.blue }} aria-hidden="true"/>
              <div>
                <div style={s.rutaNombre}>Villa Rosa</div>
                <div style={s.rutaSub}>Partido de Pilar</div>
              </div>
            </div>
          </div>
        </div>

        <div style={s.aviso} role="note">
          <IconoInfo tipo="info" color="#7A6000" size={18}/>
          <span style={s.avisoTxt}>
            Este sitio no pertenece a ningún organismo nacional, provincial o municipal.
            Es un recurso informativo independiente para los pasajeros de la línea.
          </span>
        </div>

      </main>
    </div>
  );
}

const s = {
  root:         { backgroundColor: T.bgPage, minHeight: '100vh', fontFamily: "'Source Sans 3', 'Segoe UI', sans-serif", color: T.textPri },
  header:       { background: T.bgWhite, boxShadow: '0 2px 8px ' + T.sombra, position: 'sticky', top: 0, zIndex: 100 },
  headerInner:  { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', maxWidth: '820px', margin: '0 auto', width: '100%' },
  btnVolver:    { background: T.bgWhite, border: '2px solid ' + T.borde, color: T.textSub, padding: '0.6rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '600', whiteSpace: 'nowrap', minHeight: '44px' },
  headerCentro: { textAlign: 'center' },
  headerTitulo: { fontSize: '1.3rem', fontWeight: '700', color: T.textPri, fontFamily: "'Lora', serif", lineHeight: 1.1 },
  headerSub:    { fontSize: '0.75rem', color: T.textSub, marginTop: '2px' },
  headerLine:   { height: '3px', background: 'linear-gradient(90deg, ' + T.red + ', #E74C3C)' },
  main:         { maxWidth: '820px', margin: '0 auto', padding: '1.5rem' },
  hero:         { background: T.bgWhite, border: '1.5px solid ' + T.borde, borderRadius: '16px', padding: '2rem 1.5rem', textAlign: 'center', marginBottom: '1rem', boxShadow: '0 2px 8px ' + T.sombra },
  heroIco:      { marginBottom: '0.5rem', display: 'flex', justifyContent: 'center' },
  heroTitulo:   { fontSize: '1.8rem', fontWeight: '700', color: T.textPri, fontFamily: "'Lora', serif", margin: '0 0 0.4rem' },
  heroSub:      { fontSize: '1rem', color: T.textSub, margin: 0 },
  statsRow:     { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.8rem', marginBottom: '1rem' },
  statCard:     { background: T.bgWhite, border: '1.5px solid ' + T.borde, borderRadius: '12px', padding: '1rem', textAlign: 'center', boxShadow: '0 2px 8px ' + T.sombra },
  statNum:      { fontSize: '2rem', fontWeight: '700', color: T.red, fontFamily: "'Lora', serif", lineHeight: 1 },
  statLabel:    { fontSize: '0.78rem', color: T.textSub, marginTop: '4px' },
  card:         { display: 'flex', alignItems: 'flex-start', gap: '1rem', background: T.bgWhite, border: '1.5px solid ' + T.borde, borderRadius: '12px', padding: '1.1rem 1.2rem', marginBottom: '0.8rem', boxShadow: '0 2px 8px ' + T.sombra, borderLeftWidth: '4px', borderLeftStyle: 'solid' },
  cardIcoWrap:  { width: '44px', height: '44px', minWidth: '44px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cardBody:     { flex: 1 },
  cardTitulo:   { fontSize: '1rem', fontWeight: '700', fontFamily: "'Lora', serif", marginBottom: '0.3rem' },
  cardTexto:    { fontSize: '0.92rem', color: T.textSub, lineHeight: 1.55 },
  panel:        { background: T.bgWhite, border: '1.5px solid ' + T.borde, borderRadius: '16px', padding: '1.4rem', marginBottom: '1rem', boxShadow: '0 2px 8px ' + T.sombra },
  panelTitulo:  { fontSize: '1.1rem', fontWeight: '600', color: T.textPri, fontFamily: "'Lora', serif", marginBottom: '1.2rem' },
  rutaWrap:     { display: 'flex', flexDirection: 'column', gap: '0.6rem' },
  rutaEstacion: { display: 'flex', alignItems: 'center', gap: '1rem' },
  rutaDot:      { width: '14px', height: '14px', borderRadius: '50%', flexShrink: 0 },
  rutaNombre:   { fontSize: '1rem', fontWeight: '700', color: T.textPri },
  rutaSub:      { fontSize: '0.8rem', color: T.textMuted },
  rutaLinea:    { display: 'flex', alignItems: 'center', gap: '0.8rem', paddingLeft: '6px' },
  rutaLineaBar: { width: '3px', height: '36px', background: T.borde, borderRadius: '2px', flexShrink: 0 },
  rutaKm:       { fontSize: '0.85rem', color: T.textMuted, fontWeight: '600', fontFamily: "'Lora', serif" },
  aviso:        { display: 'flex', alignItems: 'flex-start', gap: '0.7rem', background: '#FFFBEB', border: '1.5px solid #F0D060', borderRadius: '12px', padding: '1rem 1.2rem' },
  avisoTxt:     { fontSize: '0.88rem', color: '#7A6000', lineHeight: 1.5 },
};
