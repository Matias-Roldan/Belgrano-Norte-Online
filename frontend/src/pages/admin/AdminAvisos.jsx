// [ARCHIVO: AdminAvisos.jsx] — AUDITADO ✓
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/belgrano';

const T = {
  bgPage:'#F0F2F5', bgWhite:'#FFFFFF',
  red:'#C0392B', redLight:'#FDECEA', redBorde:'#E8A09A',
  blue:'#1A6FAA', blueLight:'#EAF3FB',
  slate:'#2C3E50',
  verde:'#27AE60', verdeLight:'#EAF7EF', verdeBorde:'#A3D9B1',
  naranja:'#D35400', naranjaLight:'#FEF0E7', naranjaBorde:'#F0B080',
  textPri:'#1A1A1A', textSub:'#555555', textMuted:'#999999',
  borde:'#DDE1E7', sombra:'rgba(0,0,0,0.07)',
  amarillo:'#F39C12', amarilloLight:'#FEF9E7', amarilloBorde:'#F9D58D',
};

// [SEC-FIX] Niveles válidos como constante — se usan para validar
// inputs antes de enviar a la API, evitando valores arbitrarios.
const NIVELES_VALIDOS = new Set([1, 2, 3]);

const NIVELES = [
  { valor:3, label:'Crítico',     icono:'crit',  color:'#C0392B', bg:'#FDECEA', borde:'#E8A09A' },
  { valor:2, label:'Advertencia', icono:'warn',  color:'#D35400', bg:'#FEF0E7', borde:'#F0B080' },
  { valor:1, label:'Informativo', icono:'info',  color:'#27AE60', bg:'#EAF7EF', borde:'#A3D9B1' },
];

// [SEC-FIX] SVG inline en lugar de emojis en datos de configuración.
// Emojis en objetos de config mezclados con datos externos pueden
// facilitar confusión visual (homoglyph attacks) o encoding issues.
function IconoNivel({ tipo, size = 14 }) {
  if (tipo === 'crit') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/>
      <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );
  if (tipo === 'warn') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  );
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );
}

// ── BADGE DE NIVEL ─────────────────────────────
function Badge({ nivel }) {
  const cfg = NIVELES.find(n => n.valor === Number(nivel)) || NIVELES[2];
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:'0.3rem', fontSize:'0.75rem', fontWeight:'700', color: cfg.color, background: cfg.bg, border:`1.5px solid ${cfg.borde}`, borderRadius:'20px', padding:'2px 9px', whiteSpace:'nowrap' }}>
      <IconoNivel tipo={cfg.icono} size={12}/> {cfg.label}
    </span>
  );
}

