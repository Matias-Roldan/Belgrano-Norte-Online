// frontend/src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import Tablero         from './pages/Tablero';
import Planificar      from './pages/Planificar';
import Avisos          from './pages/Avisos';
import PanelControl    from './pages/PanelControl';
import AdminAvisos     from './pages/AdminAvisos';
import AdminEstaciones from './pages/AdminEstaciones';
import AdminTrenes     from './pages/AdminTrenes';
import AdminServicios  from './pages/AdminServicios';
import QuienesSomos    from './pages/QuienesSomos';
import Recorrido       from './pages/Recorrido';
import Contacto        from './pages/Contacto';  
import Tarifas         from './pages/Tarifas';
import api             from './api/belgrano';


const T = {
  bgPage:    '#F5F5F0',
  bgWhite:   '#FFFFFF',
  bgCard:    '#FFFFFF',
  red:       '#C0392B',
  redLight:  '#FDECEA',
  redBorde:  '#E8A09A',
  blue:      '#1A6FAA',
  blueLight: '#EAF3FB',
  blueBorde: '#9AC4E2',
  orange:    '#D35400',
  orangeLight: '#FEF0E7',
  orangeBorde: '#F0B080',
  slate:     '#2C3E50',
  slateLight:'#EAF0F6',
  slateBorde:'#A8BDCC',
  textPri:   '#1A1A1A',
  textSub:   '#555555',
  textMuted: '#999999',
  borde:     '#E0E0E0',
  sombra:    'rgba(0,0,0,0.08)',
  verde:     '#27AE60',
  verdeLight:'#EAF7EF',
  amarillo:  '#F39C12',
};

const PALETA_SERVICIO = {
  1: { color:'#27AE60', bg:'#F0FBF4', borde:'#C8E6C9', dot:'#27AE60', emoji:'✅' },
  2: { color:'#D35400', bg:'#FEF3E2', borde:'#F9CB8D', dot:'#D35400', emoji:'⚠️' },
  3: { color:'#C0392B', bg:'#FDECEA', borde:'#E8A09A', dot:'#C0392B', emoji:'🔴' },
};
function getCfgServicio(id) {
  return PALETA_SERVICIO[id] || { color:'#27AE60', bg:'#F0FBF4', borde:'#C8E6C9', dot:'#27AE60', emoji:'✅' };
}

// ── GLOBAL STYLES ─────────────────────────────
const GlobalStyles = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&family=Source+Sans+3:wght@400;500;600;700&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html  { background: #F5F5F0; }
      body  {
        background: #F5F5F0;
        color: #1A1A1A;
        font-family: 'Source Sans 3', sans-serif;
        -webkit-font-smoothing: antialiased;
        overflow-x: hidden;
      }
      ::-webkit-scrollbar { width: 5px; }
      ::-webkit-scrollbar-track { background: #eee; }
      ::-webkit-scrollbar-thumb { background: #C0392B; border-radius: 3px; }
      @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:0.3} }
      @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
      .a1{animation:fadeUp .4s ease .05s both}
      .a2{animation:fadeUp .4s ease .12s both}
      .a3{animation:fadeUp .4s ease .20s both}
      .a4{animation:fadeUp .4s ease .28s both}
      .a5{animation:fadeUp .4s ease .36s both}
      .a6{animation:fadeUp .4s ease .44s both}
      button { font-family:'Source Sans 3',sans-serif; cursor:pointer; border:none; background:none; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  return null;
};

// ── BARRA DE NAVEGACIÓN ───────────────────────
const NAV_ITEMS = [
  {
    label: 'Inicio', ruta: '/',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    label: 'Quienes Somos', ruta: '/Quienes-Somos',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  {
    label: 'Recorrido', ruta: '/Recorrido',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/>
        <path d="M6 17V7a2 2 0 0 1 2-2h8"/>
        <polyline points="15 3 18 6 15 9"/>
      </svg>
    ),
  },
  {
    label: 'Tarifa', ruta: '/tarifa',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
        <line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ),
  },
  {
    label: 'Estaciones', ruta: '/estaciones',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M3 9h18M9 21V9"/>
      </svg>
    ),
  },
  {
    label: 'Contacto', ruta: '/Contacto',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
];

