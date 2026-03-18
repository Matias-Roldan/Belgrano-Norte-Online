// [ARCHIVO: AdminServicios.jsx] — AUDITADO ✓
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/belgrano';

const T = {
  bgPage:'#F0F2F5', bgWhite:'#FFFFFF',
  red:'#C0392B', redLight:'#FDECEA', redBorde:'#E8A09A',
  blue:'#1A6FAA', blueLight:'#EAF3FB',
  slate:'#2C3E50',
  verde:'#27AE60', verdeLight:'#EAF7EF', verdeBorde:'#A3D9B1',
  naranja:'#D35400', naranjaLight:'#FEF0E7', naranjaBorde:'#F0B080',
  textPri:'#1A1A1A', textSub:'#555555', textMuted:'#999999',
  borde:'#DDE1E7', sombra:'rgba(0,0,0,0.07)',
};

// [SEC-FIX] IDs válidos como Set — usados para validar datos de la API
const IDS_SERVICIO_VALIDOS = new Set([1, 2, 3]);

const PALETA_SERVICIO = {
  1: { color:'#27AE60', bg:'#EAF7EF', borde:'#A3D9B1' },
  2: { color:'#D35400', bg:'#FEF0E7', borde:'#F0B080' },
  3: { color:'#C0392B', bg:'#FDECEA', borde:'#E8A09A' },
};

function getCfg(id) {
  return PALETA_SERVICIO[id] || { color: T.textMuted, bg:'#F5F5F5', borde: T.borde };
}

// [SEC-FIX] SVG controlado por id_servicio — reemplaza emojis en PALETA y render
function IconoServicio({ id, size = 14 }) {
  const cfg = getCfg(id);
  if (id === 1) return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={cfg.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
  if (id === 2) return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={cfg.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  );
  if (id === 3) return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={cfg.color} aria-hidden="true">
      <circle cx="12" cy="12" r="10"/>
    </svg>
  );
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={T.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
    </svg>
  );
}

// [SEC-FIX] Sanitizar texto de API
function sanitizarTexto(str, max = 300) {
  if (typeof str !== 'string') return '';
  return str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim().slice(0, max);
}

// [SEC-FIX] Validar objeto servicio recibido de la API
function validarServicio(srv) {
  if (!srv || typeof srv !== 'object') return null;
  const id = parseInt(srv.id_servicio, 10);
  if (!Number.isInteger(id) || !IDS_SERVICIO_VALIDOS.has(id)) return null;
  return {
    id_servicio: id,
    titulo:      sanitizarTexto(srv.titulo || '', 120),
    descripcion: srv.descripcion ? sanitizarTexto(srv.descripcion, 500) : null,
    activo:      Number(srv.activo) === 1 ? 1 : 0,
  };
}

// ── SWITCH ────────────────────────────────────
function Switch({ activo, onChange, cargando }) {
  return (
    <button
      onClick={onChange}
      disabled={cargando}
      role="switch"
      aria-checked={activo}
      title={activo ? 'Activo — clic para desactivar' : 'Inactivo — clic para activar'}
      style={{ position:'relative', width:'44px', height:'24px', borderRadius:'12px', border:'none', cursor: cargando ? 'wait' : 'pointer', background: activo ? T.verde : '#CBD5E0', transition:'background 0.2s', flexShrink:0, opacity: cargando ? 0.6 : 1 }}
    >
      <span style={{ position:'absolute', top:'3px', left: activo ? '23px' : '3px', width:'18px', height:'18px', borderRadius:'50%', background:'#FFFFFF', transition:'left 0.2s', boxShadow:'0 1px 3px rgba(0,0,0,0.25)' }}/>
    </button>
  );
}

// ── BADGE DE SERVICIO ─────────────────────────
function Badge({ id, titulo }) {
  const cfg = getCfg(id);
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:'0.3rem', fontSize:'0.75rem', fontWeight:'700', color: cfg.color, background: cfg.bg, border:`1.5px solid ${cfg.borde}`, borderRadius:'20px', padding:'2px 9px', whiteSpace:'nowrap' }}>
      <IconoServicio id={id} size={11}/>
      {/* [SEC-FIX] titulo ya sanitizado en validarServicio() */}
      {titulo}
    </span>
  );
}

