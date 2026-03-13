// frontend/src/pages/AdminTrenes.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/belgrano';

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

// Paleta por posición — igual que AdminEstaciones
const PALETA = [
  { color:'#27AE60', bg:'#EAF7EF', borde:'#A3D9B1', emoji:'✅' },
  { color:'#D35400', bg:'#FEF0E7', borde:'#F0B080', emoji:'⚠️' },
  { color:'#C0392B', bg:'#FDECEA', borde:'#E8A09A', emoji:'🔴' },
  { color:'#1A6FAA', bg:'#EAF3FB', borde:'#9AC4E2', emoji:'🚂' },
];

function getCfg(estados, id) {
  const idx = estados.findIndex(e => Number(e.id_estado) === Number(id));
  return PALETA[idx >= 0 ? idx : 0];
}

// ── TOAST ─────────────────────────────────────
function Toast({ msg, tipo, onClose }) {
  useEffect(() => {
    if (!msg) return;
    const id = setTimeout(onClose, 3500);
    return () => clearTimeout(id);
  }, [msg]);
  if (!msg) return null;
  const ok = tipo === 'ok';
  return (
    <div style={{ position:'fixed', bottom:'1.5rem', right:'1.5rem', background: ok ? T.verdeLight : T.redLight, border:`2px solid ${ok ? T.verdeBorde : T.redBorde}`, borderRadius:'12px', padding:'1rem 1.4rem', display:'flex', alignItems:'center', gap:'0.7rem', boxShadow:'0 4px 20px rgba(0,0,0,0.12)', zIndex:9999, maxWidth:'360px' }}>
      <span>{ok ? '✅' : '❌'}</span>
      <span style={{ fontSize:'0.95rem', fontWeight:'600', color: ok ? T.verde : T.red, flex:1 }}>{msg}</span>
      <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color: T.textMuted }}>✕</button>
    </div>
  );
}

