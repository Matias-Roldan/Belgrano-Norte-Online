// [ARCHIVO: AdminEstaciones.jsx] — AUDITADO ✓
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/belgrano';

const T = {
  bgPage:'#F0F2F5', bgWhite:'#FFFFFF',
  blue:'#1A6FAA', blueLight:'#EAF3FB', blueBorde:'#9AC4E2',
  slate:'#2C3E50',
  red:'#C0392B', redLight:'#FDECEA', redBorde:'#E8A09A',
  verde:'#27AE60', verdeLight:'#EAF7EF', verdeBorde:'#A3D9B1',
  naranja:'#D35400', naranjaLight:'#FEF0E7', naranjaBorde:'#F0B080',
  textPri:'#1A1A1A', textSub:'#555555', textMuted:'#999999',
  borde:'#DDE1E7', sombra:'rgba(0,0,0,0.07)',
};

const PALETA = [
  { color:'#27AE60', bg:'#EAF7EF', borde:'#A3D9B1' },
  { color:'#D35400', bg:'#FEF0E7', borde:'#F0B080' },
  { color:'#C0392B', bg:'#FDECEA', borde:'#E8A09A' },
  { color:'#1A6FAA', bg:'#EAF3FB', borde:'#9AC4E2' },
];

// [SEC-FIX] Iconos SVG en lugar de emojis en PALETA y en el render.
// Emojis mezclados con datos externos pueden causar confusión visual.
function IconoEstado({ idx, size = 14 }) {
  const color = PALETA[idx]?.color || PALETA[0].color;
  if (idx === 0) return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
  if (idx === 1) return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  );
  if (idx === 2) return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
      <circle cx="12" cy="12" r="10"/>
    </svg>
  );
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );
}

function getCfg(estados, id) {
  const idx = estados.findIndex(e => Number(e.id_estado_estacion) === Number(id));
  return { ...(PALETA[idx >= 0 ? idx : 0]), idx: idx >= 0 ? idx : 0 };
}

// [SEC-FIX] Sanitizar texto de API — elimina caracteres de control
function sanitizarTexto(str, max = 200) {
  if (typeof str !== 'string') return '';
  return str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim().slice(0, max);
}

// [SEC-FIX] Validar objeto estado recibido de la API
function validarEstado(e) {
  if (!e || typeof e !== 'object') return null;
  const id = parseInt(e.id_estado_estacion, 10);
  if (!Number.isInteger(id) || id <= 0) return null;
  return {
    id_estado_estacion: id,
    descripcion: sanitizarTexto(e.descripcion || '', 80),
  };
}