// ── TOAST ─────────────────────────────────────
function Toast({ msg, tipo, onClose }) {
  useEffect(() => {
    if (!msg) return;
    const id = setTimeout(onClose, 3500);
    return () => clearTimeout(id);
  }, [msg, onClose]);

  if (!msg) return null;
  const ok = tipo === 'ok';
  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{ position:'fixed', bottom:'1.5rem', right:'1.5rem', background: ok ? T.verdeLight : T.redLight, border:`2px solid ${ok ? T.verdeBorde : T.redBorde}`, borderRadius:'12px', padding:'1rem 1.4rem', display:'flex', alignItems:'center', gap:'0.7rem', boxShadow:'0 4px 20px rgba(0,0,0,0.12)', zIndex:9999, maxWidth:'360px' }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={ok ? T.verde : T.red} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {ok
          ? <><circle cx="12" cy="12" r="10"/><polyline points="20 6 9 17 4 12"/></>
          : <><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></>
        }
      </svg>
      {/* [SEC-FIX] msg como texto plano */}
      <span style={{ fontSize:'0.95rem', fontWeight:'600', color: ok ? T.verde : T.red, flex:1 }}>{msg}</span>
      <button onClick={onClose} aria-label="Cerrar notificación" style={{ background:'none', border:'none', cursor:'pointer', color: T.textMuted, display:'flex', alignItems:'center' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  );
}

// ── FILA DE SERVICIO ──────────────────────────
function FilaServicio({ srv, onToggle, toggling }) {
  const activo   = Number(srv.activo) === 1;
  const cfg      = getCfg(srv.id_servicio);
  const cargando = toggling === srv.id_servicio;

  return (
    <div style={{ display:'flex', alignItems:'flex-start', gap:'1rem', padding:'1rem 1.2rem', borderBottom:`1px solid ${T.borde}`, borderLeft:`4px solid ${activo ? cfg.color : T.borde}`, opacity: activo ? 1 : 0.55, transition:'opacity 0.2s, border-color 0.2s' }}>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'0.3rem', paddingTop:'2px', flexShrink:0, minWidth:'46px' }}>
        <Switch activo={activo} onChange={() => onToggle(srv)} cargando={cargando}/>
        <span style={{ fontSize:'0.7rem', color: activo ? T.verde : T.textMuted, fontWeight:'600' }}>
          {activo ? 'Activo' : 'Inactivo'}
        </span>
      </div>

      <div style={{ paddingTop:'3px', flexShrink:0 }}>
        <Badge id={srv.id_servicio} titulo={srv.titulo}/>
      </div>

      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.4rem', fontSize:'0.97rem', fontWeight:'700', fontFamily:"'Lora', serif", color: activo ? T.textPri : T.textMuted, marginBottom:'0.25rem', lineHeight:1.3 }}>
          <IconoServicio id={srv.id_servicio} size={14}/>
          {/* [SEC-FIX] titulo y descripcion ya sanitizados */}
          {srv.titulo}
        </div>
        {srv.descripcion && (
          <div style={{ fontSize:'0.85rem', color: T.textSub, lineHeight:1.5 }}>
            {srv.descripcion}
          </div>
        )}
      </div>
    </div>
  );
}

