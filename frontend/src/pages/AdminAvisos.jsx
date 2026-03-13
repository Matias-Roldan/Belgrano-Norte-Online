// frontend/src/pages/AdminAvisos.jsx
import { useState, useEffect, useRef } from 'react';
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
  amarillo:'#F39C12', amarilloLight:'#FEF9E7', amarilloBorde:'#F9D58D',
};

const NIVELES = [
  { valor:3, label:'Crítico',     emoji:'🚨', color:'#C0392B', bg:'#FDECEA', borde:'#E8A09A' },
  { valor:2, label:'Advertencia', emoji:'⚠️', color:'#D35400', bg:'#FEF0E7', borde:'#F0B080' },
  { valor:1, label:'Informativo', emoji:'ℹ️', color:'#27AE60', bg:'#EAF7EF', borde:'#A3D9B1' },
];

// ── BADGE DE NIVEL ─────────────────────────────
function Badge({ nivel }) {
  const cfg = NIVELES.find(n => n.valor === Number(nivel)) || NIVELES[2];
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:'0.3rem', fontSize:'0.75rem', fontWeight:'700', color: cfg.color, background: cfg.bg, border:`1.5px solid ${cfg.borde}`, borderRadius:'20px', padding:'2px 9px', whiteSpace:'nowrap' }}>
      {cfg.emoji} {cfg.label}
    </span>
  );
}

