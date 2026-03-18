// [ARCHIVO: Tarifas.jsx] — AUDITADO ✓
import { useNavigate } from 'react-router-dom';

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

// [SEC-FIX] Datos hardcodeados — sin emojis en el objeto de config.
// Los iconos se renderizan con SVG controlados en el componente.
const SECCIONES = [
  { seccion: '1 Seccion', precio: '$280', color: T.verde,   bg: T.verdeLight, borde: T.verdeBorde },
  { seccion: '2 Seccion', precio: '$360', color: T.blue,    bg: T.blueLight,  borde: '#9AC4E2'    },
  { seccion: '3 Seccion', precio: '$450', color: '#7D3C98', bg: '#F5EEF8',    borde: '#C39BD3'    },
];

// [SEC-FIX] Sin emojis en el array — cada item tiene un tipo de icono
const GRATUITOS = [
  { tipoIco: 'menor',      texto: 'Menores de 3 (tres) anios' },
  { tipoIco: 'jubilado',   texto: 'Jubilados y pensionados' },
  { tipoIco: 'estudiante', texto: 'Estudiantes primarios de escuelas publicas' },
  { tipoIco: 'discap',     texto: 'Personas con discapacidad' },
];

// [SEC-FIX] SVG por tipo — reemplaza todos los emojis
function IcoGratis(props) {
  var tipo  = props.tipo;
  var size  = props.size || 20;
  var color = props.color || T.verde;

  if (tipo === 'menor') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="8" r="4"/>
        <path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
      </svg>
    );
  }
  if (tipo === 'jubilado') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="7" r="4"/>
        <path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
        <line x1="8" y1="20" x2="8" y2="23"/>
        <line x1="16" y1="20" x2="16" y2="23"/>
      </svg>
    );
  }
  if (tipo === 'estudiante') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
    );
  }
  if (tipo === 'discap') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="4" r="2"/>
        <path d="M12 6v7l4 4"/>
        <path d="M9 20a5 5 0 1 0 6-7.4"/>
      </svg>
    );
  }
  if (tipo === 'sube') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="5" width="20" height="14" rx="2"/>
        <line x1="2" y1="10" x2="22" y2="10"/>
      </svg>
    );
  }
  if (tipo === 'boleto') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/>
      </svg>
    );
  }
  if (tipo === 'ticket') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 12V22H4V12"/>
        <path d="M22 7H2v5h20V7z"/>
        <path d="M12 22V7"/>
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
      </svg>
    );
  }
  // info
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="12" x2="12" y2="16"/>
      <line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  );
}