// Páginas que NO muestran la barra de nav (panel admin)
const RUTAS_SIN_NAV = ['/panel', '/panel/avisos', '/panel/estaciones', '/panel/trenes', '/panel/servicios'];

function NavBar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [hover, setHover] = useState(null);

  // Ocultar en el panel admin
  if (RUTAS_SIN_NAV.some(r => location.pathname.startsWith(r))) return null;

  return (
    <nav style={nav.bar}>
      <div style={nav.inner}>
        {NAV_ITEMS.map(item => {
          const activo = location.pathname === item.ruta;
          const hovering = hover === item.ruta;
          return (
            <button
              key={item.ruta}
              onClick={() => navigate(item.ruta)}
              onMouseEnter={() => setHover(item.ruta)}
              onMouseLeave={() => setHover(null)}
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

// ── BANNER DE SERVICIOS DINÁMICO ──────────────
function BannerServicios() {
  const [servicios, setServicios] = useState([]);
  const [cargando,  setCargando]  = useState(true);

  useEffect(() => {
    api.get('/servicios')
      .then(r => setServicios(r.data))
      .catch(() => setServicios([]))
      .finally(() => setCargando(false));
  }, []);

  if (!cargando && servicios.length === 0) {
    return (
      <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', padding:'0.85rem 1.5rem', background:'#F0FBF4', borderBottom:'1px solid #C8E6C9' }}>
        <span style={{ width:'10px', height:'10px', borderRadius:'50%', background: T.verde, boxShadow:`0 0 8px ${T.verde}88`, flexShrink:0, display:'inline-block', animation:'pulse 2.5s infinite' }}/>
        <span style={{ fontSize:'0.9rem', color:'#2E7D32', fontWeight:'500' }}>Servicio operando con normalidad en todas las estaciones</span>
      </div>
    );
  }

  if (!cargando && servicios.length === 1) {
    const srv = servicios[0];
    const cfg = getCfgServicio(srv.id_servicio);
    return (
      <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', padding:'0.85rem 1.5rem', background: cfg.bg, borderBottom:`1px solid ${cfg.borde}` }}>
        <span style={{ width:'10px', height:'10px', borderRadius:'50%', background: cfg.dot, flexShrink:0, display:'inline-block', animation:'pulse 2.5s infinite' }}/>
        <span style={{ fontSize:'0.9rem', color: cfg.color, fontWeight:'600' }}>{cfg.emoji} {srv.titulo}</span>
        {srv.descripcion && <span style={{ fontSize:'0.85rem', color: cfg.color, opacity:0.8 }}>— {srv.descripcion}</span>}
      </div>
    );
  }

  if (!cargando && servicios.length > 1) {
    return (
      <div style={{ borderBottom:'1px solid #E0E0E0' }}>
        {servicios.map(srv => {
          const cfg = getCfgServicio(srv.id_servicio);
          return (
            <div key={srv.id_servicio} style={{ display:'flex', alignItems:'flex-start', gap:'0.7rem', padding:'0.75rem 1.5rem', background: cfg.bg, borderBottom:`1px solid ${cfg.borde}` }}>
              <span style={{ width:'10px', height:'10px', borderRadius:'50%', background: cfg.dot, flexShrink:0, marginTop:'5px', display:'inline-block', animation:'pulse 2.5s infinite' }}/>
              <div>
                <div style={{ fontSize:'0.9rem', color: cfg.color, fontWeight:'700', lineHeight:1.3 }}>{cfg.emoji} {srv.titulo}</div>
                {srv.descripcion && <div style={{ fontSize:'0.82rem', color: cfg.color, opacity:0.8, marginTop:'1px' }}>{srv.descripcion}</div>}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', padding:'0.85rem 1.5rem', background:'#F8F8F8', borderBottom:'1px solid #E0E0E0' }}>
      <span style={{ width:'10px', height:'10px', borderRadius:'50%', background:'#CBD5E0', flexShrink:0, display:'inline-block' }}/>
      <span style={{ fontSize:'0.9rem', color: T.textMuted }}>Verificando estado del servicio...</span>
    </div>
  );
}

// ── PANTALLA DE INICIO ────────────────────────
function Inicio() {
  const navigate = useNavigate();
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
      setFecha(n.toLocaleDateString('es-AR', { weekday:'long', day:'2-digit', month:'long', year:'numeric' }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const secciones = [
    {
      label:'Tablero en Vivo', sub:'Próximos trenes · Tiempo real',
      desc:'Consultá cuándo llega el próximo tren a tu estación.',
      ruta:'/tablero', color:T.red, bgLight:T.redLight, borde:T.redBorde, stat:'Activo', statC:T.verde,
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    },
    {
      label:'Planificar Viaje', sub:'Horarios por rango horario',
      desc:'Buscá todos los trenes disponibles en el horario que necesitás.',
      ruta:'/planificar', color:T.blue, bgLight:T.blueLight, borde:T.blueBorde, stat:'Activo', statC:T.verde,
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    },
    {
      label:'Avisos del Servicio', sub:'Alertas y novedades activas',
      desc:'Informate sobre cancelaciones, demoras y cambios en el recorrido.',
      ruta:'/avisos', color:T.orange, bgLight:T.orangeLight, borde:T.orangeBorde, stat:'Ver avisos', statC:T.orange,
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    },
  ];

  return (
    <div style={s.root}>
      <header style={s.header} className="a1">
        <div style={s.headerInner}>
          <div style={s.logoWrap}>
            <div style={s.logoBox}>
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
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
          <div style={s.liveChip}>
            <span style={s.liveDot}/>
            <span style={s.liveTxt}>EN VIVO</span>
          </div>
        </div>
        <div style={s.headerLine}/>
      </header>

      <div style={s.relojZona} className="a2">
        <div style={s.relojFecha}>{fecha.charAt(0).toUpperCase() + fecha.slice(1)}</div>
        <div style={s.relojFila}>
          <span style={s.relojNum}>{hh}</span>
          <span style={{ ...s.relojColon, opacity: colon ? 1 : 0, transition:'opacity 0.1s' }}>:</span>
          <span style={s.relojNum}>{mm}</span>
        </div>
      </div>

      <BannerServicios/>

      <main style={s.main}>
        <div style={s.mainTitulo} className="a3">¿Qué querés hacer?</div>
        {secciones.map((sec, i) => {
          const on = hover === sec.ruta;
          return (
            <button
              key={sec.ruta}
              onClick={() => navigate(sec.ruta)}
              onMouseEnter={() => setHover(sec.ruta)}
              onMouseLeave={() => setHover(null)}
              className={`a${i + 3}`}
              style={{ ...s.card, borderColor: on ? sec.color : T.borde, boxShadow: on ? `0 4px 20px ${sec.color}25` : `0 2px 8px ${T.sombra}`, transform: on ? 'translateY(-2px)' : 'translateY(0)' }}
            >
              <div style={{ ...s.cardFranja, background: sec.color }}/>
              <div style={{ ...s.cardIconoWrap, background: sec.bgLight, color: sec.color }}>{sec.icon}</div>
              <div style={s.cardTextos}>
                <div style={{ ...s.cardLabel, color: T.textPri }}>{sec.label}</div>
                <div style={s.cardSub}>{sec.sub}</div>
                <div style={s.cardDesc}>{sec.desc}</div>
              </div>
              <div style={s.cardDerecha}>
                <div style={{ ...s.cardStat, color: sec.statC, background:`${sec.statC}15`, borderColor:`${sec.statC}44` }}>{sec.stat}</div>
                <div style={{ ...s.cardFlecha, color: sec.color }}>›</div>
              </div>
            </button>
          );
        })}
      </main>

      <footer style={s.footer} className="a6">
        <div style={s.footerLinea}/>
        <div style={s.footerTxt}>Belgrano Norte Online · 23 Estaciones · Buenos Aires</div>
        <div style={s.panelAccesoWrap}>
          <button
            onClick={() => navigate('/panel')}
            onMouseEnter={e => { e.currentTarget.style.background = T.slateLight; e.currentTarget.style.borderColor = T.slate; e.currentTarget.style.color = T.slate; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = T.slateBorde; e.currentTarget.style.color = T.textMuted; }}
            style={s.panelBtn}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Panel de operadores
          </button>
        </div>
      </footer>
    </div>
  );
}

// ── PLACEHOLDER para páginas aún no desarrolladas ──
function Proximamente({ titulo }) {
  const navigate = useNavigate();
  return (
    <div style={{ backgroundColor: T.bgPage, minHeight:'100vh', display:'flex', flexDirection:'column', fontFamily:"'Source Sans 3', sans-serif" }}>
      <header style={{ background: T.bgWhite, boxShadow:`0 2px 8px rgba(0,0,0,0.08)`, position:'sticky', top:0, zIndex:100 }}>
        <div style={{ display:'flex', alignItems:'center', padding:'1rem 1.5rem', maxWidth:'680px', margin:'0 auto', width:'100%', gap:'1rem' }}>
          <button onClick={() => navigate('/')} style={{ background: T.bgWhite, border:`2px solid ${T.borde}`, color: T.textSub, padding:'0.6rem 1rem', borderRadius:'8px', cursor:'pointer', fontSize:'0.95rem', fontWeight:'600', whiteSpace:'nowrap', minHeight:'44px' }}>← Volver</button>
          <div style={{ fontSize:'1.2rem', fontWeight:'700', fontFamily:"'Lora', serif", color: T.textPri }}>{titulo}</div>
        </div>
        <div style={{ height:'3px', background:`linear-gradient(90deg, ${T.red}, #E74C3C)` }}/>
      </header>
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'2rem', textAlign:'center', gap:'1rem' }}>
        <div style={{ fontSize:'4rem' }}>🚧</div>
        <div style={{ fontSize:'1.5rem', fontWeight:'700', fontFamily:"'Lora', serif", color: T.textPri }}>Próximamente</div>
        <div style={{ fontSize:'1rem', color: T.textSub, maxWidth:'280px', lineHeight:1.5 }}>Esta sección está en desarrollo. ¡Volvé pronto!</div>
        <button onClick={() => navigate('/')} style={{ marginTop:'1rem', background: T.red, color:'#fff', border:'none', borderRadius:'10px', padding:'0.85rem 2rem', fontSize:'1rem', fontWeight:'700', cursor:'pointer' }}>Ir al inicio</button>
      </div>
    </div>
  );
}

// ── APP ROOT ──────────────────────────────────
export default function App() {
  return (
    <>
      <GlobalStyles/>
      <BrowserRouter>
        <Routes>
          <Route path="/"                 element={<Inicio/>}                               />
          <Route path="/tablero"          element={<Tablero/>}                              />
          <Route path="/planificar"       element={<Planificar/>}                           />
          <Route path="/avisos"           element={<Avisos/>}                               />
          <Route path="/quienes-somos"    element={<QuienesSomos />}                        />
          <Route path="/recorrido"        element={<Recorrido/>}                            />
          <Route path="/tarifa"           element={<Tarifas/>}         />
          <Route path="/contacto"         element={<Contacto/>}       />
          <Route path="/estaciones"       element={<Proximamente titulo="Estaciones"/>}     />
          <Route path="/panel"            element={<PanelControl/>}                         />
          <Route path="/panel/avisos"     element={<AdminAvisos/>}                          />
          <Route path="/panel/estaciones" element={<AdminEstaciones/>}                      />
          <Route path="/panel/trenes"     element={<AdminTrenes/>}                          />
          <Route path="/panel/servicios"  element={<AdminServicios/>}                       />
          
        </Routes>
        <NavBar/>
      </BrowserRouter>
    </>
  );
}

// ── ESTILOS ───────────────────────────────────
const s = {
  root: { backgroundColor: T.bgPage, minHeight:'100vh', display:'flex', flexDirection:'column', paddingBottom:'0' },
  header: { background: T.bgWhite, boxShadow:`0 2px 8px ${T.sombra}`, position:'sticky', top:0, zIndex:100 },
  headerInner: { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'1rem 1.5rem', maxWidth:'680px', margin:'0 auto', width:'100%' },
  logoWrap:  { display:'flex', alignItems:'center', gap:'0.85rem' },
  logoBox: { width:'48px', height:'48px', display:'flex', alignItems:'center', justifyContent:'center', background:T.redLight, border:`2px solid ${T.redBorde}`, borderRadius:'12px', flexShrink:0 },
  logoNom: { fontSize:'1.25rem', fontWeight:'700', color:T.textPri, fontFamily:"'Lora', serif", lineHeight:1.1 },
  logoSub: { fontSize:'0.72rem', color:T.textSub, marginTop:'2px' },
  liveChip: { display:'flex', alignItems:'center', gap:'6px', background:'#FEF0F0', border:`1.5px solid ${T.redBorde}`, borderRadius:'20px', padding:'0.35rem 0.9rem' },
  liveDot: { width:'8px', height:'8px', borderRadius:'50%', backgroundColor:T.red, display:'inline-block', flexShrink:0, animation:'pulse 1.6s infinite' },
  liveTxt: { fontSize:'0.78rem', fontWeight:'700', color:T.red, letterSpacing:'0.05em' },
  headerLine: { height:'3px', background:`linear-gradient(90deg, ${T.red}, #E74C3C)` },
  relojZona: { textAlign:'center', padding:'2rem 1.5rem 1rem', background:T.bgWhite, borderBottom:`1px solid ${T.borde}` },
  relojFecha: { fontSize:'1rem', color:T.textSub, marginBottom:'0.4rem', fontFamily:"'Source Sans 3', sans-serif" },
  relojFila: { display:'flex', alignItems:'center', justifyContent:'center' },
  relojNum: { fontSize:'clamp(3.5rem, 16vw, 6rem)', fontWeight:'700', color:T.textPri, fontFamily:"'Lora', serif", letterSpacing:'-0.02em', lineHeight:1, fontVariantNumeric:'tabular-nums' },
  relojColon: { fontSize:'clamp(2.8rem, 13vw, 5rem)', fontWeight:'300', color:T.textSub, margin:'0 0.3rem', lineHeight:1 },
  main: { flex:1, display:'flex', flexDirection:'column', padding:'1.5rem', gap:'1rem', maxWidth:'680px', width:'100%', margin:'0 auto' },
  mainTitulo: { fontSize:'1.1rem', fontWeight:'600', color:T.textSub, letterSpacing:'0.01em' },
  card: { position:'relative', overflow:'hidden', display:'flex', alignItems:'center', gap:'1rem', background:T.bgCard, border:'2px solid', borderRadius:'16px', padding:'1.2rem 1.2rem 1.2rem 1rem', textAlign:'left', transition:'all 0.2s ease', minHeight:'96px', cursor:'pointer', width:'100%' },
  cardFranja: { position:'absolute', left:0, top:0, bottom:0, width:'5px' },
  cardIconoWrap: { width:'52px', height:'52px', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'12px', flexShrink:0 },
  cardTextos: { flex:1, minWidth:0 },
  cardLabel: { fontSize:'1.25rem', fontWeight:'700', fontFamily:"'Lora', serif", lineHeight:1.2, marginBottom:'0.2rem' },
  cardSub: { fontSize:'0.85rem', color:T.textSub, fontWeight:'500', marginBottom:'0.3rem' },
  cardDesc: { fontSize:'0.82rem', color:T.textMuted, lineHeight:1.4 },
  cardDerecha: { display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'0.5rem', flexShrink:0 },
  cardStat: { fontSize:'0.72rem', fontWeight:'700', border:'1.5px solid', borderRadius:'20px', padding:'3px 10px', whiteSpace:'nowrap' },
  cardFlecha: { fontSize:'2rem', fontWeight:'300', lineHeight:1 },
  footer: { padding:'1.5rem', maxWidth:'680px', width:'100%', margin:'0 auto' },
  footerLinea: { height:'1px', background:T.borde, marginBottom:'0.8rem' },
  footerTxt: { textAlign:'center', fontSize:'0.78rem', color:T.textMuted, marginBottom:'1rem' },
  panelAccesoWrap: { display:'flex', justifyContent:'center' },
  panelBtn: { display:'inline-flex', alignItems:'center', gap:'0.45rem', background:'transparent', border:`1.5px solid ${T.slateBorde}`, borderRadius:'20px', padding:'0.45rem 1.1rem', fontSize:'0.8rem', fontWeight:'600', color:T.textMuted, cursor:'pointer', transition:'all 0.2s ease', fontFamily:"'Source Sans 3', sans-serif" },
};
