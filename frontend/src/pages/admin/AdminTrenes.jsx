// [ARCHIVO: AdminTrenes.jsx] — AUDITADO ✓
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/belgrano';

const T = {
  bgPage:'#F0F2F5', bgWhite:'#FFFFFF',
  red:'#C0392B', redLight:'#FDECEA', redBorde:'#E8A09A',
  slate:'#2C3E50',
  verde:'#27AE60', verdeLight:'#EAF7EF', verdeBorde:'#A3D9B1',
  naranja:'#D35400', naranjaLight:'#FEF0E7', naranjaBorde:'#F0B080',
  blue:'#1A6FAA', blueLight:'#EAF3FB', blueBorde:'#9AC4E2',
  textPri:'#1A1A1A', textSub:'#555555', textMuted:'#999999',
  borde:'#DDE1E7', sombra:'rgba(0,0,0,0.07)',
};

const PALETA = [
  { color:'#27AE60', bg:'#EAF7EF', borde:'#A3D9B1' },
  { color:'#D35400', bg:'#FEF0E7', borde:'#F0B080' },
  { color:'#C0392B', bg:'#FDECEA', borde:'#E8A09A' },
  { color:'#1A6FAA', bg:'#EAF3FB', borde:'#9AC4E2' },
];

// [SEC-FIX] SVG controlado en lugar de emojis en PALETA
function IconoTren({ idx, size = 14 }) {
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
  // idx === 3: tren
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="7" width="20" height="12" rx="2"/>
      <circle cx="7" cy="19" r="2"/><circle cx="17" cy="19" r="2"/>
      <path d="M2 12h20M7 7V4M17 7V4"/>
    </svg>
  );
}

function getCfg(estados, id) {
  const idx = estados.findIndex(e => Number(e.id_estado) === Number(id));
  return { ...(PALETA[idx >= 0 ? idx : 0]), idx: idx >= 0 ? idx : 0 };
}

// [SEC-FIX] Sanitizar texto de API
function sanitizarTexto(str, max = 200) {
  if (typeof str !== 'string') return '';
  return str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim().slice(0, max);
}

