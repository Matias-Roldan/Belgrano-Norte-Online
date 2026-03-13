// frontend/src/pages/PanelControl.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const T = {
  bgPage:'#F0F2F5', bgWhite:'#FFFFFF',
  red:'#C0392B', redLight:'#FDECEA', redBorde:'#E8A09A',
  blue:'#1A6FAA', blueLight:'#EAF3FB', blueBorde:'#9AC4E2',
  slate:'#2C3E50', verde:'#27AE60', verdeLight:'#EAF7EF', verdeBorde:'#A3D9B1',
  naranja:'#D35400', naranjaLight:'#FEF0E7', naranjaBorde:'#F0B080',
  textPri:'#1A1A1A', textSub:'#555555', textMuted:'#999999',
  borde:'#DDE1E7', sombra:'rgba(0,0,0,0.07)',
  amarillo:'#F39C12', amarilloLight:'#FEF9E7', amarilloBorde:'#F9D58D',
};

const SECCIONES = [
  {
    ruta: '/panel/avisos',
    label: 'Avisos del Servicio',
    sub: 'Publicar · Editar · Desactivar',
    desc: 'Creá nuevos avisos y administrá los activos. Críticos, advertencias e informativos.',
    color: T.naranja, bgLight: T.naranjaLight, borde: T.naranjaBorde,
    icono: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
    ),
  },
  {
    ruta: '/panel/estaciones',
    label: 'Estaciones',
    sub: 'Estado operativo de cada estación',
    desc: 'Actualizá el estado de cualquier estación: Operativa, Cerrada o Con demoras.',
    color: T.blue, bgLight: T.blueLight, borde: T.blueBorde,
    icono: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M3 9h18M9 21V9"/>
      </svg>
    ),
  },
  {
    ruta: '/panel/trenes',
    label: 'Trenes',
    sub: 'Estado de cada servicio',
    desc: 'Marcá trenes como Demorado, Cancelado, En hora o En servicio en tiempo real.',
    color: T.red, bgLight: T.redLight, borde: T.redBorde,
    icono: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="12" rx="2"/>
        <circle cx="7" cy="19" r="2"/><circle cx="17" cy="19" r="2"/>
        <path d="M2 12h20M7 7V4M17 7V4"/>
      </svg>
    ),
  },
  {
    ruta: '/panel/servicios',
    label: 'Estado del Servicio',
    sub: 'Normal · Reducido · Interrumpido',
    desc: 'Activá o desactivá el estado general del servicio visible para los pasajeros.',
    color: T.verde, bgLight: T.verdeLight, borde: T.verdeBorde,
    icono: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
        <path d="M9 12l2 2 4-4"/>
      </svg>
    ),
  },
];