// ── PÁGINA PRINCIPAL ──────────────────────────
export default function AdminServicios() {
  const navigate = useNavigate();
  const [servicios, setServicios] = useState([]);
  const [cargando,  setCargando]  = useState(true);
  const [toggling,  setToggling]  = useState(null);
  const [toast,     setToast]     = useState({ msg:'', tipo:'ok' });

  const mostrar = (msg, tipo = 'ok') => setToast({ msg, tipo });

  // [SEC-FIX] Manejar 401/403 redirigiendo al login
  const manejarErrorAuth = (status) => {
    if (status === 401 || status === 403) {
      sessionStorage.removeItem('panel_token');
      navigate('/panel');
    }
  };

  // [SEC-FIX] Verificar token al montar
  useEffect(() => {
    const token = sessionStorage.getItem('panel_token');
    if (!token) { navigate('/panel'); return; }
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }, [navigate]);

  const cargar = () => {
    setCargando(true);
    api.get('/panel/servicios')
      .then(r => {
        // [SEC-FIX] Validar y sanitizar servicios recibidos de la API
        const data = Array.isArray(r.data) ? r.data : [];
        setServicios(data.map(validarServicio).filter(Boolean));
      })
      .catch(err => {
        manejarErrorAuth(err?.response?.status);
        mostrar('Error al cargar los servicios', 'error');
      })
      .finally(() => setCargando(false));
  };

  useEffect(() => { cargar(); }, []);

  const toggleServicio = async (srv) => {
    // [SEC-FIX] Validar que el id está en la allowlist antes de operar
    const id = parseInt(srv.id_servicio, 10);
    if (!IDS_SERVICIO_VALIDOS.has(id)) return;

    const nuevoActivo = Number(srv.activo) === 1 ? 0 : 1;
    setToggling(id);

    // Optimistic update
    setServicios(prev => prev.map(s =>
      s.id_servicio === id ? { ...s, activo: nuevoActivo } : s
    ));

    try {
      await api.patch(`/panel/servicios/${id}`, { activo: nuevoActivo });
      // [SEC-FIX] Mensaje con texto controlado — título ya sanitizado en validarServicio()
      mostrar(nuevoActivo === 1
        ? `Servicio "${srv.titulo}" activado`
        : `Servicio "${srv.titulo}" desactivado`
      );
    } catch (err) {
      // Revertir si falla
      setServicios(prev => prev.map(s =>
        s.id_servicio === id ? { ...s, activo: srv.activo } : s
      ));
      manejarErrorAuth(err?.response?.status);
      mostrar('Error al actualizar el servicio', 'error');
    } finally {
      setToggling(null);
    }
  };

  const activos   = servicios.filter(s => Number(s.activo) === 1);
  const inactivos = servicios.filter(s => Number(s.activo) === 0);

  return (
    <div style={s.root}>
      <header style={s.header}>
        <div style={s.headerInner}>
          <button onClick={() => navigate('/panel')} style={s.btnVolver} aria-label="Volver al panel">← Panel</button>
          <div style={s.headerCentro}>
            <div style={s.headerTitulo}>Estado del Servicio</div>
            <div style={s.headerSub}>Administración de servicios</div>
          </div>
          <div style={{ width:'60px' }}/>
        </div>
        <div style={{ height:'3px', background:`linear-gradient(90deg, ${T.verde}, #2ECC71)` }}/>
      </header>

      <main style={s.main}>
        <div style={s.seccion}>

          <div style={{ ...s.seccionHeader, borderTop:`4px solid ${T.slate}` }}>
            {/* [SEC-FIX] SVG en lugar de emoji ⚙️ */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={T.slate} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
            </svg>
            <div style={{ flex:1 }}>
              <div style={s.seccionTitulo}>Servicios disponibles</div>
              <div style={s.seccionSub}>
                <span style={{ color: T.verde, fontWeight:'700' }}>{activos.length} activos</span>
                {' · '}
                <span style={{ color: T.textMuted }}>{inactivos.length} inactivos</span>
                {' · '}
                {servicios.length} total
              </div>
            </div>
            <button onClick={cargar} style={s.btnRefresh} aria-label="Actualizar lista de servicios">
              ↻ Actualizar
            </button>
          </div>

          <div style={s.leyenda}>
            <span style={s.leyItem}><span style={{ ...s.leyDot, background: T.verde }}/> Activo — visible en la app</span>
            <span style={s.leyItem}><span style={{ ...s.leyDot, background: '#CBD5E0' }}/> Inactivo — no se muestra</span>
          </div>

          <div role="list" aria-label="Lista de servicios">
            {cargando && <div style={s.cargando} aria-live="polite">Cargando servicios...</div>}

            {!cargando && servicios.length === 0 && (
              <div style={s.vacio}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={T.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ marginBottom:'0.5rem' }}>
                  <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
                </svg>
                <div style={{ fontWeight:'600', color: T.textSub }}>No hay servicios configurados</div>
              </div>
            )}

            {!cargando && servicios.length > 0 && (
              <>
                {activos.map(srv => (
                  <FilaServicio key={srv.id_servicio} srv={srv} onToggle={toggleServicio} toggling={toggling}/>
                ))}

                {inactivos.length > 0 && activos.length > 0 && (
                  <div style={s.separador} role="separator">
                    <div style={s.separadorLinea}/>
                    <span style={s.separadorTxt}>Servicios inactivos ({inactivos.length})</span>
                    <div style={s.separadorLinea}/>
                  </div>
                )}

                {inactivos.map(srv => (
                  <FilaServicio key={srv.id_servicio} srv={srv} onToggle={toggleServicio} toggling={toggling}/>
                ))}
              </>
            )}
          </div>

        </div>
      </main>

      <Toast msg={toast.msg} tipo={toast.tipo} onClose={() => setToast({ msg:'', tipo:'ok' })}/>
    </div>
  );
}