// [SEC-FIX] Validar objeto estado-tren de la API
function validarEstadoTren(e) {
  if (!e || typeof e !== 'object') return null;
  const id = parseInt(e.id_estado, 10);
  if (!Number.isInteger(id) || id <= 0) return null;
  return {
    id_estado:   id,
    descripcion: sanitizarTexto(e.descripcion || '', 80),
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

// ── DROPDOWN DE ESTADO ────────────────────────
function DropEstado({ value, onChange, estados }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const sel    = estados.find(e => e.id_estado === parseInt(value, 10));
  const cfgSel = sel ? getCfg(estados, sel.id_estado) : null;

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

  // [SEC-FIX] Validar que el estado seleccionado existe en la lista del servidor
  const handleChange = (id) => {
    const idNum = parseInt(id, 10);
    if (!estados.some(e => e.id_estado === idNum)) return;
    onChange(idNum);
    setOpen(false);
  };

  return (
    <div ref={ref} style={{ position:'relative' }}>
      <label style={s.fieldLabel} id="drop-estado-tren-label">Nuevo estado</label>
      <button
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby="drop-estado-tren-label"
        style={{ ...s.dropBtn, borderColor: value ? T.red : T.borde, color: value ? T.textPri : T.textMuted }}
      >
        <span style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
          {cfgSel && <IconoTren idx={cfgSel.idx} size={14}/>}
          <span style={{ fontWeight: value ? '600' : '400', fontSize:'1rem' }}>
            {/* [SEC-FIX] descripcion ya sanitizada en validarEstadoTren() */}
            {sel?.descripcion || 'Seleccioná el estado...'}
          </span>
        </span>
        <span style={{ fontSize:'0.8rem', color: T.textMuted }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div role="listbox" style={s.dropLista}>
          {estados.map(est => {
            const on  = est.id_estado === parseInt(value, 10);
            const cfg = getCfg(estados, est.id_estado);
            return (
              <div
                key={est.id_estado}
                role="option"
                aria-selected={on}
                onClick={() => handleChange(est.id_estado)}
                style={{ padding:'0.9rem 1rem', cursor:'pointer', fontSize:'0.97rem', fontWeight: on ? '700' : '400', color: on ? cfg.color : T.textPri, background: on ? cfg.bg : T.bgWhite, borderBottom:`1px solid ${T.borde}`, borderLeft:`3px solid ${on ? cfg.color : 'transparent'}` }}
                onMouseEnter={e => { if (!on) e.currentTarget.style.background = '#F8F8F8'; }}
                onMouseLeave={e => { if (!on) e.currentTarget.style.background = T.bgWhite; }}
              >
                <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                  <IconoTren idx={cfg.idx} size={14}/>
                  <span>{est.descripcion}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── PÁGINA PRINCIPAL ──────────────────────────
export default function AdminTrenes() {
  const navigate = useNavigate();

  const [estados,   setEstados]   = useState([]);
  const [cargando,  setCargando]  = useState(true);
  const [trenId,    setTrenId]    = useState('');
  const [estado,    setEstado]    = useState('');
  const [enviando,  setEnviando]  = useState(false);
  const [historial, setHistorial] = useState([]);
  const [toast,     setToast]     = useState({ msg:'', tipo:'ok' });
  const [errForm,   setErrForm]   = useState('');

  const mostrar = (msg, tipo = 'ok') => setToast({ msg, tipo });

  // [SEC-FIX] Redirigir a login si no hay token
  const manejarErrorAuth = (status) => {
    if (status === 401 || status === 403) {
      sessionStorage.removeItem('panel_token');
      navigate('/panel');
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem('panel_token');
    if (!token) { navigate('/panel'); return; }
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    api.get('/panel/estados-tren')
      .then(r => {
        // [SEC-FIX] Validar y sanitizar estados recibidos de la API
        const data = Array.isArray(r.data) ? r.data : [];
        setEstados(data.map(validarEstadoTren).filter(Boolean).slice(0, 20));
      })
      .catch(err => {
        manejarErrorAuth(err?.response?.status);
        mostrar('Error al cargar los estados', 'error');
      })
      .finally(() => setCargando(false));
  }, [navigate]);

  // [SEC-FIX] Construir Set de IDs válidos a partir de la lista del servidor
  const estadosValidos = new Set(estados.map(e => e.id_estado));

  // [SEC-FIX] Validar trenId: debe ser entero positivo dentro de un rango razonable
  const trenIdNum      = parseInt(trenId.trim(), 10);
  const trenIdValido   = Number.isInteger(trenIdNum) && trenIdNum > 0 && trenIdNum <= 99999;
  const estadoNum      = parseInt(estado, 10);
  const estadoValido   = Number.isInteger(estadoNum) && estadosValidos.has(estadoNum);
  const puedeActualizar = trenIdValido && estadoValido && !enviando;

  const estadoSel = estados.find(e => e.id_estado === estadoNum);
  const cfgSel    = estadoSel ? getCfg(estados, estadoSel.id_estado) : null;

  const actualizar = async () => {
    setErrForm('');
    if (!trenIdValido) {
      setErrForm('Ingresá un ID de tren válido (número entero positivo)');
      return;
    }
    if (!estadoValido) {
      setErrForm('Seleccioná un estado válido');
      return;
    }

    setEnviando(true);
    try {
      const res = await api.put('/panel/trenes/estado', {
        id_tren:      trenIdNum,   // [SEC-FIX] entero validado, no Number(string)
        nuevo_estado: estadoNum,   // [SEC-FIX] validado contra lista del servidor
      });

      // [SEC-FIX] Usar mensaje genérico en lugar de res.data.message directamente
      // para evitar que el servidor inyecte contenido arbitrario en el UI
      mostrar('Estado actualizado correctamente');

      setHistorial(prev => [
        {
          id:          trenIdNum,
          descripcion: estadoSel.descripcion, // ya sanitizado
          cfg:         cfgSel,
          hora:        new Date().toLocaleTimeString('es-AR', { hour:'2-digit', minute:'2-digit' }),
        },
        ...prev.slice(0, 9),
      ]);
      setTrenId('');
      setEstado('');
    } catch (e) {
      manejarErrorAuth(e?.response?.status);
      // [SEC-FIX] Mensaje de error genérico — no exponer e.response.data.error
      // que puede contener detalles internos del servidor
      mostrar('Error al actualizar el tren. Verificá el ID e intentá de nuevo.', 'error');
    } finally {
      setEnviando(false);
    }
  };

  // [SEC-FIX] Solo permitir dígitos en el campo ID de tren
  const handleTrenIdChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 5);
    setTrenId(val);
    setErrForm('');
  };

  return (
    <div style={s.root}>
      <header style={s.header}>
        <div style={s.headerInner}>
          <button onClick={() => navigate('/panel')} style={s.btnVolver} aria-label="Volver al panel">← Panel</button>
          <div style={s.headerCentro}>
            <div style={s.headerTitulo}>Trenes</div>
            <div style={s.headerSub}>Estado de servicios</div>
          </div>
          <div style={{ width:'60px' }}/>
        </div>
        <div style={{ height:'3px', background:`linear-gradient(90deg, ${T.red}, #E74C3C)` }}/>
      </header>

      <main style={s.main}>

        {/* ══ FORMULARIO ══ */}
        <div style={s.seccion}>
          <div style={{ ...s.seccionHeader, borderTop:`4px solid ${T.red}` }}>
            {/* [SEC-FIX] SVG en lugar de emoji 🚂 */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={T.red} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="7" width="20" height="12" rx="2"/>
              <circle cx="7" cy="19" r="2"/><circle cx="17" cy="19" r="2"/>
              <path d="M2 12h20M7 7V4M17 7V4"/>
            </svg>
            <div>
              <div style={s.seccionTitulo}>Actualizar estado de un tren</div>
              <div style={s.seccionSub}>El cambio se refleja inmediatamente en el tablero público</div>
            </div>
          </div>
          <div style={s.seccionCuerpo}>
            {cargando ? (
              <div style={{ textAlign:'center', padding:'2rem', color: T.textMuted }} aria-live="polite">Cargando estados...</div>
            ) : (
              <>
                <div style={s.fieldGroup}>
                  <label style={s.fieldLabel} htmlFor="tren-id">ID del tren</label>
                  <input
                    id="tren-id"
                    value={trenId}
                    onChange={handleTrenIdChange}
                    placeholder="Ej: 1042"
                    style={{ ...s.input, fontSize:'1.3rem', fontWeight:'700', letterSpacing:'0.05em' }}
                    type="text"
                    inputMode="numeric"
                    // [SEC-FIX] pattern para forzar solo dígitos en mobile
                    pattern="[0-9]*"
                    maxLength={5}
                    autoComplete="off"
                    onKeyDown={e => { if (e.key === 'Enter' && puedeActualizar) actualizar(); }}
                  />
                  <div style={s.fieldHint}>Ingresá el ID numérico del tren (máx. 5 dígitos).</div>
                </div>

                <DropEstado value={estado} onChange={setEstado} estados={estados}/>

                {/* Vista previa del cambio */}
                {trenIdValido && estadoSel && cfgSel && (
                  <div style={{ ...s.preview, borderColor: cfgSel.borde, background: cfgSel.bg }}>
                    <IconoTren idx={cfgSel.idx} size={20}/>
                    <div>
                      <div style={{ fontWeight:'700', color: T.textPri, fontSize:'0.95rem' }}>
                        Tren <span style={{ fontFamily:"'Lora', serif", fontSize:'1.05rem' }}>#{trenIdNum}</span>
                        <span style={{ color: T.textMuted, fontWeight:'400' }}> → </span>
                        {/* [SEC-FIX] descripcion ya sanitizada */}
                        <span style={{ color: cfgSel.color }}>{estadoSel.descripcion}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* [SEC-FIX] Error de validación como texto plano con role="alert" */}
                {errForm && (
                  <div role="alert" style={{ fontSize:'0.85rem', color: T.red, background: T.redLight, border:`1px solid ${T.redBorde}`, borderRadius:'8px', padding:'0.6rem 0.9rem', marginTop:'0.8rem' }}>
                    {errForm}
                  </div>
                )}

                <button
                  onClick={actualizar}
                  disabled={!puedeActualizar}
                  style={{ ...s.btnAccion, background: T.red, opacity: puedeActualizar ? 1 : 0.45, cursor: puedeActualizar ? 'pointer' : 'not-allowed', marginTop: trenIdValido && estadoSel ? '1rem' : '1.4rem' }}
                >
                  {enviando ? 'Actualizando...' : 'Actualizar tren'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* ══ HISTORIAL ══ */}
        {historial.length > 0 && (
          <div style={s.seccion}>
            <div style={{ ...s.seccionHeader, borderTop:`4px solid ${T.slate}` }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.slate} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
              <div>
                <div style={s.seccionTitulo}>Historial de esta sesión</div>
                <div style={s.seccionSub}>{historial.length} cambio{historial.length !== 1 ? 's' : ''} realizados</div>
              </div>
            </div>
            <div style={s.seccionCuerpo}>
              {historial.map((h, i) => (
                <div key={i} style={{ ...s.histItem, borderLeft:`4px solid ${h.cfg.color}`, background: h.cfg.bg }}>
                  <IconoTren idx={h.cfg.idx} size={16}/>
                  <div style={{ flex:1 }}>
                    {/* [SEC-FIX] Todos los valores del historial son sanitizados en origen */}
                    <span style={{ fontWeight:'700', color: T.textPri }}>Tren #{h.id}</span>
                    <span style={{ color: T.textMuted }}> → </span>
                    <span style={{ fontWeight:'700', color: h.cfg.color }}>{h.descripcion}</span>
                  </div>
                  <span style={{ fontSize:'0.78rem', color: T.textMuted }}>{h.hora}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ AYUDA — estados desde BD ══ */}
        {!cargando && estados.length > 0 && (
          <div style={s.ayuda}>
            <div style={s.ayudaTitulo}>Estados disponibles</div>
            {estados.map(est => {
              const cfg = getCfg(estados, est.id_estado);
              return (
                <div key={est.id_estado} style={s.ayudaItem}>
                  <IconoTren idx={cfg.idx} size={16}/>
                  {/* [SEC-FIX] descripcion sanitizada */}
                  <span style={{ fontWeight:'700', color: cfg.color }}>{est.descripcion}</span>
                </div>
              );
            })}
          </div>
        )}

      </main>

      <Toast msg={toast.msg} tipo={toast.tipo} onClose={() => setToast({ msg:'', tipo:'ok' })}/>
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
  main: { maxWidth:'720px', margin:'0 auto', padding:'1.5rem', display:'flex', flexDirection:'column', gap:'1.2rem' },
  seccion: { background: T.bgWhite, border:`1.5px solid ${T.borde}`, borderRadius:'16px', overflow:'visible' },
  seccionHeader: { display:'flex', alignItems:'center', gap:'0.8rem', padding:'1.1rem 1.4rem', borderBottom:`1px solid ${T.borde}`, background:'#FAFAFA', borderRadius:'14px 14px 0 0' },
  seccionTitulo: { fontSize:'1.05rem', fontWeight:'700', fontFamily:"'Lora', serif", color: T.textPri },
  seccionSub:    { fontSize:'0.8rem', color: T.textSub, marginTop:'1px' },
  seccionCuerpo: { padding:'1.3rem 1.4rem' },
  fieldGroup:  { marginBottom:'1.1rem' },
  fieldLabel:  { display:'block', fontSize:'0.9rem', fontWeight:'600', color: T.textSub, marginBottom:'0.4rem' },
  fieldHint:   { fontSize:'0.78rem', color: T.textMuted, marginTop:'0.35rem' },
  input:       { width:'100%', background: T.bgWhite, border:`2px solid ${T.borde}`, borderRadius:'10px', padding:'0.85rem 1rem', fontSize:'1rem', color: T.textPri, outline:'none', boxSizing:'border-box', fontFamily:"'Source Sans 3', sans-serif" },
  dropBtn:   { width:'100%', background: T.bgWhite, border:'2px solid', borderRadius:'10px', padding:'0.85rem 1rem', display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer', minHeight:'52px', color: T.textPri, boxSizing:'border-box' },
  dropLista: { position:'absolute', top:'calc(100% + 4px)', left:0, right:0, background: T.bgWhite, border:`2px solid ${T.red}`, borderRadius:'10px', zIndex:300, maxHeight:'320px', overflowY:'auto', boxShadow:'0 8px 24px rgba(0,0,0,0.12)' },
  preview: { display:'flex', alignItems:'flex-start', gap:'0.8rem', border:'1.5px solid', borderRadius:'12px', padding:'0.9rem 1.1rem', marginTop:'1.1rem' },
  btnAccion: { border:'none', color:'#FFFFFF', padding:'0.95rem 2rem', borderRadius:'10px', fontSize:'1.05rem', fontWeight:'700', minHeight:'52px', transition:'opacity 0.2s', display:'inline-flex', alignItems:'center', gap:'0.5rem' },
  histItem: { display:'flex', alignItems:'center', gap:'0.8rem', padding:'0.7rem 0.9rem', borderRadius:'8px', marginBottom:'0.5rem', borderLeftWidth:'4px', borderLeftStyle:'solid' },
  ayuda: { background: T.bgWhite, border:`1.5px solid ${T.borde}`, borderRadius:'12px', padding:'1.1rem 1.3rem' },
  ayudaTitulo: { fontSize:'0.9rem', fontWeight:'700', color: T.textSub, marginBottom:'0.8rem' },
  ayudaItem: { display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'0.55rem', fontSize:'0.9rem' },
};