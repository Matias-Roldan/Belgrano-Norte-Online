// frontend/src/pages/AdminEstaciones.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/belgrano';

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

// Paleta fija por posición de ID (el orden del SP define el color)
// id más bajo = Operativa = verde, siguiente = naranja, siguiente = rojo
const PALETA = [
  { color:'#27AE60', bg:'#EAF7EF', borde:'#A3D9B1', emoji:'✅' },
  { color:'#D35400', bg:'#FEF0E7', borde:'#F0B080', emoji:'⚠️' },
  { color:'#C0392B', bg:'#FDECEA', borde:'#E8A09A', emoji:'🔴' },
  { color:'#1A6FAA', bg:'#EAF3FB', borde:'#9AC4E2', emoji:'ℹ️' },
];

// Devuelve { color, bg, borde, emoji } para un id_estado dado
// usando la lista de estados como referencia de orden
function getCfg(estados, id) {
  const idx = estados.findIndex(e => Number(e.id_estado_estacion) === Number(id));
  return PALETA[idx >= 0 ? idx : 0];
}

// ── TOAST ─────────────────────────────────────────────
function Toast({ msg, tipo, onClose }) {
  useEffect(() => {
    if (!msg) return;
    const id = setTimeout(onClose, 3500);
    return () => clearTimeout(id);
  }, [msg]);
  if (!msg) return null;
  const ok = tipo === 'ok';
  return (
    <div style={{
      position:'fixed', bottom:'1.5rem', right:'1.5rem',
      background: ok ? T.verdeLight : T.redLight,
      border:`2px solid ${ok ? T.verdeBorde : T.redBorde}`,
      borderRadius:'12px', padding:'1rem 1.4rem',
      display:'flex', alignItems:'center', gap:'0.7rem',
      boxShadow:'0 4px 20px rgba(0,0,0,0.12)', zIndex:9999, maxWidth:'360px',
    }}>
      <span>{ok ? '✅' : '❌'}</span>
      <span style={{ fontSize:'0.95rem', fontWeight:'600', color: ok ? T.verde : T.red, flex:1 }}>{msg}</span>
      <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color: T.textMuted }}>✕</button>
    </div>
  );
}