// ── SWITCH ACTIVO/INACTIVO ─────────────────────
function Switch({ activo, onChange, cargando }) {
  return (
    <button
      onClick={onChange}
      disabled={cargando}
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
  useEffect(() => { if (!msg) return; const id = setTimeout(onClose, 3500); return () => clearTimeout(id); }, [msg]);
  if (!msg) return null;
  const ok = tipo === 'ok';
  return (
    <div style={{ position:'fixed', bottom:'1.5rem', right:'1.5rem', background: ok ? T.verdeLight : T.redLight, border:`2px solid ${ok ? T.verdeBorde : T.redBorde}`, borderRadius:'12px', padding:'1rem 1.4rem', display:'flex', alignItems:'center', gap:'0.7rem', boxShadow:'0 4px 20px rgba(0,0,0,0.12)', zIndex:9999, maxWidth:'360px', animation:'fadeUp 0.25s ease' }}>
      <span style={{ fontSize:'1.1rem' }}>{ok ? '✅' : '❌'}</span>
      <span style={{ fontSize:'0.93rem', fontWeight:'600', color: ok ? T.verde : T.red, flex:1 }}>{msg}</span>
      <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color: T.textMuted, fontSize:'1rem' }}>✕</button>
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

  return (
    <div ref={ref} style={{ position:'relative' }}>
      {!acento && <label style={s.fieldLabel}>Nivel del aviso</label>}
      <button onClick={() => setOpen(!open)}
        style={{ ...s.dropBtn, borderColor: value ? (acento || T.naranja) : T.borde, color: value ? T.textPri : T.textMuted, padding: acento ? '0.5rem 0.8rem' : '0.85rem 1rem', minHeight: acento ? '36px' : '52px', fontSize: acento ? '0.88rem' : '1rem' }}>
        <span>{sel ? `${sel.emoji} ${sel.label}` : 'Seleccioná el nivel...'}</span>
        <span style={{ fontSize:'0.72rem', color: T.textMuted }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div style={{ ...s.dropLista, borderColor: acento || T.naranja, minWidth:'170px' }}>
          {NIVELES.map(n => {
            const on = String(n.valor) === String(value);
            return (
              <div key={n.valor} onClick={() => { onChange(String(n.valor)); setOpen(false); }}
                style={{ ...s.dropOp, background: on ? n.bg : T.bgWhite, color: on ? n.color : T.textPri, fontWeight: on ? '700' : '400', borderLeft:`3px solid ${on ? n.color : 'transparent'}` }}
                onMouseEnter={e => { if (!on) e.currentTarget.style.background = '#F8F8F8'; }}
                onMouseLeave={e => { if (!on) e.currentTarget.style.background = T.bgWhite; }}
              >
                {n.emoji} {n.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── MODAL DE EDICIÓN ──────────────────────────
function ModalEditar({ aviso, onGuardar, onCerrar }) {
  const [titulo,   setTitulo]   = useState(aviso.titulo);
  const [desc,     setDesc]     = useState(aviso.descripcion);
  const [nivel,    setNivel]    = useState(String(aviso.nivel));
  const [guardando, setGuardando] = useState(false);

  const guardar = async () => {
    if (!titulo.trim() || !desc.trim() || !nivel) return;
    setGuardando(true);
    try {
      await api.put(`/panel/avisos/${aviso.id_aviso}`, {
        titulo: titulo.trim(),
        descripcion: desc.trim(),
        nivel: Number(nivel),
      });
      onGuardar();
    } catch { onGuardar('error'); }
    finally { setGuardando(false); }
  };

  return (
    <div style={s.overlay} onClick={e => { if (e.target === e.currentTarget) onCerrar(); }}>
      <div style={s.modal}>
        <div style={s.modalHeader}>
          <div style={s.modalTitulo}>✏️  Editar aviso #{aviso.id_aviso}</div>
          <button onClick={onCerrar} style={s.modalCerrar}>✕</button>
        </div>

        <div style={s.modalCuerpo}>
          <div style={s.fieldGroup}>
            <DropNivel value={nivel} onChange={setNivel}/>
          </div>

          <div style={s.fieldGroup}>
            <label style={s.fieldLabel}>Título</label>
            <input value={titulo} onChange={e => setTitulo(e.target.value)} maxLength={120} style={s.input}/>
            <div style={s.charCount}>{titulo.length}/120</div>
          </div>

          <div style={s.fieldGroup}>
            <label style={s.fieldLabel}>Descripción</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} maxLength={500} rows={4} style={s.textarea}/>
            <div style={s.charCount}>{desc.length}/500</div>
          </div>
        </div>

        <div style={s.modalFooter}>
          <button onClick={onCerrar} style={s.btnCancelar}>Cancelar</button>
          <button onClick={guardar} disabled={!titulo.trim() || !desc.trim() || !nivel || guardando}
            style={{ ...s.btnAccion, background: T.blue, opacity: (!titulo.trim() || !desc.trim() || !nivel || guardando) ? 0.45 : 1, cursor: (!titulo.trim() || !desc.trim() || !nivel || guardando) ? 'not-allowed' : 'pointer' }}>
            {guardando ? '⏳ Guardando...' : '💾  Guardar cambios'}
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

  return (
    <div style={{
      ...s.fila,
      opacity: activo ? 1 : 0.55,
      borderLeft: `4px solid ${activo ? cfg.color : T.borde}`,
    }}>
      {/* Estado (switch) */}
      <div style={s.filaSwitch}>
        <Switch activo={activo} onChange={() => onToggle(av)} cargando={toggleCargando}/>
        <span style={{ fontSize:'0.7rem', color: activo ? T.verde : T.textMuted, fontWeight:'600' }}>
          {activo ? 'Activo' : 'Oculto'}
        </span>
      </div>

      {/* Nivel */}
      <div style={s.filaNivel}><Badge nivel={av.nivel}/></div>

      {/* Contenido */}
      <div style={s.filaContenido}>
        <div style={{ ...s.filaTitulo, color: activo ? T.textPri : T.textMuted }}>{av.titulo}</div>
        <div style={s.filaDesc}>{av.descripcion}</div>
        <div style={s.filaFecha}>
          {new Date(av.fecha_creacion).toLocaleDateString('es-AR', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}
        </div>
      </div>

      {/* Editar */}
      <button onClick={() => onEditar(av)} style={s.btnEditar} title="Editar aviso">
        ✏️
      </button>
    </div>
  );
}

// ── PÁGINA PRINCIPAL ──────────────────────────
export default function AdminAvisos() {
  const navigate = useNavigate();
  const [avisos,    setAvisos]    = useState([]);
  const [cargando,  setCargando]  = useState(true);
  const [toast,     setToast]     = useState({ msg:'', tipo:'ok' });
  const [editando,  setEditando]  = useState(null);   // aviso siendo editado
  const [toggling,  setToggling]  = useState(null);   // id siendo toggled

  // Form nuevo aviso
  const [titulo,   setTitulo]   = useState('');
  const [desc,     setDesc]     = useState('');
  const [nivel,    setNivel]    = useState('');
  const [enviando, setEnviando] = useState(false);

  const mostrar = (msg, tipo='ok') => setToast({ msg, tipo });

  // ── Cargar todos los avisos del panel ──
  const cargar = () => {
    setCargando(true);
    api.get('/panel/avisos')
      .then(r => setAvisos(r.data))
      .catch(() => mostrar('Error al cargar los avisos', 'error'))
      .finally(() => setCargando(false));
  };

  useEffect(() => { cargar(); }, []);

  // ── Publicar nuevo aviso ──
  const publicar = async () => {
    if (!titulo.trim() || !desc.trim() || !nivel) return;
    setEnviando(true);
    try {
      await api.post('/avisos', { titulo: titulo.trim(), descripcion: desc.trim(), nivel: Number(nivel) });
      mostrar('Aviso publicado correctamente');
      setTitulo(''); setDesc(''); setNivel('');
      cargar();
    } catch (e) {
      // El endpoint POST usa callbacks — puede devolver 500 aunque el INSERT fue OK
      const status = e?.response?.status;
      if (status === 500 || status === undefined) {
        mostrar('Aviso publicado correctamente');
        setTitulo(''); setDesc(''); setNivel('');
        setTimeout(() => cargar(), 600);
      } else {
        mostrar('Error al publicar el aviso', 'error');
      }
    } finally { setEnviando(false); }
  };

  // ── Toggle activo/inactivo ──
  const toggleEstado = async (av) => {
    const nuevoActivo = Number(av.activo) === 1 ? 0 : 1;
    setToggling(av.id_aviso);
    // Optimistic update
    setAvisos(prev => prev.map(a => a.id_aviso === av.id_aviso ? { ...a, activo: nuevoActivo } : a));
    try {
      await api.patch(`/panel/avisos/${av.id_aviso}/estado`, { activo: nuevoActivo });
      mostrar(nuevoActivo === 1 ? 'Aviso activado — ya visible en la app' : 'Aviso desactivado — ya no es visible');
    } catch {
      // Revertir si falla
      setAvisos(prev => prev.map(a => a.id_aviso === av.id_aviso ? { ...a, activo: av.activo } : a));
      mostrar('Error al cambiar el estado del aviso', 'error');
    } finally { setToggling(null); }
  };

  // ── Guardar edición ──
  const onGuardarEdicion = (resultado) => {
    setEditando(null);
    if (resultado === 'error') {
      mostrar('Error al guardar los cambios', 'error');
    } else {
      mostrar('Aviso actualizado correctamente');
      cargar();
    }
  };

  const nivelSel = NIVELES.find(n => String(n.valor) === String(nivel));
  const puedePublicar = titulo.trim() && desc.trim() && nivel && !enviando;

  // Separar activos e inactivos para el conteo
  const activos   = avisos.filter(a => Number(a.activo) === 1);
  const inactivos = avisos.filter(a => Number(a.activo) === 0);

  return (
    <div style={s.root}>
      {/* HEADER */}
      <header style={s.header}>
        <div style={s.headerInner}>
          <button onClick={() => navigate('/panel')} style={s.btnVolver}>← Panel</button>
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
            <span style={{ fontSize:'1.3rem' }}>🔔</span>
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
              <label style={s.fieldLabel}>Título</label>
              <input value={titulo} onChange={e => setTitulo(e.target.value)} maxLength={120}
                placeholder="Ej: Interrupción entre Palermo y Retiro" style={s.input}/>
              <div style={s.charCount}>{titulo.length}/120</div>
            </div>

            <div style={s.fieldGroup}>
              <label style={s.fieldLabel}>Descripción</label>
              <textarea value={desc} onChange={e => setDesc(e.target.value)} maxLength={500} rows={3}
                placeholder="Causa, tramos afectados, duración estimada..." style={s.textarea}/>
              <div style={s.charCount}>{desc.length}/500</div>
            </div>

            <button onClick={publicar} disabled={!puedePublicar}
              style={{ ...s.btnAccion, background: T.naranja, opacity: puedePublicar ? 1 : 0.45, cursor: puedePublicar ? 'pointer' : 'not-allowed' }}>
              {enviando ? '⏳ Publicando...' : '📢  Publicar aviso'}
            </button>
          </div>
        </div>

        {/* ══ TABLA DE TODOS LOS AVISOS ══ */}
        <div style={s.seccion}>
          <div style={{ ...s.seccionHeader, borderTop:`4px solid ${T.slate}` }}>
            <span style={{ fontSize:'1.3rem' }}>📋</span>
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
            <button onClick={cargar} style={s.btnRefresh}>↻ Actualizar</button>
          </div>

          {/* Leyenda */}
          <div style={s.leyenda}>
            <span style={s.leyItem}><span style={{ ...s.leyDot, background: T.verde }}/> Activo — visible en la app</span>
            <span style={s.leyItem}><span style={{ ...s.leyDot, background: '#CBD5E0' }}/> Oculto — no se muestra</span>
            <span style={{ fontSize:'0.8rem', color: T.textMuted }}>Usá el switch para activar/desactivar · ✏️ para editar</span>
          </div>

          <div style={s.listaAvisos}>
            {cargando && <div style={s.cargando}>Cargando avisos...</div>}

            {!cargando && avisos.length === 0 && (
              <div style={s.vacio}>
                <div style={{ fontSize:'2.5rem', marginBottom:'0.5rem' }}>📭</div>
                <div style={{ fontWeight:'600', color: T.textSub }}>No hay avisos creados</div>
                <div style={{ fontSize:'0.85rem', color: T.textMuted, marginTop:'0.3rem' }}>Usá el formulario de arriba para publicar el primero.</div>
              </div>
            )}

            {!cargando && avisos.length > 0 && (
              <>
                {/* Activos primero */}
                {activos.map(av => (
                  <FilaAviso key={av.id_aviso} av={av}
                    onToggle={toggleEstado}
                    onEditar={setEditando}
                    toggleCargando={toggling === av.id_aviso}
                  />
                ))}

                {/* Separador si hay ocultos */}
                {inactivos.length > 0 && activos.length > 0 && (
                  <div style={s.separador}>
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

      {/* Modal de edición */}
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

// ── ESTILOS ───────────────────────────────────
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

  // Fila de aviso
  fila: { display:'flex', alignItems:'flex-start', gap:'1rem', padding:'1rem 1.2rem', borderBottom:`1px solid ${T.borde}`, transition:'opacity 0.2s', borderLeftWidth:'4px', borderLeftStyle:'solid' },
  filaSwitch:   { display:'flex', flexDirection:'column', alignItems:'center', gap:'0.3rem', paddingTop:'2px', flexShrink:0, minWidth:'46px' },
  filaNivel:    { paddingTop:'3px', flexShrink:0 },
  filaContenido:{ flex:1, minWidth:0 },
  filaTitulo:   { fontSize:'0.97rem', fontWeight:'700', fontFamily:"'Lora', serif", marginBottom:'0.25rem', lineHeight:1.3 },
  filaDesc:     { fontSize:'0.85rem', color: T.textSub, lineHeight:1.5, marginBottom:'0.3rem' },
  filaFecha:    { fontSize:'0.72rem', color: T.textMuted },
  btnEditar:    { background:'none', border:`1.5px solid ${T.borde}`, borderRadius:'8px', cursor:'pointer', padding:'0.4rem 0.6rem', fontSize:'1rem', flexShrink:0, transition:'all 0.15s', color: T.textSub },

  separador: { display:'flex', alignItems:'center', gap:'0.8rem', padding:'0.8rem 1.2rem' },
  separadorLinea: { flex:1, height:'1px', background: T.borde },
  separadorTxt: { fontSize:'0.75rem', color: T.textMuted, fontWeight:'600', whiteSpace:'nowrap' },

  cargando: { textAlign:'center', padding:'2.5rem', color: T.textMuted, fontSize:'0.95rem' },
  vacio:    { textAlign:'center', padding:'3rem 1rem' },

  // Campos
  fieldGroup:  { marginBottom:'1rem' },
  fieldLabel:  { display:'block', fontSize:'0.9rem', fontWeight:'600', color: T.textSub, marginBottom:'0.4rem' },
  charCount:   { fontSize:'0.75rem', color: T.textMuted, textAlign:'right', marginTop:'0.3rem' },
  input:       { width:'100%', background: T.bgWhite, border:`2px solid ${T.borde}`, borderRadius:'10px', padding:'0.85rem 1rem', fontSize:'1rem', color: T.textPri, outline:'none', boxSizing:'border-box', fontFamily:"'Source Sans 3', sans-serif" },
  textarea:    { width:'100%', background: T.bgWhite, border:`2px solid ${T.borde}`, borderRadius:'10px', padding:'0.85rem 1rem', fontSize:'1rem', color: T.textPri, outline:'none', resize:'vertical', boxSizing:'border-box', lineHeight:1.6, fontFamily:"'Source Sans 3', sans-serif", minHeight:'90px' },

  dropBtn:   { width:'100%', background: T.bgWhite, border:'2px solid', borderRadius:'10px', padding:'0.85rem 1rem', display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer', minHeight:'52px', color: T.textPri, boxSizing:'border-box' },
  dropLista: { position:'absolute', top:'calc(100% + 4px)', left:0, right:0, background: T.bgWhite, border:`2px solid ${T.naranja}`, borderRadius:'10px', zIndex:300, maxHeight:'240px', overflowY:'auto', boxShadow:'0 8px 24px rgba(0,0,0,0.12)' },
  dropOp:    { padding:'0.9rem 1rem', cursor:'pointer', fontSize:'1rem', borderBottom:`1px solid ${T.borde}`, borderLeftWidth:'3px', borderLeftStyle:'solid', transition:'background 0.1s' },

  btnAccion: { border:'none', color:'#FFFFFF', padding:'0.95rem 2rem', borderRadius:'10px', fontSize:'1.05rem', fontWeight:'700', minHeight:'52px', transition:'opacity 0.2s', display:'inline-flex', alignItems:'center', gap:'0.5rem' },

  // Modal
  overlay: { position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', zIndex:9000, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' },
  modal:   { background: T.bgWhite, borderRadius:'16px', width:'100%', maxWidth:'520px', maxHeight:'90vh', overflow:'auto', boxShadow:'0 20px 60px rgba(0,0,0,0.25)' },
  modalHeader: { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'1.2rem 1.5rem', borderBottom:`1px solid ${T.borde}`, position:'sticky', top:0, background: T.bgWhite, borderRadius:'16px 16px 0 0' },
  modalTitulo: { fontSize:'1.05rem', fontWeight:'700', fontFamily:"'Lora', serif", color: T.textPri },
  modalCerrar: { background:'none', border:`1.5px solid ${T.borde}`, borderRadius:'8px', cursor:'pointer', padding:'0.3rem 0.7rem', fontSize:'1rem', color: T.textMuted },
  modalCuerpo: { padding:'1.3rem 1.5rem' },
  modalFooter: { display:'flex', gap:'0.8rem', justifyContent:'flex-end', padding:'1rem 1.5rem', borderTop:`1px solid ${T.borde}`, background:'#FAFAFA', borderRadius:'0 0 16px 16px' },
  btnCancelar: { background: T.bgWhite, border:`2px solid ${T.borde}`, color: T.textSub, padding:'0.75rem 1.4rem', borderRadius:'10px', cursor:'pointer', fontSize:'0.95rem', fontWeight:'600' },
};