const s = {
  root: { backgroundColor: T.bgPage, minHeight:'100vh', fontFamily:"'Source Sans 3', sans-serif", color: T.textPri },
  header: { background: T.bgWhite, boxShadow:`0 2px 8px ${T.sombra}`, position:'sticky', top:0, zIndex:100 },
  headerInner: { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'1rem 1.5rem', maxWidth:'760px', margin:'0 auto', width:'100%' },
  btnVolver: { background: T.bgWhite, border:`2px solid ${T.borde}`, color: T.textSub, padding:'0.6rem 1rem', borderRadius:'8px', cursor:'pointer', fontSize:'0.95rem', fontWeight:'600', whiteSpace:'nowrap', minHeight:'44px' },
  headerCentro: { textAlign:'center' },
  headerTitulo: { fontSize:'1.3rem', fontWeight:'700', color: T.textPri, fontFamily:"'Lora', serif", lineHeight:1.1 },
  headerSub:    { fontSize:'0.75rem', color: T.textSub, marginTop:'2px' },
  main: { maxWidth:'760px', margin:'0 auto', padding:'1.5rem' },
  seccion: { background: T.bgWhite, border:`1.5px solid ${T.borde}`, borderRadius:'16px', overflow:'hidden' },
  seccionHeader: { display:'flex', alignItems:'center', gap:'0.8rem', padding:'1.1rem 1.4rem', borderBottom:`1px solid ${T.borde}`, background:'#FAFAFA' },
  seccionTitulo: { fontSize:'1.05rem', fontWeight:'700', fontFamily:"'Lora', serif", color: T.textPri },
  seccionSub:    { fontSize:'0.8rem', color: T.textSub, marginTop:'1px' },
  btnRefresh: { background: T.bgWhite, border:`1.5px solid ${T.borde}`, color: T.textSub, padding:'0.4rem 0.9rem', borderRadius:'8px', cursor:'pointer', fontSize:'0.85rem', fontWeight:'600', flexShrink:0 },
  leyenda: { display:'flex', alignItems:'center', gap:'1rem', flexWrap:'wrap', padding:'0.7rem 1.4rem', borderBottom:`1px solid ${T.borde}`, background:'#FDFDFD' },
  leyItem: { display:'flex', alignItems:'center', gap:'0.4rem', fontSize:'0.8rem', color: T.textSub },
  leyDot:  { width:'10px', height:'10px', borderRadius:'50%', flexShrink:0, display:'inline-block' },
  separador: { display:'flex', alignItems:'center', gap:'0.8rem', padding:'0.8rem 1.2rem' },
  separadorLinea: { flex:1, height:'1px', background: T.borde },
  separadorTxt: { fontSize:'0.75rem', color: T.textMuted, fontWeight:'600', whiteSpace:'nowrap' },
  cargando: { textAlign:'center', padding:'2.5rem', color: T.textMuted },
  vacio:    { textAlign:'center', padding:'3rem 1rem', display:'flex', flexDirection:'column', alignItems:'center' },
};