// ── DROPDOWN INLINE POR FILA ───────────────────────────
function DropEstado({ idEstacion, idEstadoActual, estados, onActualizar }) {
  const [open,      setOpen]      = useState(false);
  const [guardando, setGuardando] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const cambiar = async (nuevoId) => {
    if (Number(nuevoId) === Number(idEstadoActual)) { setOpen(false); return; }
    setOpen(false);
    setGuardando(true);
    try {
      await api.put('/panel/estaciones/estado', {
        id_estacion:  Number(idEstacion),
        nuevo_estado: Number(nuevoId),
      });
      onActualizar(idEstacion, nuevoId, true);
    } catch {
      onActualizar(idEstacion, idEstadoActual, false);
    } finally {
      setGuardando(false);
    }
  };

  const cfg         = getCfg(estados, idEstadoActual);
  const estActual   = estados.find(e => Number(e.id_estado_estacion) === Number(idEstadoActual));

  return (
    <div ref={ref} style={{ position:'relative' }}>
      <button
        onClick={() => !guardando && setOpen(!open)}
        style={{
          display:'inline-flex', alignItems:'center', gap:'0.4rem',
          fontSize:'0.8rem', fontWeight:'700',
          color:       guardando ? T.textMuted : cfg.color,
          background:  guardando ? '#F5F5F5'   : cfg.bg,
          border:     `1.5px solid ${guardando ? T.borde : cfg.borde}`,
          borderRadius:'20px', padding:'5px 12px',
          cursor: guardando ? 'wait' : 'pointer',
          transition:'all 0.15s', whiteSpace:'nowrap',
        }}
      >
        {guardando
          ? <><span>⏳</span><span>Guardando...</span></>
          : <><span>{cfg.emoji}</span><span>{estActual?.descripcion ?? '—'}</span><span style={{ fontSize:'0.65rem', opacity:0.6 }}>▼</span></>
        }
      </button>

      {open && (
        <div style={{
          position:'absolute', top:'calc(100% + 4px)', right:0,
          background: T.bgWhite, border:`2px solid ${T.blue}`,
          borderRadius:'10px', zIndex:300,
          minWidth:'190px', boxShadow:'0 8px 24px rgba(0,0,0,0.13)',
          overflow:'hidden',
        }}>
          {estados.map(est => {
            const on  = Number(est.id_estado_estacion) === Number(idEstadoActual);
            const c   = getCfg(estados, est.id_estado_estacion);
            return (
              <div
                key={est.id_estado_estacion}
                onClick={() => cambiar(est.id_estado_estacion)}
                style={{
                  padding:'0.8rem 1rem', cursor:'pointer',
                  fontSize:'0.92rem', fontWeight: on ? '700' : '400',
                  color:      on ? c.color  : T.textPri,
                  background: on ? c.bg     : T.bgWhite,
                  borderBottom:`1px solid ${T.borde}`,
                  borderLeft:`3px solid ${on ? c.color : 'transparent'}`,
                  display:'flex', alignItems:'center', gap:'0.5rem',
                }}
                onMouseEnter={e => { if (!on) e.currentTarget.style.background = '#F8F8F8'; }}
                onMouseLeave={e => { if (!on) e.currentTarget.style.background = T.bgWhite; }}
              >
                <span>{c.emoji}</span>
                <span>{est.descripcion}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── PÁGINA PRINCIPAL ───────────────────────────────────
export default function AdminEstaciones() {
  const navigate = useNavigate();

  const [estaciones, setEstaciones] = useState([]);
  const [estados,    setEstados]    = useState([]);
  const [cargando,   setCargando]   = useState(true);
  const [filtro,     setFiltro]     = useState('');
  const [toast,      setToast]      = useState({ msg:'', tipo:'ok' });

  const mostrar = (msg, tipo = 'ok') => setToast({ msg, tipo });

  const cargar = () => {
    setCargando(true);
    Promise.all([
      api.get('/estaciones'),              // { id_estacion, nombre_estacion, id_estado_estacion }
      api.get('/panel/estados-estacion'),  // { id_estado_estacion, descripcion }
    ])
      .then(([resEst, resEstados]) => {
        const listaEstados = resEstados.data;
        setEstados(listaEstados);
        setEstaciones(resEst.data.map(e => ({
          ...e,
          // Si el SP de estaciones no devuelve id_estado_estacion, usamos el primero de la lista
          id_estado_estacion: e.id_estado_estacion ?? listaEstados[0]?.id_estado_estacion ?? 1,
        })));
      })
      .catch(() => mostrar('Error al cargar los datos', 'error'))
      .finally(() => setCargando(false));
  };

  useEffect(() => { cargar(); }, []);

  const onActualizar = (id, nuevoIdEstado, ok) => {
    if (ok) {
      setEstaciones(prev => prev.map(e =>
        String(e.id_estacion) === String(id)
          ? { ...e, id_estado_estacion: Number(nuevoIdEstado) }
          : e
      ));
      const desc = estados.find(e => Number(e.id_estado_estacion) === Number(nuevoIdEstado))?.descripcion || '';
      mostrar(`Estado actualizado: ${desc}`);
    } else {
      mostrar('Error al actualizar el estado', 'error');
    }
  };

  const filtradas = estaciones.filter(e =>
    e.nombre_estacion.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div style={s.root}>

      {/* ── HEADER ── */}
      <header style={s.header}>
        <div style={s.headerInner}>
          <button onClick={() => navigate('/panel')} style={s.btnVolver}>← Panel</button>
          <div style={s.headerCentro}>
            <div style={s.headerTitulo}>Estaciones</div>
            <div style={s.headerSub}>Estado operativo · {estaciones.length} estaciones</div>
          </div>
          <div style={{ width:'60px' }}/>
        </div>
        <div style={{ height:'3px', background:`linear-gradient(90deg, ${T.blue}, #2980B9)` }}/>
      </header>

      <main style={s.main}>

        {/* Toolbar */}
        <div style={s.toolbar}>
          <input
            value={filtro}
            onChange={e => setFiltro(e.target.value)}
            placeholder="🔍  Buscar estación..."
            style={s.buscador}
          />
          <button onClick={cargar} style={s.btnRefresh}>↻ Actualizar</button>
        </div>

        {/* Leyenda dinámica — se arma con los estados que devuelve la BD */}
        {estados.length > 0 && (
          <div style={s.leyenda}>
            {estados.map(est => {
              const cfg = getCfg(estados, est.id_estado_estacion);
              return (
                <span key={est.id_estado_estacion} style={s.leyItem}>
                  <span style={{ ...s.leyDot, background: cfg.color }}/>
                  {est.descripcion}
                </span>
              );
            })}
          </div>
        )}

        {/* Lista de estaciones */}
        <div style={s.lista}>
          {cargando && <div style={s.cargando}>Cargando estaciones...</div>}

          {!cargando && filtradas.length === 0 && filtro && (
            <div style={s.vacio}>No hay estaciones que coincidan con "{filtro}"</div>
          )}

          {!cargando && filtradas.map((est, i) => {
            const cfg = getCfg(estados, est.id_estado_estacion);
            return (
              <div key={est.id_estacion} style={{
                ...s.fila,
                background:  i % 2 === 0 ? T.bgWhite : '#FAFAFA',
                borderLeft: `4px solid ${cfg.color}`,
              }}>
                <div style={s.filaNum}>{est.id_estacion}</div>

                <div style={s.filaNombre}>
                  <span style={{ fontSize:'0.95rem' }}>🚉</span>
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

// ── ESTILOS ────────────────────────────────────────────
const s = {
  root: { backgroundColor: T.bgPage, minHeight:'100vh', fontFamily:"'Source Sans 3', sans-serif", color: T.textPri },

  header: { background: T.bgWhite, boxShadow:`0 2px 8px ${T.sombra}`, position:'sticky', top:0, zIndex:100 },
  headerInner: { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'1rem 1.5rem', maxWidth:'720px', margin:'0 auto', width:'100%' },
  btnVolver: { background: T.bgWhite, border:`2px solid ${T.borde}`, color: T.textSub, padding:'0.6rem 1rem', borderRadius:'8px', cursor:'pointer', fontSize:'0.95rem', fontWeight:'600', whiteSpace:'nowrap', minHeight:'44px' },
  headerCentro: { textAlign:'center' },
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