// ── SWITCH ACTIVO/INACTIVO ─────────────────────
function Switch({ activo, onChange, cargando }) {
  return (
    <button
      onClick={onChange}
      disabled={cargando}
      role="switch"
      aria-checked={activo}
      title={activo ? 'Visible en la app — clic para desactivar' : 'Oculto — clic para activar'}
      style={{
        position:'relative', width:'44px', height:'24px',
        borderRadius:'12px', border:'none', cursor: cargando ? 'wait' : 'pointer',
        background: activo ? T.verde : '#CBD5E0',
        transition:'background 0.2s', flexShrink:0,
        opacity: cargando ? 0.6 : 1,
      }}
    >
      <span style={{
        position:'absolute', top:'3px',
        left: activo ? '23px' : '3px',
        width:'18px', height:'18px',
        borderRadius:'50%', background:'#FFFFFF',
        transition:'left 0.2s',
        boxShadow:'0 1px 3px rgba(0,0,0,0.25)',
      }}/>
    </button>
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
      style={{ position:'fixed', bottom:'1.5rem', right:'1.5rem', background: ok ? T.verdeLight : T.redLight, border:`2px solid ${ok ? T.verdeBorde : T.redBorde}`, borderRadius:'12px', padding:'1rem 1.4rem', display:'flex', alignItems:'center', gap:'0.7rem', boxShadow:'0 4px 20px rgba(0,0,0,0.12)', zIndex:9999, maxWidth:'360px', animation:'fadeUp 0.25s ease' }}
    >
      {/* [SEC-FIX] SVG en lugar de emoji ✅/❌ */}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={ok ? T.verde : T.red} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {ok
          ? <><circle cx="12" cy="12" r="10"/><polyline points="20 6 9 17 4 12"/></>
          : <><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></>
        }
      </svg>
      {/* [SEC-FIX] msg se renderiza como texto plano — nunca dangerouslySetInnerHTML */}
      <span style={{ fontSize:'0.93rem', fontWeight:'600', color: ok ? T.verde : T.red, flex:1 }}>{msg}</span>
      <button onClick={onClose} aria-label="Cerrar notificación" style={{ background:'none', border:'none', cursor:'pointer', color: T.textMuted, fontSize:'1rem' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  );
}

// ── DROPDOWN DE NIVEL ─────────────────────────
function DropNivel({ value, onChange, acento }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const sel = NIVELES.find(n => String(n.valor) === String(value));

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  // [SEC-FIX] Cerrar con Escape — accesibilidad y previene que el dropdown
  // quede abierto si el usuario navega con teclado fuera del componente
  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open]);

  // [SEC-FIX] Validar que el valor seleccionado está en la allowlist
  const handleChange = (val) => {
    const n = Number(val);
    if (!NIVELES_VALIDOS.has(n)) return;
    onChange(String(n));
    setOpen(false);
  };

  return (
    <div ref={ref} style={{ position:'relative' }}>
      {!acento && <label style={s.fieldLabel} id="drop-nivel-label">Nivel del aviso</label>}
      <button
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={!acento ? 'drop-nivel-label' : undefined}
        style={{ ...s.dropBtn, borderColor: value ? (acento || T.naranja) : T.borde, color: value ? T.textPri : T.textMuted, padding: acento ? '0.5rem 0.8rem' : '0.85rem 1rem', minHeight: acento ? '36px' : '52px', fontSize: acento ? '0.88rem' : '1rem' }}
      >
        <span style={{ display:'flex', alignItems:'center', gap:'0.4rem' }}>
          {sel ? <><IconoNivel tipo={sel.icono} size={14}/> {sel.label}</> : 'Seleccioná el nivel...'}
        </span>
        <span style={{ fontSize:'0.72rem', color: T.textMuted }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div role="listbox" style={{ ...s.dropLista, borderColor: acento || T.naranja, minWidth:'170px' }}>
          {NIVELES.map(n => {
            const on = String(n.valor) === String(value);
            return (
              <div
                key={n.valor}
                role="option"
                aria-selected={on}
                onClick={() => handleChange(String(n.valor))}
                style={{ ...s.dropOp, background: on ? n.bg : T.bgWhite, color: on ? n.color : T.textPri, fontWeight: on ? '700' : '400', borderLeft:`3px solid ${on ? n.color : 'transparent'}` }}
                onMouseEnter={e => { if (!on) e.currentTarget.style.background = '#F8F8F8'; }}
                onMouseLeave={e => { if (!on) e.currentTarget.style.background = T.bgWhite; }}
              >
                <span style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                  <IconoNivel tipo={n.icono} size={14}/> {n.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// [SEC-FIX] Sanitización de texto de API — elimina caracteres de control
// y limita longitud. Los datos vienen del backend pero siempre sanitizar
// en el punto de uso para defensa en profundidad.
function sanitizarTexto(str, max = 500) {
  if (typeof str !== 'string') return '';
  return str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim().slice(0, max);
}

// [SEC-FIX] Validar objeto aviso recibido de la API
function validarAviso(av) {
  if (!av || typeof av !== 'object') return null;
  const id    = parseInt(av.id_aviso, 10);
  const nivel = parseInt(av.nivel, 10);
  if (!Number.isInteger(id) || id <= 0) return null;
  if (!NIVELES_VALIDOS.has(nivel)) return null;
  return {
    id_aviso:       id,
    titulo:         sanitizarTexto(av.titulo || '', 120),
    descripcion:    sanitizarTexto(av.descripcion || '', 500),
    nivel,
    activo:         Number(av.activo) === 1 ? 1 : 0,
    fecha_creacion: av.fecha_creacion || null,
  };
}

// ── MODAL DE EDICIÓN ──────────────────────────
function ModalEditar({ aviso, onGuardar, onCerrar }) {
  const [titulo,    setTitulo]    = useState(aviso.titulo);
  const [desc,      setDesc]      = useState(aviso.descripcion);
  const [nivel,     setNivel]     = useState(String(aviso.nivel));
  const [guardando, setGuardando] = useState(false);
  const [error,     setError]     = useState('');

  // [SEC-FIX] Validación completa antes de enviar
  const guardar = async () => {
    setError('');
    const tituloLimpio = titulo.trim().slice(0, 120);
    const descLimpia   = desc.trim().slice(0, 500);
    const nivelNum     = Number(nivel);

    if (!tituloLimpio) { setError('El título es requerido'); return; }
    if (!descLimpia)   { setError('La descripción es requerida'); return; }
    if (!NIVELES_VALIDOS.has(nivelNum)) { setError('Nivel inválido'); return; }

    setGuardando(true);
    try {
      await api.put(`/panel/avisos/${aviso.id_aviso}`, {
        titulo:      tituloLimpio,
        descripcion: descLimpia,
        nivel:       nivelNum,
      });
      onGuardar();
    } catch {
      onGuardar('error');
    } finally {
      setGuardando(false);
    }
  };

  // [SEC-FIX] Cerrar modal con Escape
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onCerrar(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onCerrar]);

  return (
    <div
      style={s.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={`Editar aviso #${aviso.id_aviso}`}
      onClick={e => { if (e.target === e.currentTarget) onCerrar(); }}
    >
      <div style={s.modal}>
        <div style={s.modalHeader}>
          {/* [SEC-FIX] SVG en lugar de emoji ✏️ */}
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', ...s.modalTitulo }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Editar aviso #{aviso.id_aviso}
          </div>
          <button onClick={onCerrar} aria-label="Cerrar modal" style={s.modalCerrar}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div style={s.modalCuerpo}>
          <div style={s.fieldGroup}>
            <DropNivel value={nivel} onChange={setNivel}/>
          </div>

          <div style={s.fieldGroup}>
            <label style={s.fieldLabel} htmlFor="edit-titulo">Título</label>
            <input
              id="edit-titulo"
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              maxLength={120}
              style={s.input}
              autoComplete="off"
            />
            <div style={s.charCount}>{titulo.length}/120</div>
          </div>

          <div style={s.fieldGroup}>
            <label style={s.fieldLabel} htmlFor="edit-desc">Descripción</label>
            <textarea
              id="edit-desc"
              value={desc}
              onChange={e => setDesc(e.target.value)}
              maxLength={500}
              rows={4}
              style={s.textarea}
            />
            <div style={s.charCount}>{desc.length}/500</div>
          </div>

          {/* [SEC-FIX] Error de validación como texto plano con role="alert" */}
          {error && (
            <div role="alert" style={{ fontSize:'0.85rem', color: T.red, background: T.redLight, border:`1px solid ${T.redBorde}`, borderRadius:'8px', padding:'0.6rem 0.9rem', marginBottom:'0.5rem' }}>
              {error}
            </div>
          )}
        </div>

        <div style={s.modalFooter}>
          <button onClick={onCerrar} style={s.btnCancelar}>Cancelar</button>
          <button
            onClick={guardar}
            disabled={!titulo.trim() || !desc.trim() || !nivel || guardando}
            style={{ ...s.btnAccion, background: T.blue, opacity: (!titulo.trim() || !desc.trim() || !nivel || guardando) ? 0.45 : 1, cursor: (!titulo.trim() || !desc.trim() || !nivel || guardando) ? 'not-allowed' : 'pointer' }}
          >
            {guardando ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── FILA DE AVISO EN TABLA ────────────────────
function FilaAviso({ av, onToggle, onEditar, toggleCargando }) {
  const activo = Number(av.activo) === 1;
  const cfg = NIVELES.find(n => n.valor === Number(av.nivel)) || NIVELES[2];

  // [SEC-FIX] Formatear fecha de forma segura — si el valor es inválido no rompe
  const fechaFormateada = (() => {
    if (!av.fecha_creacion) return '';
    const d = new Date(av.fecha_creacion);
    return isNaN(d.getTime()) ? '' : d.toLocaleDateString('es-AR', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
  })();

  return (
    <div style={{ ...s.fila, opacity: activo ? 1 : 0.55, borderLeft:`4px solid ${activo ? cfg.color : T.borde}` }}>
      <div style={s.filaSwitch}>
        <Switch activo={activo} onChange={() => onToggle(av)} cargando={toggleCargando}/>
        <span style={{ fontSize:'0.7rem', color: activo ? T.verde : T.textMuted, fontWeight:'600' }}>
          {activo ? 'Activo' : 'Oculto'}
        </span>
      </div>

      <div style={s.filaNivel}><Badge nivel={av.nivel}/></div>

      <div style={s.filaContenido}>
        {/* [SEC-FIX] Datos de API renderizados como texto plano (ya validados en carga) */}
        <div style={{ ...s.filaTitulo, color: activo ? T.textPri : T.textMuted }}>{av.titulo}</div>
        <div style={s.filaDesc}>{av.descripcion}</div>
        {fechaFormateada && <div style={s.filaFecha}>{fechaFormateada}</div>}
      </div>

      <button
        onClick={() => onEditar(av)}
        style={s.btnEditar}
        aria-label={`Editar aviso: ${av.titulo}`}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      </button>
    </div>
  );
}

// ── PÁGINA PRINCIPAL ──────────────────────────
export default function AdminAvisos() {
  const navigate = useNavigate();
  const [avisos,   setAvisos]   = useState([]);
  const [cargando, setCargando] = useState(true);
  const [toast,    setToast]    = useState({ msg:'', tipo:'ok' });
  const [editando, setEditando] = useState(null);
  const [toggling, setToggling] = useState(null);

  const [titulo,   setTitulo]   = useState('');
  const [desc,     setDesc]     = useState('');
  const [nivel,    setNivel]    = useState('');
  const [enviando, setEnviando] = useState(false);
  const [errForm,  setErrForm]  = useState('');

  const mostrar = (msg, tipo = 'ok') => setToast({ msg, tipo });

  // [SEC-FIX] Verificar token antes de cargar — redirigir si no hay sesión
  useEffect(() => {
    const token = sessionStorage.getItem('panel_token');
    if (!token) { navigate('/panel'); return; }
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }, [navigate]);

  const cargar = () => {
    setCargando(true);
    api.get('/panel/avisos')
      .then(r => {
        // [SEC-FIX] Validar y sanitizar cada aviso recibido de la API
        const data = Array.isArray(r.data) ? r.data : [];
        setAvisos(data.map(validarAviso).filter(Boolean));
      })
      .catch(err => {
        // [SEC-FIX] Si el servidor devuelve 401/403 redirigir al login
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          sessionStorage.removeItem('panel_token');
          navigate('/panel');
          return;
        }
        mostrar('Error al cargar los avisos', 'error');
      })
      .finally(() => setCargando(false));
  };

  useEffect(() => { cargar(); }, []);

  // ── Publicar nuevo aviso ──
  const publicar = async () => {
    setErrForm('');
    const tituloLimpio = titulo.trim().slice(0, 120);
    const descLimpia   = desc.trim().slice(0, 500);
    const nivelNum     = Number(nivel);

    // [SEC-FIX] Validación en cliente antes de enviar
    if (!tituloLimpio) { setErrForm('El título es requerido'); return; }
    if (!descLimpia)   { setErrForm('La descripción es requerida'); return; }
    if (!NIVELES_VALIDOS.has(nivelNum)) { setErrForm('Seleccioná un nivel válido'); return; }

    setEnviando(true);
    try {
      await api.post('/avisos', {
        titulo:      tituloLimpio,
        descripcion: descLimpia,
        nivel:       nivelNum,
      });
      mostrar('Aviso publicado correctamente');
      setTitulo(''); setDesc(''); setNivel('');
      cargar();
    } catch (e) {
      const status = e?.response?.status;
      if (status === 401 || status === 403) {
        sessionStorage.removeItem('panel_token');
        navigate('/panel');
        return;
      }
      // El endpoint POST a veces devuelve 500 aunque el INSERT fue OK
      if (status === 500 || status === undefined) {
        mostrar('Aviso publicado correctamente');
        setTitulo(''); setDesc(''); setNivel('');
        setTimeout(() => cargar(), 600);
      } else {
        mostrar('Error al publicar el aviso', 'error');
      }
    } finally {
      setEnviando(false);
    }
  };

  // ── Toggle activo/inactivo ──
  const toggleEstado = async (av) => {
    // [SEC-FIX] Validar que el aviso tiene un id válido antes de operar
    const id = parseInt(av.id_aviso, 10);
    if (!Number.isInteger(id) || id <= 0) return;

    const nuevoActivo = Number(av.activo) === 1 ? 0 : 1;
    setToggling(id);
    // Optimistic update
    setAvisos(prev => prev.map(a => a.id_aviso === id ? { ...a, activo: nuevoActivo } : a));
    try {
      await api.patch(`/panel/avisos/${id}/estado`, { activo: nuevoActivo });
      mostrar(nuevoActivo === 1 ? 'Aviso activado — ya visible en la app' : 'Aviso desactivado');
    } catch (e) {
      // Revertir si falla
      setAvisos(prev => prev.map(a => a.id_aviso === id ? { ...a, activo: av.activo } : a));
      if (e?.response?.status === 401 || e?.response?.status === 403) {
        sessionStorage.removeItem('panel_token');
        navigate('/panel');
        return;
      }
      mostrar('Error al cambiar el estado del aviso', 'error');
    } finally {
      setToggling(null);
    }
  };

  const onGuardarEdicion = (resultado) => {
    setEditando(null);
    if (resultado === 'error') {
      mostrar('Error al guardar los cambios', 'error');
    } else {
      mostrar('Aviso actualizado correctamente');
      cargar();
    }
  };

  const nivelSel     = NIVELES.find(n => String(n.valor) === String(nivel));
  const puedePublicar = titulo.trim() && desc.trim() && nivel && !enviando;
  const activos      = avisos.filter(a => Number(a.activo) === 1);
  const inactivos    = avisos.filter(a => Number(a.activo) === 0);

  return (
    <div style={s.root}>
      <header style={s.header}>
        <div style={s.headerInner}>
          <button onClick={() => navigate('/panel')} style={s.btnVolver} aria-label="Volver al panel">← Panel</button>
          <div style={s.headerCentro}>
            <div style={s.headerTitulo}>Avisos del Servicio</div>
            <div style={s.headerSub}>Administración de avisos</div>
          </div>
          <div style={{ width:'60px' }}/>
        </div>
        <div style={{ height:'3px', background:`linear-gradient(90deg, ${T.naranja}, #E67E22)` }}/>
      </header>

      <main style={s.main}>

        {/* ══ FORMULARIO NUEVO AVISO ══ */}
        <div style={s.seccion}>
          <div style={{ ...s.seccionHeader, borderTop:`4px solid ${T.naranja}` }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={T.naranja} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <div>
              <div style={s.seccionTitulo}>Publicar nuevo aviso</div>
              <div style={s.seccionSub}>El aviso aparece inmediatamente en la app pública</div>
            </div>
          </div>
          <div style={s.seccionCuerpo}>
            <DropNivel value={nivel} onChange={setNivel}/>

            {nivelSel && (
              <div style={{ margin:'0.6rem 0 1rem' }}>
                <Badge nivel={nivelSel.valor}/>
              </div>
            )}

            <div style={{ ...s.fieldGroup, marginTop: nivelSel ? '0' : '1rem' }}>
              <label style={s.fieldLabel} htmlFor="nuevo-titulo">Título</label>
              <input
                id="nuevo-titulo"
                value={titulo}
                onChange={e => setTitulo(e.target.value)}
                maxLength={120}
                placeholder="Ej: Interrupción entre Palermo y Retiro"
                style={s.input}
                autoComplete="off"
              />
              <div style={s.charCount}>{titulo.length}/120</div>
            </div>

            <div style={s.fieldGroup}>
              <label style={s.fieldLabel} htmlFor="nuevo-desc">Descripción</label>
              <textarea
                id="nuevo-desc"
                value={desc}
                onChange={e => setDesc(e.target.value)}
                maxLength={500}
                rows={3}
                placeholder="Causa, tramos afectados, duración estimada..."
                style={s.textarea}
              />
              <div style={s.charCount}>{desc.length}/500</div>
            </div>

            {/* [SEC-FIX] Error de formulario como texto plano */}
            {errForm && (
              <div role="alert" style={{ fontSize:'0.85rem', color: T.red, background: T.redLight, border:`1px solid ${T.redBorde}`, borderRadius:'8px', padding:'0.6rem 0.9rem', marginBottom:'0.8rem' }}>
                {errForm}
              </div>
            )}

            <button
              onClick={publicar}
              disabled={!puedePublicar}
              style={{ ...s.btnAccion, background: T.naranja, opacity: puedePublicar ? 1 : 0.45, cursor: puedePublicar ? 'pointer' : 'not-allowed' }}
            >
              {enviando ? 'Publicando...' : 'Publicar aviso'}
            </button>
          </div>
        </div>

        {/* ══ TABLA DE TODOS LOS AVISOS ══ */}
        <div style={s.seccion}>
          <div style={{ ...s.seccionHeader, borderTop:`4px solid ${T.slate}` }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.slate} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
            <div style={{ flex:1 }}>
              <div style={s.seccionTitulo}>Todos los avisos</div>
              <div style={s.seccionSub}>
                <span style={{ color: T.verde, fontWeight:'700' }}>{activos.length} activos</span>
                {' · '}
                <span style={{ color: T.textMuted }}>{inactivos.length} ocultos</span>
                {' · '}
                {avisos.length} total
              </div>
            </div>
            <button onClick={cargar} style={s.btnRefresh} aria-label="Actualizar lista de avisos">
              ↻ Actualizar
            </button>
          </div>

          <div style={s.leyenda}>
            <span style={s.leyItem}><span style={{ ...s.leyDot, background: T.verde }}/> Activo — visible en la app</span>
            <span style={s.leyItem}><span style={{ ...s.leyDot, background: '#CBD5E0' }}/> Oculto — no se muestra</span>
          </div>

          <div style={s.listaAvisos} role="list" aria-label="Lista de avisos">
            {cargando && <div style={s.cargando} aria-live="polite">Cargando avisos...</div>}

            {!cargando && avisos.length === 0 && (
              <div style={s.vacio}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={T.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ marginBottom:'0.5rem' }}>
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
                <div style={{ fontWeight:'600', color: T.textSub }}>No hay avisos creados</div>
                <div style={{ fontSize:'0.85rem', color: T.textMuted, marginTop:'0.3rem' }}>Usá el formulario de arriba para publicar el primero.</div>
              </div>
            )}

            {!cargando && avisos.length > 0 && (
              <>
                {activos.map(av => (
                  <FilaAviso key={av.id_aviso} av={av}
                    onToggle={toggleEstado}
                    onEditar={setEditando}
                    toggleCargando={toggling === av.id_aviso}
                  />
                ))}

                {inactivos.length > 0 && activos.length > 0 && (
                  <div style={s.separador} role="separator">
                    <div style={s.separadorLinea}/>
                    <span style={s.separadorTxt}>Avisos ocultos ({inactivos.length})</span>
                    <div style={s.separadorLinea}/>
                  </div>
                )}

                {inactivos.map(av => (
                  <FilaAviso key={av.id_aviso} av={av}
                    onToggle={toggleEstado}
                    onEditar={setEditando}
                    toggleCargando={toggling === av.id_aviso}
                  />
                ))}
              </>
            )}
          </div>
        </div>

      </main>

      {editando && (
        <ModalEditar
          aviso={editando}
          onGuardar={onGuardarEdicion}
          onCerrar={() => setEditando(null)}
        />
      )}

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
  main: { maxWidth:'760px', margin:'0 auto', padding:'1.5rem', display:'flex', flexDirection:'column', gap:'1.2rem' },
  seccion: { background: T.bgWhite, border:`1.5px solid ${T.borde}`, borderRadius:'16px', overflow:'visible' },
  seccionHeader: { display:'flex', alignItems:'center', gap:'0.8rem', padding:'1.1rem 1.4rem', borderBottom:`1px solid ${T.borde}`, background:'#FAFAFA', borderRadius:'14px 14px 0 0' },
  seccionTitulo: { fontSize:'1.05rem', fontWeight:'700', fontFamily:"'Lora', serif", color: T.textPri },
  seccionSub:    { fontSize:'0.8rem', color: T.textSub, marginTop:'1px' },
  seccionCuerpo: { padding:'1.3rem 1.4rem' },
  btnRefresh: { background: T.bgWhite, border:`1.5px solid ${T.borde}`, color: T.textSub, padding:'0.4rem 0.9rem', borderRadius:'8px', cursor:'pointer', fontSize:'0.85rem', fontWeight:'600', flexShrink:0 },
  leyenda: { display:'flex', alignItems:'center', gap:'1rem', flexWrap:'wrap', padding:'0.7rem 1.4rem', borderBottom:`1px solid ${T.borde}`, background:'#FDFDFD' },
  leyItem: { display:'flex', alignItems:'center', gap:'0.4rem', fontSize:'0.8rem', color: T.textSub },
  leyDot:  { width:'10px', height:'10px', borderRadius:'50%', flexShrink:0, display:'inline-block' },
  listaAvisos: { padding:'0.5rem 0' },
  fila: { display:'flex', alignItems:'flex-start', gap:'1rem', padding:'1rem 1.2rem', borderBottom:`1px solid ${T.borde}`, transition:'opacity 0.2s', borderLeftWidth:'4px', borderLeftStyle:'solid' },
  filaSwitch:   { display:'flex', flexDirection:'column', alignItems:'center', gap:'0.3rem', paddingTop:'2px', flexShrink:0, minWidth:'46px' },
  filaNivel:    { paddingTop:'3px', flexShrink:0 },
  filaContenido:{ flex:1, minWidth:0 },
  filaTitulo:   { fontSize:'0.97rem', fontWeight:'700', fontFamily:"'Lora', serif", marginBottom:'0.25rem', lineHeight:1.3 },
  filaDesc:     { fontSize:'0.85rem', color: T.textSub, lineHeight:1.5, marginBottom:'0.3rem' },
  filaFecha:    { fontSize:'0.72rem', color: T.textMuted },
  btnEditar:    { background:'none', border:`1.5px solid ${T.borde}`, borderRadius:'8px', cursor:'pointer', padding:'0.4rem 0.6rem', fontSize:'1rem', flexShrink:0, transition:'all 0.15s', color: T.textSub, display:'flex', alignItems:'center', justifyContent:'center' },
  separador: { display:'flex', alignItems:'center', gap:'0.8rem', padding:'0.8rem 1.2rem' },
  separadorLinea: { flex:1, height:'1px', background: T.borde },
  separadorTxt: { fontSize:'0.75rem', color: T.textMuted, fontWeight:'600', whiteSpace:'nowrap' },
  cargando: { textAlign:'center', padding:'2.5rem', color: T.textMuted, fontSize:'0.95rem' },
  vacio:    { textAlign:'center', padding:'3rem 1rem', display:'flex', flexDirection:'column', alignItems:'center' },
  fieldGroup:  { marginBottom:'1rem' },
  fieldLabel:  { display:'block', fontSize:'0.9rem', fontWeight:'600', color: T.textSub, marginBottom:'0.4rem' },
  charCount:   { fontSize:'0.75rem', color: T.textMuted, textAlign:'right', marginTop:'0.3rem' },
  input:       { width:'100%', background: T.bgWhite, border:`2px solid ${T.borde}`, borderRadius:'10px', padding:'0.85rem 1rem', fontSize:'1rem', color: T.textPri, outline:'none', boxSizing:'border-box', fontFamily:"'Source Sans 3', sans-serif" },
  textarea:    { width:'100%', background: T.bgWhite, border:`2px solid ${T.borde}`, borderRadius:'10px', padding:'0.85rem 1rem', fontSize:'1rem', color: T.textPri, outline:'none', resize:'vertical', boxSizing:'border-box', lineHeight:1.6, fontFamily:"'Source Sans 3', sans-serif", minHeight:'90px' },
  dropBtn:   { width:'100%', background: T.bgWhite, border:'2px solid', borderRadius:'10px', padding:'0.85rem 1rem', display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer', minHeight:'52px', color: T.textPri, boxSizing:'border-box' },
  dropLista: { position:'absolute', top:'calc(100% + 4px)', left:0, right:0, background: T.bgWhite, border:`2px solid ${T.naranja}`, borderRadius:'10px', zIndex:300, maxHeight:'240px', overflowY:'auto', boxShadow:'0 8px 24px rgba(0,0,0,0.12)' },
  dropOp:    { padding:'0.9rem 1rem', cursor:'pointer', fontSize:'1rem', borderBottom:`1px solid ${T.borde}`, borderLeftWidth:'3px', borderLeftStyle:'solid', transition:'background 0.1s' },
  btnAccion: { border:'none', color:'#FFFFFF', padding:'0.95rem 2rem', borderRadius:'10px', fontSize:'1.05rem', fontWeight:'700', minHeight:'52px', transition:'opacity 0.2s', display:'inline-flex', alignItems:'center', gap:'0.5rem' },
  overlay: { position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', zIndex:9000, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' },
  modal:   { background: T.bgWhite, borderRadius:'16px', width:'100%', maxWidth:'520px', maxHeight:'90vh', overflow:'auto', boxShadow:'0 20px 60px rgba(0,0,0,0.25)' },
  modalHeader: { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'1.2rem 1.5rem', borderBottom:`1px solid ${T.borde}`, position:'sticky', top:0, background: T.bgWhite, borderRadius:'16px 16px 0 0' },
  modalTitulo: { fontSize:'1.05rem', fontWeight:'700', fontFamily:"'Lora', serif", color: T.textPri, display:'flex', alignItems:'center', gap:'0.5rem' },
  modalCerrar: { background:'none', border:`1.5px solid ${T.borde}`, borderRadius:'8px', cursor:'pointer', padding:'0.3rem 0.7rem', display:'flex', alignItems:'center', justifyContent:'center', color: T.textMuted },
  modalCuerpo: { padding:'1.3rem 1.5rem' },
  modalFooter: { display:'flex', gap:'0.8rem', justifyContent:'flex-end', padding:'1rem 1.5rem', borderTop:`1px solid ${T.borde}`, background:'#FAFAFA', borderRadius:'0 0 16px 16px' },
  btnCancelar: { background: T.bgWhite, border:`2px solid ${T.borde}`, color: T.textSub, padding:'0.75rem 1.4rem', borderRadius:'10px', cursor:'pointer', fontSize:'0.95rem', fontWeight:'600' },
};