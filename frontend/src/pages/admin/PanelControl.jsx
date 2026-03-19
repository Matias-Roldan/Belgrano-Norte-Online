// [ARCHIVO: PanelControl.jsx] — AUDITADO ✓
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/belgrano';

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

// [SEC-FIX] Rutas del panel en allowlist — igual que en App.jsx
const RUTAS_PANEL_VALIDAS = new Set([
  '/panel/avisos', '/panel/estaciones', '/panel/trenes', '/panel/servicios',
]);

const SECCIONES = [
  {
    ruta: '/panel/avisos',
    label: 'Avisos del Servicio',
    sub: 'Publicar · Editar · Desactivar',
    desc: 'Creá nuevos avisos y administrá los activos. Críticos, advertencias e informativos.',
    color: T.naranja, bgLight: T.naranjaLight, borde: T.naranjaBorde,
    icono: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
        <path d="M9 12l2 2 4-4"/>
      </svg>
    ),
  },
];

// ── PANTALLA DE LOGIN ─────────────────────────
// [SEC-FIX] El panel ahora requiere autenticación antes de mostrarse.
// Sin esto, cualquier usuario que sepa la URL /panel tiene acceso total.
function LoginPanel({ onLoginExitoso }) {
  const [usuario,  setUsuario]  = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [cargando, setCargando] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // [SEC-FIX] Validación básica en cliente antes de enviar
    if (!usuario.trim() || !password) {
      setError('Ingresá usuario y contraseña');
      return;
    }
    if (usuario.length > 80 || password.length > 128) {
      setError('Datos inválidos');
      return;
    }

    setCargando(true);
    try {
      const res = await api.post('/auth/login', { usuario: usuario.trim(), password });
      const { token } = res.data;

      // [SEC-FIX] Guardar token en sessionStorage (no localStorage).
      // sessionStorage se limpia al cerrar el tab — más seguro que localStorage
      // para credenciales de sesión corta.
      // Lo ideal a futuro: httpOnly cookie gestionada por el servidor.
      sessionStorage.setItem('panel_token', token);

      // [SEC-FIX] Configurar el token en todas las requests futuras de axios
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      onLoginExitoso();
    } catch (err) {
      // [SEC-FIX] Mensaje genérico — no revelar si falló usuario o password
      setError('Credenciales incorrectas');
      // Limpiar el campo de password tras error
      setPassword('');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ backgroundColor: T.bgPage, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Source Sans 3', sans-serif" }}>
      <div style={{ background: T.bgWhite, border: `1.5px solid ${T.borde}`, borderRadius: '16px', padding: '2rem 2rem 1.8rem', width: '100%', maxWidth: '360px', boxShadow: `0 4px 24px ${T.sombra}` }}>
        
        <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
          <div style={{ width: '52px', height: '52px', background: T.redLight, border: `2px solid ${T.redBorde}`, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={T.red} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: '700', fontFamily: "'Lora', serif", color: T.textPri }}>Panel de Control</div>
          <div style={{ fontSize: '0.8rem', color: T.textMuted, marginTop: '3px' }}>Belgrano Norte · Solo operadores</div>
        </div>

        {/* [SEC-FIX] onSubmit en el form para soportar Enter y accesibilidad */}
        <form onSubmit={handleLogin} noValidate>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: T.textSub, marginBottom: '5px' }} htmlFor="usuario">
              Usuario
            </label>
            <input
              id="usuario"
              type="text"
              value={usuario}
              onChange={e => setUsuario(e.target.value)}
              autoComplete="username"
              maxLength={80}
              disabled={cargando}
              style={{ width: '100%', padding: '0.7rem 0.9rem', border: `1.5px solid ${T.borde}`, borderRadius: '8px', fontSize: '0.95rem', fontFamily: "'Source Sans 3', sans-serif", outline: 'none', color: T.textPri, background: T.bgWhite }}
            />
          </div>

          <div style={{ marginBottom: '1.4rem' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: T.textSub, marginBottom: '5px' }} htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              maxLength={128}
              disabled={cargando}
              style={{ width: '100%', padding: '0.7rem 0.9rem', border: `1.5px solid ${T.borde}`, borderRadius: '8px', fontSize: '0.95rem', fontFamily: "'Source Sans 3', sans-serif", outline: 'none', color: T.textPri, background: T.bgWhite }}
            />
          </div>

          {/* [SEC-FIX] Mensaje de error genérico — sin distinguir usuario/password */}
          {error && (
            <div role="alert" style={{ background: T.redLight, border: `1px solid ${T.redBorde}`, borderRadius: '8px', padding: '0.65rem 0.9rem', fontSize: '0.85rem', color: T.red, marginBottom: '1rem', fontWeight: '500' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={cargando}
            style={{ width: '100%', background: T.red, color: '#fff', border: 'none', borderRadius: '10px', padding: '0.85rem', fontSize: '1rem', fontWeight: '700', cursor: cargando ? 'not-allowed' : 'pointer', opacity: cargando ? 0.7 : 1, fontFamily: "'Source Sans 3', sans-serif", transition: 'opacity 0.15s' }}
          >
            {cargando ? 'Verificando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── PANEL PRINCIPAL ───────────────────────────
function PanelDashboard({ onCerrarSesion }) {
  const navigate = useNavigate();
  const [hover, setHover] = useState(null);
  const [hora,  setHora]  = useState('');
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

  // [SEC-FIX] Navegación segura — solo rutas del panel permitidas
  const irA = (ruta) => {
    if (RUTAS_PANEL_VALIDAS.has(ruta)) navigate(ruta);
  };

  return (
    <div style={s.root}>
      <header style={s.header}>
        <div style={s.headerInner}>
          <button onClick={() => navigate('/')} style={s.btnVolver} aria-label="Volver al inicio">← Volver</button>
          <div style={s.headerCentro}>
            <div style={s.headerTitulo}>Panel de Control</div>
            <div style={s.headerSub}>Belgrano Norte · Solo operadores</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={s.horaChip} aria-label={`Hora actual: ${hora}`}>{hora}</div>
            {/* [SEC-FIX] Botón de cierre de sesión explícito */}
            <button
              onClick={onCerrarSesion}
              title="Cerrar sesión"
              aria-label="Cerrar sesión"
              style={{ background: 'transparent', border: `1.5px solid ${T.borde}`, borderRadius: '8px', padding: '0.45rem 0.7rem', cursor: 'pointer', color: T.textMuted, fontSize: '0.8rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Salir
            </button>
          </div>
        </div>
        <div style={s.headerLine}/>
      </header>

      <main style={s.main}>
        <div style={s.avisoAdmin} role="note">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.amarillo} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
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
              onClick={() => irA(sec.ruta)}
              onMouseEnter={() => setHover(sec.ruta)}
              onMouseLeave={() => setHover(null)}
              aria-label={`Ir a ${sec.label}`}
              style={{
                ...s.card,
                borderColor: on ? sec.color : T.borde,
                transform:   on ? 'translateY(-2px)' : 'translateY(0)',
                boxShadow:   on ? `0 6px 24px ${sec.color}22` : `0 2px 8px ${T.sombra}`,
              }}
            >
              <div style={{ ...s.cardFranja, background: sec.color }} aria-hidden="true"/>
              <div style={{ ...s.cardIcono, background: sec.bgLight, color: sec.color }} aria-hidden="true">{sec.icono}</div>
              <div style={s.cardTextos}>
                <div style={s.cardLabel}>{sec.label}</div>
                <div style={s.cardSub}>{sec.sub}</div>
                <div style={s.cardDesc}>{sec.desc}</div>
              </div>
              <div style={{ ...s.cardFlecha, color: sec.color }} aria-hidden="true">›</div>
            </button>
          );
        })}
      </main>
    </div>
  );
}

// ── COMPONENTE RAÍZ DEL PANEL ─────────────────
export default function PanelControl() {
  // [SEC-FIX] Verificar si ya hay sesión activa al montar el componente
  const [autenticado, setAutenticado] = useState(() => {
    const token = sessionStorage.getItem('panel_token');
    if (!token) return false;
    // Verificar que el token no esté vencido (decodificación básica del payload)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        sessionStorage.removeItem('panel_token');
        return false;
      }
      // Restaurar el header de Authorization para requests existentes
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return true;
    } catch {
      sessionStorage.removeItem('panel_token');
      return false;
    }
  });

  const handleLoginExitoso = () => setAutenticado(true);

  const handleCerrarSesion = () => {
    // [SEC-FIX] Limpiar token y header al cerrar sesión
    sessionStorage.removeItem('panel_token');
    delete api.defaults.headers.common['Authorization'];
    setAutenticado(false);
  };

  if (!autenticado) {
    return <LoginPanel onLoginExitoso={handleLoginExitoso} />;
  }

  return <PanelDashboard onCerrarSesion={handleCerrarSesion} />;
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