// ── DROPDOWN DE ESTADO ─────────────────────────
function DropEstado({ value, onChange, estados }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const sel    = estados.find(e => Number(e.id_estado) === Number(value));
  const cfgSel = sel ? getCfg(estados, sel.id_estado) : null;

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div ref={ref} style={{ position:'relative' }}>
      <label style={s.fieldLabel}>Nuevo estado</label>
      <button
        onClick={() => setOpen(!open)}
        style={{ ...s.dropBtn, borderColor: value ? T.red : T.borde, color: value ? T.textPri : T.textMuted }}
      >
        <span style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
          {cfgSel && <span>{cfgSel.emoji}</span>}
          <span style={{ fontWeight: value ? '600' : '400', fontSize:'1rem' }}>
            {sel?.descripcion || 'Seleccioná el estado...'}
          </span>
        </span>
        <span style={{ fontSize:'0.8rem', color: T.textMuted }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div style={s.dropLista}>
          {estados.map(est => {
            const on  = Number(est.id_estado) === Number(value);
            const cfg = getCfg(estados, est.id_estado);
            return (
              <div
                key={est.id_estado}
                onClick={() => { onChange(est.id_estado); setOpen(false); }}
                style={{ padding:'0.9rem 1rem', cursor:'pointer', fontSize:'0.97rem', fontWeight: on ? '700' : '400', color: on ? cfg.color : T.textPri, background: on ? cfg.bg : T.bgWhite, borderBottom:`1px solid ${T.borde}`, borderLeft:`3px solid ${on ? cfg.color : 'transparent'}` }}
                onMouseEnter={e => { if (!on) e.currentTarget.style.background = '#F8F8F8'; }}
                onMouseLeave={e => { if (!on) e.currentTarget.style.background = T.bgWhite; }}
              >
                <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                  <span>{cfg.emoji}</span>
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

// ── PÁGINA PRINCIPAL ───────────────────────────
export default function AdminTrenes() {
  const navigate = useNavigate();

  const [estados,   setEstados]   = useState([]);
  const [cargando,  setCargando]  = useState(true);
  const [trenId,    setTrenId]    = useState('');
  const [estado,    setEstado]    = useState('');
  const [enviando,  setEnviando]  = useState(false);
  const [historial, setHistorial] = useState([]);
  const [toast,     setToast]     = useState({ msg:'', tipo:'ok' });

  const mostrar = (msg, tipo = 'ok') => setToast({ msg, tipo });

  useEffect(() => {
    api.get('/panel/estados-tren')
      .then(r => setEstados(r.data))
      .catch(() => mostrar('Error al cargar los estados', 'error'))
      .finally(() => setCargando(false));
  }, []);

  const estadoSel      = estados.find(e => Number(e.id_estado) === Number(estado));
  const cfgSel         = estadoSel ? getCfg(estados, estadoSel.id_estado) : null;
  const puedeActualizar = trenId.trim() && estado && !enviando;

  const actualizar = async () => {
    if (!puedeActualizar) return;
    setEnviando(true);
    try {
      const res = await api.put('/panel/trenes/estado', {
        id_tren:      Number(trenId.trim()),
        nuevo_estado: Number(estado),
      });
      mostrar(res.data.message || 'Estado actualizado correctamente');
      setHistorial(prev => [
        {
          id:          trenId.trim(),
          descripcion: estadoSel.descripcion,
          cfg:         cfgSel,
          hora:        new Date().toLocaleTimeString('es-AR', { hour:'2-digit', minute:'2-digit' }),
        },
        ...prev.slice(0, 9),
      ]);
      setTrenId('');
      setEstado('');
    } catch (e) {
      mostrar(e.response?.data?.error || 'Error al actualizar el tren', 'error');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div style={s.root}>

      {/* HEADER */}
      <header style={s.header}>
        <div style={s.headerInner}>
          <button onClick={() => navigate('/panel')} style={s.btnVolver}>← Panel</button>
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
            <span style={{ fontSize:'1.4rem' }}>🚂</span>
            <div>
              <div style={s.seccionTitulo}>Actualizar estado de un tren</div>
              <div style={s.seccionSub}>El cambio se refleja inmediatamente en el tablero público</div>
            </div>
          </div>
          <div style={s.seccionCuerpo}>
            {cargando ? (
              <div style={{ textAlign:'center', padding:'2rem', color: T.textMuted }}>Cargando estados...</div>
            ) : (
              <>
                <div style={s.fieldGroup}>
                  <label style={s.fieldLabel}>ID del tren</label>
                  <input
                    value={trenId}
                    onChange={e => setTrenId(e.target.value)}
                    placeholder="Ej: 1042"
                    style={{ ...s.input, fontSize:'1.3rem', fontWeight:'700', letterSpacing:'0.05em' }}
                    type="text"
                    inputMode="numeric"
                    onKeyDown={e => { if (e.key === 'Enter' && puedeActualizar) actualizar(); }}
                  />
                  <div style={s.fieldHint}>Ingresá el ID numérico del tren que querés actualizar.</div>
                </div>

                <DropEstado value={estado} onChange={setEstado} estados={estados}/>

                {/* Vista previa del cambio */}
                {trenId.trim() && estadoSel && cfgSel && (
                  <div style={{ ...s.preview, borderColor: cfgSel.borde, background: cfgSel.bg }}>
                    <span style={{ fontSize:'1.3rem' }}>{cfgSel.emoji}</span>
                    <div>
                      <div style={{ fontWeight:'700', color: T.textPri, fontSize:'0.95rem' }}>
                        Tren <span style={{ fontFamily:"'Lora', serif", fontSize:'1.05rem' }}>#{trenId}</span>
                        <span style={{ color: T.textMuted, fontWeight:'400' }}> → </span>
                        <span style={{ color: cfgSel.color }}>{estadoSel.descripcion}</span>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={actualizar}
                  disabled={!puedeActualizar}
                  style={{ ...s.btnAccion, background: T.red, opacity: puedeActualizar ? 1 : 0.45, cursor: puedeActualizar ? 'pointer' : 'not-allowed', marginTop: trenId && estadoSel ? '1rem' : '1.4rem' }}
                >
                  {enviando ? '⏳ Actualizando...' : '🚂  Actualizar tren'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* ══ HISTORIAL ══ */}
        {historial.length > 0 && (
          <div style={s.seccion}>
            <div style={{ ...s.seccionHeader, borderTop:`4px solid ${T.slate}` }}>
              <span style={{ fontSize:'1.4rem' }}>📝</span>
              <div>
                <div style={s.seccionTitulo}>Historial de esta sesión</div>
                <div style={s.seccionSub}>{historial.length} cambio{historial.length !== 1 ? 's' : ''} realizados</div>
              </div>
            </div>
            <div style={s.seccionCuerpo}>
              {historial.map((h, i) => (
                <div key={i} style={{ ...s.histItem, borderLeft:`4px solid ${h.cfg.color}`, background: h.cfg.bg }}>
                  <span style={{ fontSize:'1.1rem' }}>{h.cfg.emoji}</span>
                  <div style={{ flex:1 }}>
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
            <div style={s.ayudaTitulo}>💡 Estados disponibles</div>
            {estados.map(est => {
              const cfg = getCfg(estados, est.id_estado);
              return (
                <div key={est.id_estado} style={s.ayudaItem}>
                  <span style={{ fontSize:'1rem' }}>{cfg.emoji}</span>
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

// ── ESTILOS ────────────────────────────────────
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