// [SEC-FIX] Validar objeto estación recibido de la API
function validarEstacion(e, estadosValidos) {
  if (!e || typeof e !== 'object') return null;
  const id = parseInt(e.id_estacion, 10);
  if (!Number.isInteger(id) || id <= 0) return null;
  const idEstado = parseInt(e.id_estado_estacion, 10);
  const estadoFinal = estadosValidos.has(idEstado) ? idEstado : estadosValidos.values().next().value;
  return {
    id_estacion:        id,
    nombre_estacion:    sanitizarTexto(e.nombre_estacion || '', 100),
    id_estado_estacion: estadoFinal,
  };
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
      {/* [SEC-FIX] msg como texto plano — nunca dangerouslySetInnerHTML */}
      <span style={{ fontSize:'0.95rem', fontWeight:'600', color: ok ? T.verde : T.red, flex:1 }}>{msg}</span>
      <button onClick={onClose} aria-label="Cerrar notificación" style={{ background:'none', border:'none', cursor:'pointer', color: T.textMuted, display:'flex', alignItems:'center' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  );
}

// ── DROPDOWN INLINE POR FILA ──────────────────
function DropEstado({ idEstacion, idEstadoActual, estados, onActualizar }) {
  const [open,      setOpen]      = useState(false);
  const [guardando, setGuardando] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  // [SEC-FIX] Cerrar con Escape
  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open]);

  const cambiar = async (nuevoId) => {
    // [SEC-FIX] Validar que el nuevo estado existe en la lista recibida del servidor
    const idNuevo  = parseInt(nuevoId, 10);
    const idActual = parseInt(idEstadoActual, 10);
    const idEst    = parseInt(idEstacion, 10);

    if (!Number.isInteger(idNuevo) || idNuevo <= 0) return;
    if (!Number.isInteger(idEst)   || idEst <= 0)   return;
    if (!estados.some(e => e.id_estado_estacion === idNuevo)) return; // no está en la lista del servidor
    if (idNuevo === idActual) { setOpen(false); return; }

    setOpen(false);
    setGuardando(true);
    try {
      await api.put('/panel/estaciones/estado', {
        id_estacion:  idEst,
        nuevo_estado: idNuevo,
      });
      onActualizar(idEstacion, idNuevo, true);
    } catch (err) {
      // [SEC-FIX] Manejar 401/403 — redirigir al login
      onActualizar(idEstacion, idEstadoActual, false, err?.response?.status);
    } finally {
      setGuardando(false);
    }
  };

  const cfg       = getCfg(estados, idEstadoActual);
  const estActual = estados.find(e => e.id_estado_estacion === parseInt(idEstadoActual, 10));

  return (
    <div ref={ref} style={{ position:'relative' }}>
      <button
        onClick={() => !guardando && setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Estado actual: ${estActual?.descripcion ?? '—'}. Clic para cambiar`}
        style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem', fontSize:'0.8rem', fontWeight:'700', color: guardando ? T.textMuted : cfg.color, background: guardando ? '#F5F5F5' : cfg.bg, border:`1.5px solid ${guardando ? T.borde : cfg.borde}`, borderRadius:'20px', padding:'5px 12px', cursor: guardando ? 'wait' : 'pointer', transition:'all 0.15s', whiteSpace:'nowrap' }}
      >
        {guardando ? (
          <>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>Guardando...</span>
          </>
        ) : (
          <>
            <IconoEstado idx={cfg.idx} size={12}/>
            {/* [SEC-FIX] descripcion ya sanitizada en validarEstado() */}
            <span>{estActual?.descripcion ?? '—'}</span>
            <span style={{ fontSize:'0.65rem', opacity:0.6 }}>▼</span>
          </>
        )}
      </button>

      {open && (
        <div role="listbox" style={{ position:'absolute', top:'calc(100% + 4px)', right:0, background: T.bgWhite, border:`2px solid ${T.blue}`, borderRadius:'10px', zIndex:300, minWidth:'190px', boxShadow:'0 8px 24px rgba(0,0,0,0.13)', overflow:'hidden' }}>
          {estados.map(est => {
            const on = est.id_estado_estacion === parseInt(idEstadoActual, 10);
            const c  = getCfg(estados, est.id_estado_estacion);
            return (
              <div
                key={est.id_estado_estacion}
                role="option"
                aria-selected={on}
                onClick={() => cambiar(est.id_estado_estacion)}
                style={{ padding:'0.8rem 1rem', cursor:'pointer', fontSize:'0.92rem', fontWeight: on ? '700' : '400', color: on ? c.color : T.textPri, background: on ? c.bg : T.bgWhite, borderBottom:`1px solid ${T.borde}`, borderLeft:`3px solid ${on ? c.color : 'transparent'}`, display:'flex', alignItems:'center', gap:'0.5rem' }}
                onMouseEnter={e => { if (!on) e.currentTarget.style.background = '#F8F8F8'; }}
                onMouseLeave={e => { if (!on) e.currentTarget.style.background = T.bgWhite; }}
              >
                <IconoEstado idx={c.idx} size={14}/>
                <span>{est.descripcion}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── PÁGINA PRINCIPAL ──────────────────────────
export default function AdminEstaciones() {
  const navigate = useNavigate();

  const [estaciones, setEstaciones] = useState([]);
  const [estados,    setEstados]    = useState([]);
  const [cargando,   setCargando]   = useState(true);
  const [filtro,     setFiltro]     = useState('');
  const [toast,      setToast]      = useState({ msg:'', tipo:'ok' });

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
    Promise.all([
      api.get('/estaciones'),
      api.get('/panel/estados-estacion'),
    ])
      .then(([resEst, resEstados]) => {
        // [SEC-FIX] Validar y sanitizar estados
        const estadosData   = Array.isArray(resEstados.data) ? resEstados.data : [];
        const estadosLimpios = estadosData.map(validarEstado).filter(Boolean).slice(0, 20);
        setEstados(estadosLimpios);

        // [SEC-FIX] Construir Set de IDs de estados válidos para validar estaciones
        const estadosValidos = new Set(estadosLimpios.map(e => e.id_estado_estacion));
        const primerEstado   = estadosLimpios[0]?.id_estado_estacion;
        if (primerEstado) estadosValidos.add(primerEstado);

        // [SEC-FIX] Validar y sanitizar estaciones
        const estData    = Array.isArray(resEst.data) ? resEst.data : [];
        const estLimpias = estData.map(e => {
          const validada = validarEstacion(e, estadosValidos);
          if (!validada) return null;
          return {
            ...validada,
            id_estado_estacion: validada.id_estado_estacion ?? primerEstado ?? 1,
          };
        }).filter(Boolean);

        setEstaciones(estLimpias);
      })
      .catch(err => {
        manejarErrorAuth(err?.response?.status);
        mostrar('Error al cargar los datos', 'error');
      })
      .finally(() => setCargando(false));
  };

  useEffect(() => { cargar(); }, []);

  const onActualizar = (id, nuevoIdEstado, ok, status) => {
    if (!ok) {
      manejarErrorAuth(status);
      mostrar('Error al actualizar el estado', 'error');
      return;
    }
    setEstaciones(prev => prev.map(e =>
      e.id_estacion === parseInt(id, 10)
        ? { ...e, id_estado_estacion: parseInt(nuevoIdEstado, 10) }
        : e
    ));
    // [SEC-FIX] descripcion ya viene sanitizada de validarEstado()
    const desc = estados.find(e => e.id_estado_estacion === parseInt(nuevoIdEstado, 10))?.descripcion || '';
    mostrar(`Estado actualizado: ${desc}`);
  };

  // [SEC-FIX] Sanitizar el filtro de búsqueda antes de usarlo en comparación
  const filtroLimpio = filtro.replace(/[\x00-\x1F\x7F]/g, '').slice(0, 100);
  const filtradas    = estaciones.filter(e =>
    e.nombre_estacion.toLowerCase().includes(filtroLimpio.toLowerCase())
  );

  return (
    <div style={s.root}>
      <header style={s.header}>
        <div style={s.headerInner}>
          <button onClick={() => navigate('/panel')} style={s.btnVolver} aria-label="Volver al panel">← Panel</button>
          <div style={s.headerCentro}>
            <div style={s.headerTitulo}>Estaciones</div>
            <div style={s.headerSub}>Estado operativo · {estaciones.length} estaciones</div>
          </div>
          <div style={{ width:'60px' }}/>
        </div>
        <div style={{ height:'3px', background:`linear-gradient(90deg, ${T.blue}, #2980B9)` }}/>
      </header>

      <main style={s.main}>

        <div style={s.toolbar}>
          {/* [SEC-FIX] Buscador sin emoji en placeholder — evita encoding issues */}
          <input
            value={filtro}
            onChange={e => setFiltro(e.target.value)}
            placeholder="Buscar estación..."
            maxLength={100}
            aria-label="Buscar estación por nombre"
            style={s.buscador}
          />
          <button onClick={cargar} style={s.btnRefresh} aria-label="Actualizar lista de estaciones">
            ↻ Actualizar
          </button>
        </div>

        {/* Leyenda dinámica */}
        {estados.length > 0 && (
          <div style={s.leyenda} role="list" aria-label="Leyenda de estados">
            {estados.map(est => {
              const cfg = getCfg(estados, est.id_estado_estacion);
              return (
                <span key={est.id_estado_estacion} style={s.leyItem} role="listitem">
                  <span style={{ ...s.leyDot, background: cfg.color }} aria-hidden="true"/>
                  {/* [SEC-FIX] descripcion ya sanitizada */}
                  {est.descripcion}
                </span>
              );
            })}
          </div>
        )}

        <div style={s.lista} role="list" aria-label="Lista de estaciones">
          {cargando && <div style={s.cargando} aria-live="polite">Cargando estaciones...</div>}

          {!cargando && filtradas.length === 0 && filtro && (
            <div style={s.vacio}>
              {/* [SEC-FIX] filtro renderizado como texto plano */}
              No hay estaciones que coincidan con "{filtroLimpio}"
            </div>
          )}

          {!cargando && filtradas.map((est, i) => {
            const cfg = getCfg(estados, est.id_estado_estacion);
            return (
              <div
                key={est.id_estacion}
                role="listitem"
                style={{ ...s.fila, background: i % 2 === 0 ? T.bgWhite : '#FAFAFA', borderLeft:`4px solid ${cfg.color}` }}
              >
                <div style={s.filaNum} aria-label={`ID estación ${est.id_estacion}`}>
                  {est.id_estacion}
                </div>

                <div style={s.filaNombre}>
                  {/* [SEC-FIX] SVG en lugar de emoji 🚉 */}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="2" y="7" width="20" height="12" rx="2"/>
                    <circle cx="7" cy="19" r="2"/><circle cx="17" cy="19" r="2"/>
                    <path d="M2 12h20M7 7V4M17 7V4"/>
                  </svg>
                  {/* [SEC-FIX] nombre_estacion ya sanitizado en validarEstacion() */}
                  <span style={s.filaNombreTxt}>{est.nombre_estacion}</span>
                </div>

                <div style={s.filaAccion}>
                  <DropEstado
                    idEstacion={est.id_estacion}
                    idEstadoActual={est.id_estado_estacion}
                    estados={estados}
                    onActualizar={onActualizar}
                  />
                </div>
              </div>
            );
          })}
        </div>

      </main>

      <Toast msg={toast.msg} tipo={toast.tipo} onClose={() => setToast({ msg:'', tipo:'ok' })}/>
    </div>
  );
}

const s = {
  root: { backgroundColor: T.bgPage, minHeight:'100vh', fontFamily:"'Source Sans 3', sans-serif", color: T.textPri },
  header: { background: T.bgWhite, boxShadow:`0 2px 8px ${T.sombra}`, position:'sticky', top:0, zIndex:100 },
  headerInner: { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'1rem 1.5rem', maxWidth:'720px', margin:'0 auto', width:'100%' },
  btnVolver: { background: T.bgWhite, border:`2px solid ${T.borde}`, color: T.textSub, padding:'0.6rem 1rem', borderRadius:'8px', cursor:'pointer', fontSize:'0.95rem', fontWeight:'600', whiteSpace:'nowrap', minHeight:'44px', flexShrink:0 },
  headerCentro: { textAlign:'center', flex:1, minWidth:0 },
  headerTitulo: { fontSize:'1.3rem', fontWeight:'700', color: T.textPri, fontFamily:"'Lora', serif", lineHeight:1.1 },
  headerSub:    { fontSize:'0.75rem', color: T.textSub, marginTop:'2px' },
  main: { maxWidth:'720px', margin:'0 auto', padding:'1.5rem', display:'flex', flexDirection:'column', gap:'1rem' },
  toolbar: { display:'flex', gap:'0.8rem', alignItems:'center' },
  buscador: { flex:1, background: T.bgWhite, border:`2px solid ${T.borde}`, borderRadius:'10px', padding:'0.8rem 1rem', fontSize:'1rem', outline:'none', fontFamily:"'Source Sans 3', sans-serif", color: T.textPri },
  btnRefresh: { background: T.bgWhite, border:`1.5px solid ${T.borde}`, color: T.textSub, padding:'0.8rem 1rem', borderRadius:'10px', cursor:'pointer', fontSize:'0.9rem', fontWeight:'600', whiteSpace:'nowrap' },
  leyenda: { display:'flex', gap:'1.2rem', flexWrap:'wrap' },
  leyItem: { display:'flex', alignItems:'center', gap:'0.4rem', fontSize:'0.85rem', color: T.textSub },
  leyDot:  { width:'10px', height:'10px', borderRadius:'50%', flexShrink:0, display:'inline-block' },
  lista: { background: T.bgWhite, border:`1.5px solid ${T.borde}`, borderRadius:'16px', overflow:'hidden' },
  cargando: { textAlign:'center', padding:'2.5rem', color: T.textMuted },
  vacio:    { textAlign:'center', padding:'2.5rem', color: T.textMuted, fontSize:'0.95rem' },
  fila: { display:'flex', alignItems:'center', gap:'1rem', padding:'0.85rem 1.2rem', borderBottom:`1px solid ${T.borde}`, borderLeftWidth:'4px', borderLeftStyle:'solid', transition:'border-color 0.2s' },
  filaNum:       { fontSize:'0.8rem', color: T.textMuted, fontWeight:'600', minWidth:'28px', textAlign:'center', flexShrink:0 },
  filaNombre:    { display:'flex', alignItems:'center', gap:'0.5rem', flex:1, minWidth:0 },
  filaNombreTxt: { fontSize:'0.97rem', fontWeight:'600', color: T.textPri },
  filaAccion:    { flexShrink:0 },
};