export default function PanelControl() {
  const navigate = useNavigate();
  const [hover, setHover] = useState(null);
  const [hora, setHora]   = useState('');
  const [fecha, setFecha] = useState('');

  useEffect(() => {
    const tick = () => {
      const n = new Date();
      setHora(`${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`);
      setFecha(n.toLocaleDateString('es-AR', { weekday:'long', day:'2-digit', month:'long' }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={s.root}>
      <header style={s.header}>
        <div style={s.headerInner}>
          <button onClick={() => navigate('/')} style={s.btnVolver}>← Volver</button>
          <div style={s.headerCentro}>
            <div style={s.headerTitulo}>Panel de Control</div>
            <div style={s.headerSub}>Belgrano Norte · Solo operadores</div>
          </div>
          <div style={s.horaChip}>{hora}</div>
        </div>
        <div style={s.headerLine}/>
      </header>

      <main style={s.main}>
        <div style={s.avisoAdmin}>
          <span style={{ fontSize:'1.1rem' }}>🔒</span>
          <div>
            <div style={s.avisoAdminTit}>Área administrativa</div>
            <div style={s.avisoAdminSub}>{fecha.charAt(0).toUpperCase() + fecha.slice(1)} · Los cambios se reflejan en tiempo real.</div>
          </div>
        </div>

        <div style={s.secTitulo}>¿Qué querés administrar?</div>

        {SECCIONES.map((sec) => {
          const on = hover === sec.ruta;
          return (
            <button
              key={sec.ruta}
              onClick={() => navigate(sec.ruta)}
              onMouseEnter={() => setHover(sec.ruta)}
              onMouseLeave={() => setHover(null)}
              style={{
                ...s.card,
                borderColor: on ? sec.color : T.borde,
                transform:   on ? 'translateY(-2px)' : 'translateY(0)',
                boxShadow:   on ? `0 6px 24px ${sec.color}22` : `0 2px 8px ${T.sombra}`,
              }}
            >
              <div style={{ ...s.cardFranja, background: sec.color }}/>
              <div style={{ ...s.cardIcono, background: sec.bgLight, color: sec.color }}>{sec.icono}</div>
              <div style={s.cardTextos}>
                <div style={s.cardLabel}>{sec.label}</div>
                <div style={s.cardSub}>{sec.sub}</div>
                <div style={s.cardDesc}>{sec.desc}</div>
              </div>
              <div style={{ ...s.cardFlecha, color: sec.color }}>›</div>
            </button>
          );
        })}
      </main>
    </div>
  );
}

const s = {
  root: { backgroundColor: T.bgPage, minHeight:'100vh', fontFamily:"'Source Sans 3', sans-serif", color: T.textPri },
  header: { background: T.bgWhite, boxShadow:`0 2px 8px ${T.sombra}`, position:'sticky', top:0, zIndex:100 },
  headerInner: { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'1rem 1.5rem', maxWidth:'720px', margin:'0 auto', width:'100%' },
  btnVolver: { background: T.bgWhite, border:`2px solid ${T.borde}`, color: T.textSub, padding:'0.6rem 1rem', borderRadius:'8px', cursor:'pointer', fontSize:'0.95rem', fontWeight:'600', whiteSpace:'nowrap', minHeight:'44px' },
  headerCentro: { textAlign:'center' },
  headerTitulo: { fontSize:'1.3rem', fontWeight:'700', color: T.textPri, fontFamily:"'Lora', serif", lineHeight:1.1 },
  headerSub:    { fontSize:'0.75rem', color: T.textSub, marginTop:'2px' },
  horaChip:     { fontSize:'1.4rem', fontWeight:'700', color: T.red, fontFamily:"'Lora', serif", fontVariantNumeric:'tabular-nums', minWidth:'60px', textAlign:'right' },
  headerLine:   { height:'3px', background:`linear-gradient(90deg, ${T.slate}, ${T.blue})` },
  main: { maxWidth:'720px', margin:'0 auto', padding:'1.5rem', display:'flex', flexDirection:'column', gap:'1rem' },
  avisoAdmin: { display:'flex', alignItems:'center', gap:'0.9rem', background: T.amarilloLight, border:`1.5px solid ${T.amarilloBorde}`, borderRadius:'12px', padding:'1rem 1.2rem' },
  avisoAdminTit: { fontSize:'0.9rem', fontWeight:'700', color: T.amarillo },
  avisoAdminSub: { fontSize:'0.8rem', color:'#9A7D0A', marginTop:'1px' },
  secTitulo: { fontSize:'1.05rem', fontWeight:'600', color: T.textSub, paddingLeft:'0.2rem' },
  card: { position:'relative', overflow:'hidden', display:'flex', alignItems:'center', gap:'1rem', background: T.bgWhite, border:'2px solid', borderRadius:'16px', padding:'1.2rem 1.2rem 1.2rem 1rem', textAlign:'left', transition:'all 0.2s ease', minHeight:'100px', cursor:'pointer', width:'100%' },
  cardFranja: { position:'absolute', left:0, top:0, bottom:0, width:'5px' },
  cardIcono: { width:'56px', height:'56px', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'14px' },
  cardTextos: { flex:1, minWidth:0 },
  cardLabel: { fontSize:'1.2rem', fontWeight:'700', fontFamily:"'Lora', serif", color: T.textPri, lineHeight:1.2, marginBottom:'0.15rem' },
  cardSub:   { fontSize:'0.82rem', fontWeight:'600', color: T.textSub, marginBottom:'0.25rem' },
  cardDesc:  { fontSize:'0.82rem', color: T.textMuted, lineHeight:1.4 },
  cardFlecha:{ fontSize:'2.2rem', fontWeight:'300', lineHeight:1, flexShrink:0 },
};
