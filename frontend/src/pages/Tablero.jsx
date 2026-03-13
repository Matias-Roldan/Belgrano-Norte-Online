// frontend/src/pages/Tablero.jsx
// ─────────────────────────────────────────────
// BELGRANO NORTE — Tablero en Vivo
// ─────────────────────────────────────────────
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/belgrano';

// ── PALETA ────────────────────────────────────
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
  textPri:   '#1A1A1A',
  textSub:   '#555555',
  textMuted: '#999999',
  borde:     '#E0E0E0',
  sombra:    'rgba(0,0,0,0.07)',
  verde:     '#27AE60',
  urgNaranja:'#E67E22',
  urgRojo:   '#C0392B',
};

// ── DROPDOWN ─────────────────────────────────
function Dropdown({ label, opciones, valorKey, textoKey, value, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const txt = opciones.find(o => String(o[valorKey]) === String(value))?.[textoKey] || '';

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
      <label style={s.dropLabel}>{label}</label>
      <button
        onClick={() => setOpen(!open)}
        style={{
          ...s.dropBtn,
          borderColor: value ? T.red : T.borde,
          color: value ? T.textPri : T.textMuted,
        }}
      >
        <span style={{ fontSize: '1rem', fontWeight: value ? '600' : '400' }}>
          {txt || placeholder}
        </span>
        <span style={{ fontSize: '0.8rem', color: T.textMuted }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div style={s.dropLista}>
          {opciones.map((op) => {
            const on = String(op[valorKey]) === String(value);
            return (
              <div
                key={op[valorKey]}
                onClick={() => { onChange(String(op[valorKey])); setOpen(false); }}
                style={{
                  ...s.dropOp,
                  background: on ? T.redLight : T.bgWhite,
                  color:      on ? T.red      : T.textPri,
                  fontWeight: on ? '700'      : '400',
                  borderLeft: `3px solid ${on ? T.red : 'transparent'}`,
                }}
                onMouseEnter={e => { if (!on) e.currentTarget.style.background = '#F8F8F8'; }}
                onMouseLeave={e => { if (!on) e.currentTarget.style.background = T.bgWhite; }}
              >
                {op[textoKey]}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── FILA DE TREN ──────────────────────────────
// Ahora muestra Destino_Final debajo de la hora
function FilaTren({ tren, calcMin, colorSentido }) {
  const min  = calcMin(tren.Horario);
  const hora = tren.Horario?.slice(0, 5) || '--:--';

  // Si el destino final no es la cabecera del sentido, mostrar advertencia
  const destinoFinal = tren.Destino_Final || '';

  return (
    <div style={{
      ...s.trenFila,
      background: min.urgente ? `${min.color}0d` : T.bgWhite,
      borderLeft: `4px solid ${min.urgente ? min.color : 'transparent'}`,
    }}>

      {/* ── Hora + Destino ── */}
      <div style={s.trenIzquierda}>
        <div style={s.trenHoraLabel}>Sale a las</div>
        <div style={s.trenHora}>{hora}</div>
        {/* Destino final — info clave para decidir si subirse */}
        {destinoFinal && (
          <div style={s.trenDestino}>
            <span style={{ ...s.trenDestinoIco, color: colorSentido }}>→</span>
            <span style={s.trenDestinoTxt}>{destinoFinal}</span>
          </div>
        )}
      </div>

      {/* ── Estado del tren ── */}
      <div style={s.trenMedio}>
        {tren.Estado && tren.Estado !== 'En hora' && (
          <span style={{
            ...s.trenEstadoBadge,
            color:       T.orange,
            background:  '#FEF0E7',
            borderColor: '#F0B080',
          }}>
            {tren.Estado}
          </span>
        )}
      </div>

      {/* ── Countdown ── */}
      <div style={s.trenCountWrap}>
        {min.esAhora ? (
          <div style={{ ...s.countAhora, background: T.urgRojo }}>
            ¡AHORA!
          </div>
        ) : (
          <div style={s.countNormal}>
            <span style={{ ...s.countNum, color: min.color }}>
              {min.minutos}
            </span>
            <span style={s.countLabel}>min</span>
          </div>
        )}
      </div>

    </div>
  );
}

// ── TABLERO PRINCIPAL ─────────────────────────
export default function Tablero() {
  const navigate = useNavigate();
  const [estaciones, setEstaciones] = useState([]);
  const [dias,       setDias]       = useState([]);
  const [estSel,     setEstSel]     = useState('');
  const [diaSel,     setDiaSel]     = useState('');
  const [resultados, setResultados] = useState([]);
  const [buscado,    setBuscado]    = useState(false);
  const [cargando,   setCargando]   = useState(false);
  const [error,      setError]      = useState(null);
  const [horaActual, setHoraActual] = useState('');
  const [ultimaAct,  setUltimaAct]  = useState('');

  useEffect(() => {
    const tick = () => {
      const n = new Date();
      setHoraActual(`${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    Promise.all([api.get('/estaciones'), api.get('/dias')])
      .then(([e, d]) => { setEstaciones(e.data); setDias(d.data); })
      .catch(() => setError('No se pudieron cargar los datos. Intentá de nuevo.'));
  }, []);

  const buscar = useCallback(async () => {
    if (!estSel || !diaSel) return;
    setCargando(true); setError(null); setBuscado(true);
    try {
      const res = await api.get(`/tablero/${estSel}`, {
        params: { idDia: diaSel, hora: new Date().toLocaleTimeString('it-IT') },
      });
      setResultados(res.data);
      const n = new Date();
      setUltimaAct(`${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`);
    } catch {
      setError('Error al consultar el tablero. Intentá de nuevo.');
      setResultados([]);
    } finally { setCargando(false); }
  }, [estSel, diaSel]);

  const limpiar = () => {
    setEstSel(''); setDiaSel('');
    setResultados([]); setBuscado(false);
    setError(null); setUltimaAct('');
  };

  const calcMin = useCallback((horario) => {
    if (!horario) return { minutos: '--', color: T.textMuted, urgente: false, esAhora: false };
    const ahora  = new Date();
    const [h, m, sv] = horario.split(':').map(Number);
    const sal = new Date(); sal.setHours(h, m, sv || 0, 0);
    const diff = Math.round((sal - ahora) / 60000);
    if (diff <= 0) return { minutos: '0',         color: T.urgRojo,    urgente: true,  esAhora: true  };
    if (diff <= 5) return { minutos: String(diff), color: T.urgNaranja, urgente: true,  esAhora: false };
    return             { minutos: String(diff), color: T.verde,      urgente: false, esAhora: false };
  }, []);

  const s1 = resultados.filter(t => t.ID_Sentido === 1);
  const s2 = resultados.filter(t => t.ID_Sentido === 2);
  const nombreEst = estaciones.find(e => String(e.id_estacion) === String(estSel))?.nombre_estacion || '';

  return (
    <div style={s.root}>

      {/* ── HEADER ── */}
      <header style={s.header}>
        <div style={s.headerInner}>
          <button onClick={() => navigate('/')} style={s.btnVolver}>← Volver</button>
          <div style={s.headerCentro}>
            <div style={s.headerTitulo}>Tablero en Vivo</div>
            <div style={s.headerSub}>Línea Belgrano Norte</div>
          </div>
          <div style={s.horaChip}>{horaActual}</div>
        </div>
        <div style={s.headerLine}/>
      </header>

      <main style={s.main}>

        {/* ── PANEL DE BÚSQUEDA ── */}
        <div style={s.panel}>
          <div style={s.panelTitulo}>¿Desde qué estación viajás?</div>
          <div style={s.busqFila}>
            <Dropdown
              label="Estación"
              opciones={estaciones}
              valorKey="id_estacion"
              textoKey="nombre_estacion"
              value={estSel}
              onChange={setEstSel}
              placeholder="Seleccioná una estación..."
            />
            <Dropdown
              label="Tipo de día"
              opciones={dias}
              valorKey="ID_Dia"
              textoKey="Descripcion_Dia"
              value={diaSel}
              onChange={setDiaSel}
              placeholder="Seleccioná el día..."
            />
          </div>
          <div style={s.botonesRow}>
            <button
              onClick={buscar}
              disabled={!estSel || !diaSel || cargando}
              style={{
                ...s.btnBuscar,
                opacity: (!estSel || !diaSel) ? 0.45 : 1,
                cursor:  (!estSel || !diaSel) ? 'not-allowed' : 'pointer',
              }}
            >
              {cargando ? 'Buscando...' : '🔍  Buscar trenes'}
            </button>
            {buscado && <button onClick={limpiar} style={s.btnLimpiar}>Limpiar</button>}
          </div>
          {ultimaAct && <div style={s.ultimaAct}>Última actualización: {ultimaAct} hs</div>}
        </div>

        {/* ── ERROR ── */}
        {error && (
          <div style={s.errorCard}>
            <span style={s.errorIco}>⚠️</span>
            <span style={s.errorTxt}>{error}</span>
          </div>
        )}

        {/* ── SIN RESULTADOS ── */}
        {!cargando && buscado && resultados.length === 0 && (
          <div style={s.sinServCard}>
            <div style={s.sinServIco}>🌙</div>
            <div style={s.sinServTit}>Sin servicios disponibles</div>
            <div style={s.sinServSub}>No hay trenes próximos para {nombreEst}.</div>
          </div>
        )}

        {/* ── RESULTADOS ── */}
        {!cargando && resultados.length > 0 && (
          <>
            <div style={s.estBanner}>
              <div style={s.estNombreWrap}>
                <span style={s.estIco}>📍</span>
                <span style={s.estNombre}>{nombreEst}</span>
              </div>
              <div style={s.estSub}>Próximos trenes · Mostrá el destino final de cada servicio</div>
            </div>

            <div style={s.grid}>

              {/* ── Hacia Retiro ── */}
              {s2.length > 0 && (
                <div style={s.col}>
                  <div style={{ ...s.colHeader, borderBottom: `3px solid ${T.red}`, background: T.redLight }}>
                    <div>
                      <div style={{ ...s.colDir, color: T.red }}>↓ Hacia Retiro</div>
                      <div style={s.colCount}>{s2.length} trenes próximos</div>
                    </div>
                    <div style={{ fontSize: '1.5rem' }}>🚉</div>
                  </div>
                  <div>
                    {s2.map((t, i) => (
                      <FilaTren key={i} tren={t} calcMin={calcMin} colorSentido={T.red}/>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Hacia Villa Rosa ── */}
              {s1.length > 0 && (
                <div style={s.col}>
                  <div style={{ ...s.colHeader, borderBottom: `3px solid ${T.blue}`, background: T.blueLight }}>
                    <div>
                      <div style={{ ...s.colDir, color: T.blue }}>↑ Hacia Villa Rosa</div>
                      <div style={s.colCount}>{s1.length} trenes próximos</div>
                    </div>
                    <div style={{ fontSize: '1.5rem' }}>🚉</div>
                  </div>
                  <div>
                    {s1.map((t, i) => (
                      <FilaTren key={i} tren={t} calcMin={calcMin} colorSentido={T.blue}/>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* ── Leyenda ── */}
            <div style={s.leyenda}>
              <div style={s.leyTitulo}>Referencias de color:</div>
              <div style={s.leyItems}>
                <span style={s.leyItem}>
                  <span style={{ ...s.leyDot, background: T.verde }}/>
                  <span>Más de 5 minutos</span>
                </span>
                <span style={s.leyItem}>
                  <span style={{ ...s.leyDot, background: T.urgNaranja }}/>
                  <span>Menos de 5 minutos</span>
                </span>
                <span style={s.leyItem}>
                  <span style={{ ...s.leyDot, background: T.urgRojo }}/>
                  <span>Llega ahora</span>
                </span>
              </div>
            </div>
          </>
        )}

      </main>
    </div>
  );
}

// ── ESTILOS ───────────────────────────────────
const s = {
  root: {
    backgroundColor: T.bgPage,
    minHeight: '100vh',
    fontFamily: "'Source Sans 3', 'Segoe UI', sans-serif",
    color: T.textPri,
  },
  header: {
    background: T.bgWhite,
    boxShadow: `0 2px 8px ${T.sombra}`,
    position: 'sticky', top: 0, zIndex: 100,
  },
  headerInner: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', padding: '1rem 1.5rem',
    maxWidth: '820px', margin: '0 auto', width: '100%',
  },
  btnVolver: {
    background: T.bgWhite, border: `2px solid ${T.borde}`,
    color: T.textSub, padding: '0.6rem 1rem',
    borderRadius: '8px', cursor: 'pointer',
    fontSize: '0.95rem', fontWeight: '600',
    whiteSpace: 'nowrap', minHeight: '44px',
  },
  headerCentro: { textAlign: 'center' },
  headerTitulo: {
    fontSize: '1.3rem', fontWeight: '700', color: T.textPri,
    fontFamily: "'Lora', serif", lineHeight: 1.1,
  },
  headerSub:  { fontSize: '0.75rem', color: T.textSub, marginTop: '2px' },
  horaChip: {
    fontSize: '1.4rem', fontWeight: '700', color: T.red,
    fontVariantNumeric: 'tabular-nums',
    fontFamily: "'Lora', serif",
    minWidth: '60px', textAlign: 'right',
  },
  headerLine: { height: '3px', background: `linear-gradient(90deg, ${T.red}, #E74C3C)` },

  main:  { maxWidth: '820px', margin: '0 auto', padding: '1.5rem' },

  panel: {
    background: T.bgWhite, border: `1.5px solid ${T.borde}`,
    borderRadius: '16px', padding: '1.4rem',
    marginBottom: '1.2rem', boxShadow: `0 2px 8px ${T.sombra}`,
  },
  panelTitulo: {
    fontSize: '1.1rem', fontWeight: '600', color: T.textPri,
    marginBottom: '1.1rem', fontFamily: "'Lora', serif",
  },
  busqFila: { display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' },

  dropLabel: {
    display: 'block', fontSize: '0.9rem', fontWeight: '600',
    color: T.textSub, marginBottom: '0.4rem',
  },
  dropBtn: {
    width: '100%', background: T.bgWhite, border: '2px solid',
    borderRadius: '10px', padding: '0.85rem 1rem',
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', cursor: 'pointer',
    transition: 'border-color 0.2s', minHeight: '52px', color: T.textPri,
  },
  dropLista: {
    position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
    background: T.bgWhite, border: `2px solid ${T.red}`,
    borderRadius: '10px', zIndex: 300, maxHeight: '260px', overflowY: 'auto',
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
  },
  dropOp: {
    padding: '0.9rem 1rem', cursor: 'pointer', fontSize: '1rem',
    borderBottom: `1px solid ${T.borde}`, transition: 'background 0.1s',
    borderLeftWidth: '3px', borderLeftStyle: 'solid',
  },

  botonesRow: { display: 'flex', gap: '0.8rem', flexWrap: 'wrap' },
  btnBuscar: {
    background: T.red, border: 'none', color: '#FFFFFF',
    padding: '0.9rem 2rem', borderRadius: '10px',
    fontSize: '1.05rem', fontWeight: '700',
    minHeight: '52px', transition: 'opacity 0.2s', flexShrink: 0,
  },
  btnLimpiar: {
    background: T.bgWhite, border: `2px solid ${T.borde}`,
    color: T.textSub, padding: '0.9rem 1.5rem',
    borderRadius: '10px', fontSize: '1rem',
    fontWeight: '600', cursor: 'pointer', minHeight: '52px',
  },
  ultimaAct: { fontSize: '0.82rem', color: T.textMuted, marginTop: '0.8rem' },

  errorCard: {
    display: 'flex', alignItems: 'center', gap: '0.7rem',
    background: T.redLight, border: `1.5px solid ${T.redBorde}`,
    borderRadius: '12px', padding: '1rem 1.2rem', marginBottom: '1rem',
  },
  errorIco: { fontSize: '1.3rem' },
  errorTxt: { fontSize: '0.95rem', color: T.red, fontWeight: '600' },

  sinServCard: {
    textAlign: 'center', padding: '3rem 1rem',
    background: T.bgWhite, border: `1.5px solid ${T.borde}`,
    borderRadius: '16px',
  },
  sinServIco: { fontSize: '3rem', marginBottom: '0.8rem' },
  sinServTit: {
    fontSize: '1.3rem', fontWeight: '700', color: T.textPri,
    fontFamily: "'Lora', serif", marginBottom: '0.4rem',
  },
  sinServSub: { fontSize: '0.95rem', color: T.textSub },

  estBanner:    { marginBottom: '1rem', padding: '0 0.2rem' },
  estNombreWrap:{ display: 'flex', alignItems: 'center', gap: '0.5rem' },
  estIco:       { fontSize: '1.2rem' },
  estNombre: {
    fontSize: '1.4rem', fontWeight: '700', color: T.textPri,
    fontFamily: "'Lora', serif",
  },
  estSub: { fontSize: '0.82rem', color: T.textSub, marginTop: '0.15rem', paddingLeft: '1.7rem' },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1rem', marginBottom: '1rem',
  },
  col: {
    background: T.bgWhite, border: `1.5px solid ${T.borde}`,
    borderRadius: '16px', overflow: 'hidden',
    boxShadow: `0 2px 8px ${T.sombra}`,
  },
  colHeader: {
    padding: '1rem 1.2rem',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  colDir: { fontSize: '1.1rem', fontWeight: '700', fontFamily: "'Lora', serif" },
  colCount: { fontSize: '0.8rem', color: T.textSub, marginTop: '2px' },

  // ── Fila de tren ──
  trenFila: {
    display: 'flex', alignItems: 'center',
    gap: '0.8rem', padding: '0.9rem 1.2rem',
    borderBottom: `1px solid ${T.borde}`,
    transition: 'background 0.15s',
    borderLeftWidth: '4px', borderLeftStyle: 'solid',
  },
  trenIzquierda: { minWidth: '90px' },
  trenHoraLabel: { fontSize: '0.72rem', color: T.textMuted, marginBottom: '1px' },
  trenHora: {
    fontSize: '2rem', fontWeight: '700',
    fontVariantNumeric: 'tabular-nums',
    color: T.textPri, lineHeight: 1,
    fontFamily: "'Lora', serif",
  },
  // Destino final — debajo de la hora, pequeño pero legible
  trenDestino: {
    display: 'flex', alignItems: 'center', gap: '3px',
    marginTop: '4px',
  },
  trenDestinoIco: { fontSize: '0.8rem', fontWeight: '700', lineHeight: 1 },
  trenDestinoTxt: {
    fontSize: '0.78rem', color: T.textSub,
    fontWeight: '500', lineHeight: 1.2,
    whiteSpace: 'nowrap', overflow: 'hidden',
    textOverflow: 'ellipsis', maxWidth: '110px',
  },

  trenMedio: { flex: 1 },
  trenEstadoBadge: {
    display: 'inline-block', fontSize: '0.78rem',
    fontWeight: '600', border: '1.5px solid',
    borderRadius: '6px', padding: '3px 8px',
  },

  trenCountWrap:  { textAlign: 'right', minWidth: '64px' },
  countAhora: {
    display: 'inline-block',
    color: '#FFFFFF', fontSize: '0.85rem', fontWeight: '800',
    padding: '6px 12px', borderRadius: '8px',
    animation: 'pulse 1s infinite',
  },
  countNormal: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end' },
  countNum: {
    fontSize: '2.4rem', fontWeight: '800',
    fontVariantNumeric: 'tabular-nums', lineHeight: 1,
    fontFamily: "'Lora', serif",
  },
  countLabel: { fontSize: '0.75rem', color: T.textMuted, fontWeight: '500' },

  leyenda: {
    background: T.bgWhite, border: `1.5px solid ${T.borde}`,
    borderRadius: '12px', padding: '1rem 1.2rem',
    boxShadow: `0 1px 4px ${T.sombra}`,
  },
  leyTitulo: { fontSize: '0.85rem', fontWeight: '600', color: T.textSub, marginBottom: '0.6rem' },
  leyItems:  { display: 'flex', gap: '1.2rem', flexWrap: 'wrap' },
  leyItem: {
    display: 'flex', alignItems: 'center', gap: '0.45rem',
    fontSize: '0.9rem', color: T.textSub,
  },
  leyDot: { width: '12px', height: '12px', borderRadius: '50%', flexShrink: 0 },
};