export default function Tarifas() {
  var navigate = useNavigate();

  return (
    <div style={s.root}>

      <header style={s.header}>
        <div style={s.headerInner}>
          <button onClick={function() { navigate('/'); }} style={s.btnVolver} aria-label="Volver al inicio">
            {'<- Volver'}
          </button>
          <div style={s.headerCentro}>
            <div style={s.headerTitulo}>Tarifas</div>
            <div style={s.headerSub}>Linea Belgrano Norte</div>
          </div>
          <div style={{ minWidth: '80px' }}></div>
        </div>
        <div style={s.headerLine}></div>
      </header>

      <main style={s.main}>

        <div style={s.panel}>
          <div style={s.panelTitulo}>Precios y tarifas</div>
          <p style={s.panelTxt}>
            Tarifas actualizadas de boletos y abonos en el Tren Belgrano Norte.
            Precios para viajar segun las estaciones.
          </p>
          {/* [SEC-FIX] SVG en lugar de emoji 💳 */}
          <div style={s.avisoSube}>
            <IcoGratis tipo="sube" size={20} color="#1E5631"/>
            <span style={s.avisoSubeTxt}>
              <strong>Pagando con tarjeta SUBE el viaje es mas barato.</strong>{' '}
              Sin SUBE el boleto tiene un costo de <strong>$900</strong> independientemente de la seccion.
            </span>
          </div>
        </div>

        {/* ── BOLETO SIN SUBE ── */}
        <div style={{ ...s.card, borderLeft: '4px solid ' + T.red }}>
          <div style={{ ...s.cardIcoWrap, background: T.redLight }}>
            {/* [SEC-FIX] SVG en lugar de emoji 🎫 */}
            <IcoGratis tipo="boleto" size={22} color={T.red}/>
          </div>
          <div style={s.cardBody}>
            <div style={{ ...s.cardTitulo, color: T.red }}>Sin SUBE</div>
            <div style={s.cardDesc}>Boleto ida - Todas las secciones</div>
          </div>
          <div style={{ ...s.precioBadge, color: T.red, background: T.redLight, borderColor: T.redBorde }}>
            $900
          </div>
        </div>

        {/* ── SECCIONES CON SUBE ── */}
        <div style={s.seccionesPanel}>
          <div style={s.seccionesTitulo}>Boleto ida con SUBE</div>
          <div style={s.seccionesGrid}>
            {SECCIONES.map(function(sec, i) {
              return (
                <div key={i} style={{ ...s.seccionCard, borderTop: '4px solid ' + sec.color }}>
                  <div style={{ ...s.seccionNombre, color: sec.color }}>{sec.seccion}</div>
                  <div style={{ ...s.seccionPrecio, color: sec.color }}>{sec.precio}</div>
                  <div style={s.seccionLbl}>por viaje</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── VIAJE GRATUITO ── */}
        <div style={s.gratisPanel}>
          <div style={s.gratisTituloWrap}>
            {/* [SEC-FIX] SVG en lugar de emoji 🎟️ */}
            <IcoGratis tipo="ticket" size={20} color={T.textPri}/>
            <div style={s.gratisTitulo}>Viaja gratis en el Belgrano Norte</div>
          </div>
          <div style={s.gratisSub}>
            Los siguientes pasajeros <strong>no pagan boleto:</strong>
          </div>
          {GRATUITOS.map(function(item, i) {
            var esUltimo = i === GRATUITOS.length - 1;
            return (
              <div key={i} style={{ ...s.gratisItem, borderBottom: esUltimo ? 'none' : '1px solid ' + T.borde }}>
                <div style={s.gratisIcoWrap}>
                  {/* [SEC-FIX] SVG controlado — tipoIco es valor estático del array */}
                  <IcoGratis tipo={item.tipoIco} size={18} color={T.verde}/>
                </div>
                <div style={s.grafisTxt}>{item.texto}</div>
                <div style={s.gratisBadge}>Gratis</div>
              </div>
            );
          })}
        </div>

        {/* ── AVISO FINAL ── */}
        <div style={s.aviso} role="note">
          {/* [SEC-FIX] SVG en lugar de emoji ℹ️ */}
          <IcoGratis tipo="info" size={18} color="#7A6000"/>
          <span style={s.avisoTxt}>
            Los precios pueden variar. Para informacion oficial consulta los canales
            de Ferrovias o la pagina de Trenes Argentinos.
          </span>
        </div>

      </main>
    </div>
  );
}

const s = {
  root: { backgroundColor: T.bgPage, minHeight: '100vh', fontFamily: "'Source Sans 3', 'Segoe UI', sans-serif", color: T.textPri },
  header: { background: T.bgWhite, boxShadow: '0 2px 8px ' + T.sombra, position: 'sticky', top: 0, zIndex: 100 },
  headerInner: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', maxWidth: '820px', margin: '0 auto', width: '100%' },
  btnVolver: { background: T.bgWhite, border: '2px solid ' + T.borde, color: T.textSub, padding: '0.6rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '600', whiteSpace: 'nowrap', minHeight: '44px' },
  headerCentro: { textAlign: 'center' },
  headerTitulo: { fontSize: '1.3rem', fontWeight: '700', color: T.textPri, fontFamily: "'Lora', serif", lineHeight: 1.1 },
  headerSub:  { fontSize: '0.75rem', color: T.textSub, marginTop: '2px' },
  headerLine: { height: '3px', background: 'linear-gradient(90deg, ' + T.red + ', #E74C3C)' },
  main: { maxWidth: '820px', margin: '0 auto', padding: '1.5rem' },
  panel: { background: T.bgWhite, border: '1.5px solid ' + T.borde, borderRadius: '16px', padding: '1.4rem', marginBottom: '1rem', boxShadow: '0 2px 8px ' + T.sombra },
  panelTitulo: { fontSize: '1.1rem', fontWeight: '600', color: T.textPri, fontFamily: "'Lora', serif", marginBottom: '0.5rem' },
  panelTxt: { fontSize: '0.95rem', color: T.textSub, lineHeight: 1.6, margin: '0 0 1rem' },
  avisoSube: { display: 'flex', alignItems: 'flex-start', gap: '0.7rem', background: T.verdeLight, border: '1.5px solid ' + T.verdeBorde, borderRadius: '10px', padding: '0.9rem 1rem' },
  avisoSubeTxt: { fontSize: '0.88rem', color: '#1E5631', lineHeight: 1.5 },
  card: { display: 'flex', alignItems: 'center', gap: '1rem', background: T.bgWhite, border: '1.5px solid ' + T.borde, borderRadius: '12px', padding: '1rem 1.2rem', marginBottom: '1rem', boxShadow: '0 2px 8px ' + T.sombra, borderLeftWidth: '4px', borderLeftStyle: 'solid' },
  cardIcoWrap: { width: '44px', height: '44px', minWidth: '44px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  cardBody: { flex: 1 },
  cardTitulo: { fontSize: '1rem', fontWeight: '700', fontFamily: "'Lora', serif", marginBottom: '0.15rem' },
  cardDesc: { fontSize: '0.82rem', color: T.textSub },
  precioBadge: { fontSize: '1.4rem', fontWeight: '700', fontFamily: "'Lora', serif", padding: '6px 16px', borderRadius: '10px', border: '1.5px solid', flexShrink: 0 },
  seccionesPanel: { background: T.bgWhite, border: '1.5px solid ' + T.borde, borderRadius: '16px', padding: '1.4rem', marginBottom: '1rem', boxShadow: '0 2px 8px ' + T.sombra },
  seccionesTitulo: { fontSize: '1rem', fontWeight: '600', color: T.textPri, fontFamily: "'Lora', serif", marginBottom: '1rem' },
  seccionesGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.8rem' },
  seccionCard: { background: T.bgPage, border: '1.5px solid ' + T.borde, borderRadius: '12px', padding: '1rem', textAlign: 'center', borderTopWidth: '4px', borderTopStyle: 'solid' },
  seccionNombre: { fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' },
  seccionPrecio: { fontSize: '1.8rem', fontWeight: '700', fontFamily: "'Lora', serif", lineHeight: 1 },
  seccionLbl: { fontSize: '0.72rem', color: T.textMuted, marginTop: '3px' },
  gratisPanel: { background: T.bgWhite, border: '1.5px solid ' + T.borde, borderRadius: '16px', padding: '1.4rem', marginBottom: '1rem', boxShadow: '0 2px 8px ' + T.sombra },
  gratisTituloWrap: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' },
  gratisTitulo: { fontSize: '1rem', fontWeight: '600', color: T.textPri, fontFamily: "'Lora', serif" },
  gratisSub: { fontSize: '0.88rem', color: T.textSub, marginBottom: '1rem', paddingLeft: '0.2rem' },
  gratisItem: { display: 'flex', alignItems: 'center', gap: '0.9rem', padding: '0.7rem 0' },
  gratisIcoWrap: { width: '36px', height: '36px', minWidth: '36px', borderRadius: '8px', background: T.verdeLight, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  grafisTxt: { flex: 1, fontSize: '0.95rem', color: T.textPri },
  gratisBadge: { fontSize: '0.75rem', fontWeight: '700', color: T.verde, background: T.verdeLight, border: '1px solid ' + T.verdeBorde, borderRadius: '6px', padding: '3px 10px', flexShrink: 0 },
  aviso: { display: 'flex', alignItems: 'flex-start', gap: '0.7rem', background: '#FFFBEB', border: '1.5px solid #F0D060', borderRadius: '12px', padding: '1rem 1.2rem' },
  avisoTxt: { fontSize: '0.88rem', color: '#7A6000', lineHeight: 1.5 },
};