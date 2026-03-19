import { useState, useEffect, useCallback, useRef } from 'react';
import api                   from '../../api/belgrano';
import { useSecureNavigate } from '../../hooks/useSecureNavigate';
import { T }                 from '../../utils/constantes';

// [SEC-FIX] Sanitizar texto de API — elimina caracteres de control
function sanitizarTexto(str, max = 200) {
  if (typeof str !== 'string') return '';
  return str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim().slice(0, max);
}

// [SEC-FIX] Validar estación recibida de la API
function validarEstacion(e) {
  if (!e || typeof e !== 'object') return null;
  const id = parseInt(e.id_estacion, 10);
  if (!Number.isInteger(id) || id <= 0) return null;
  return {
    id_estacion:      id,
    nombre_estacion:  sanitizarTexto(e.nombre_estacion || '', 100),
  };
}

// [SEC-FIX] Validar día recibido de la API
function validarDia(d) {
  if (!d || typeof d !== 'object') return null;
  const id = parseInt(d.ID_Dia, 10);
  if (!Number.isInteger(id) || id <= 0) return null;
  return {
    ID_Dia:          id,
    Descripcion_Dia: sanitizarTexto(d.Descripcion_Dia || '', 50),
  };
}

// [SEC-FIX] IDs de sentido válidos
const SENTIDOS_VALIDOS = new Set([1, 2]);

// [SEC-FIX] Validar tren recibido del tablero
function validarTren(t) {
  if (!t || typeof t !== 'object') return null;
  const sentido = parseInt(t.ID_Sentido, 10);
  if (!SENTIDOS_VALIDOS.has(sentido)) return null;
  // Validar formato de horario HH:MM:SS
  const horario = sanitizarTexto(t.Horario || '', 8);
  if (horario && !/^\d{2}:\d{2}(:\d{2})?$/.test(horario)) return null;
  return {
    ID_Sentido:    sentido,
    Horario:       horario,
    Destino_Final: sanitizarTexto(t.Destino_Final || '', 80),
    Estado:        sanitizarTexto(t.Estado || '', 60),
  };
}

// ── DROPDOWN ──────────────────────────────────
function Dropdown({ label, opciones, valorKey, textoKey, value, onChange, placeholder, labelId }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const txt = opciones.find(o => String(o[valorKey]) === String(value))?.[textoKey] || '';

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

  // [SEC-FIX] Validar que el valor elegido existe en las opciones
  const handleChange = (val) => {
    const existe = opciones.some(o => String(o[valorKey]) === String(val));
    if (!existe) return;
    onChange(String(val));
    setOpen(false);
  };

  return (
    <div ref={ref} style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
      <label style={s.dropLabel} id={labelId}>{label}</label>
      <button
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={labelId}
        style={{ ...s.dropBtn, borderColor: value ? T.red : T.borde, color: value ? T.textPri : T.textMuted }}
      >
        <span style={{ fontSize: '1rem', fontWeight: value ? '600' : '400' }}>
          {/* [SEC-FIX] txt ya sanitizado en validarEstacion/validarDia */}
          {txt || placeholder}
        </span>
        <span style={{ fontSize: '0.8rem', color: T.textMuted }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div role="listbox" style={s.dropLista}>
          {opciones.map((op) => {
            const on = String(op[valorKey]) === String(value);
            return (
              <div
                key={op[valorKey]}
                role="option"
                aria-selected={on}
                onClick={() => handleChange(String(op[valorKey]))}
                style={{ ...s.dropOp, background: on ? T.redLight : T.bgWhite, color: on ? T.red : T.textPri, fontWeight: on ? '700' : '400', borderLeft: `3px solid ${on ? T.red : 'transparent'}` }}
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
function FilaTren({ tren, calcMin, colorSentido }) {
  const min  = calcMin(tren.Horario);
  // [SEC-FIX] Horario ya validado con regex HH:MM en validarTren()
  const hora = tren.Horario?.slice(0, 5) || '--:--';
  // [SEC-FIX] destinoFinal ya sanitizado
  const destinoFinal = tren.Destino_Final || '';

  return (
    <div style={{ ...s.trenFila, background: min.urgente ? `${min.color}0d` : T.bgWhite, borderLeft: `4px solid ${min.urgente ? min.color : 'transparent'}` }}>

      <div style={s.trenIzquierda}>
        <div style={s.trenHoraLabel}>Sale a las</div>
        <div style={s.trenHora}>{hora}</div>
        {destinoFinal && (
          <div style={s.trenDestino}>
            <span style={{ ...s.trenDestinoIco, color: colorSentido }} aria-hidden="true">→</span>
            <span style={s.trenDestinoTxt}>{destinoFinal}</span>
          </div>
        )}
      </div>

      <div style={s.trenMedio}>
        {/* [SEC-FIX] Estado ya sanitizado — renderizado como texto plano */}
        {tren.Estado && tren.Estado !== 'En hora' && (
          <span style={{ ...s.trenEstadoBadge, color: T.orange, background: '#FEF0E7', borderColor: '#F0B080' }}>
            {tren.Estado}
          </span>
        )}
      </div>

      <div style={s.trenCountWrap}>
        {min.esAhora ? (
          <div style={{ ...s.countAhora, background: T.red }} role="status" aria-label="El tren llega ahora">
            ¡AHORA!
          </div>
        ) : (
          <div style={s.countNormal} aria-label={`${min.minutos} minutos`}>
            <span style={{ ...s.countNum, color: min.color }}>{min.minutos}</span>
            <span style={s.countLabel}>min</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── TABLERO PRINCIPAL ─────────────────────────
export default function Tablero() {
  const navigate = useSecureNavigate();
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
    let activo = true; // [SEC-FIX] Evitar setState en componente desmontado
    Promise.all([api.get('/estaciones'), api.get('/dias')])
      .then(([e, d]) => {
        if (!activo) return;
        // [SEC-FIX] Validar y sanitizar datos de estaciones y días
        const estLimpias = Array.isArray(e.data)
          ? e.data.map(validarEstacion).filter(Boolean)
          : [];
        const diasLimpios = Array.isArray(d.data)
          ? d.data.map(validarDia).filter(Boolean)
          : [];
        setEstaciones(estLimpias);
        setDias(diasLimpios);
      })
      .catch(() => {
        if (activo) setError('No se pudieron cargar los datos. Intentá de nuevo.');
      });
    return () => { activo = false; };
  }, []);

  const buscar = useCallback(async () => {
    if (!estSel || !diaSel) return;

    // [SEC-FIX] Validar que estSel y diaSel existen en las listas cargadas
    const estValida = estaciones.some(e => String(e.id_estacion) === String(estSel));
    const diaValido = dias.some(d => String(d.ID_Dia) === String(diaSel));
    if (!estValida || !diaValido) {
      setError('Seleccioná una estación y un tipo de día válidos');
      return;
    }

    // [SEC-FIX] Validar que estSel sea un entero positivo antes de usarlo en la URL
    const idEst = parseInt(estSel, 10);
    const idDia = parseInt(diaSel, 10);
    if (!Number.isInteger(idEst) || idEst <= 0 || !Number.isInteger(idDia) || idDia <= 0) {
      setError('Parámetros de búsqueda inválidos');
      return;
    }

    setCargando(true); setError(null); setBuscado(true);
    try {
      const res = await api.get(`/tablero/${idEst}`, {
        params: {
          idDia: idDia,
          hora:  new Date().toLocaleTimeString('it-IT'),
        },
      });

      // [SEC-FIX] Validar y sanitizar cada tren recibido
      const data = Array.isArray(res.data) ? res.data : [];
      const trenes = data.map(validarTren).filter(Boolean).slice(0, 200);
      setResultados(trenes);

      const n = new Date();
      setUltimaAct(`${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`);
    } catch {
      setError('Error al consultar el tablero. Intentá de nuevo.');
      setResultados([]);
    } finally {
      setCargando(false);
    }
  }, [estSel, diaSel, estaciones, dias]);

  const limpiar = () => {
    setEstSel(''); setDiaSel('');
    setResultados([]); setBuscado(false);
    setError(null); setUltimaAct('');
  };

  const calcMin = useCallback((horario) => {
    if (!horario) return { minutos: '--', color: T.textMuted, urgente: false, esAhora: false };
    // [SEC-FIX] horario ya validado con regex en validarTren() — parseo seguro
    const partes = horario.split(':').map(Number);
    if (partes.length < 2 || partes.some(isNaN)) {
      return { minutos: '--', color: T.textMuted, urgente: false, esAhora: false };
    }
    const [h, m, sv = 0] = partes;
    const ahora = new Date();
    const sal   = new Date();
    sal.setHours(h, m, sv, 0);
    const diff = Math.round((sal - ahora) / 60000);
    if (diff <= 0) return { minutos: '0',         color: T.red,    urgente: true,  esAhora: true  };
    if (diff <= 5) return { minutos: String(diff), color: T.orange, urgente: true,  esAhora: false };
    return             { minutos: String(diff), color: T.verde,      urgente: false, esAhora: false };
  }, []);

  const s1 = resultados.filter(t => t.ID_Sentido === 1);
  const s2 = resultados.filter(t => t.ID_Sentido === 2);
  // [SEC-FIX] nombreEst ya sanitizado en validarEstacion()
  const nombreEst = estaciones.find(e => String(e.id_estacion) === String(estSel))?.nombre_estacion || '';

  return (
    <div style={s.root}>

      <header style={s.header}>
        <div style={s.headerInner}>
          <button onClick={() => navigate('/')} style={s.btnVolver} aria-label="Volver al inicio">← Volver</button>
          <div style={s.headerCentro}>
            <div style={s.headerTitulo}>Tablero en Vivo</div>
            <div style={s.headerSub}>Línea Belgrano Norte</div>
          </div>
          <div style={s.horaChip} aria-label={`Hora actual: ${horaActual}`}>{horaActual}</div>
        </div>
        <div style={s.headerLine}/>
      </header>

      <main style={s.main}>

        <div style={s.panel}>
          <div style={s.panelTitulo}>¿Desde qué estación viajás?</div>
          <div style={s.busqFila}>
            <Dropdown
              label="Estación"
              labelId="label-estacion"
              opciones={estaciones}
              valorKey="id_estacion"
              textoKey="nombre_estacion"
              value={estSel}
              onChange={setEstSel}
              placeholder="Seleccioná una estación..."
            />
            <Dropdown
              label="Tipo de día"
              labelId="label-dia"
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
              aria-busy={cargando}
              style={{ ...s.btnBuscar, opacity: (!estSel || !diaSel) ? 0.45 : 1, cursor: (!estSel || !diaSel) ? 'not-allowed' : 'pointer' }}
            >
              {/* [SEC-FIX] SVG en lugar de emoji 🔍 */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ marginRight:'6px' }}>
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              {cargando ? 'Buscando...' : 'Buscar trenes'}
            </button>
            {buscado && <button onClick={limpiar} style={s.btnLimpiar}>Limpiar</button>}
          </div>
          {ultimaAct && <div style={s.ultimaAct} aria-live="polite">Última actualización: {ultimaAct} hs</div>}
        </div>

        {/* [SEC-FIX] Error como texto plano con role="alert" */}
        {error && (
          <div role="alert" style={s.errorCard}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.red} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <span style={s.errorTxt}>{error}</span>
          </div>
        )}

        {!cargando && buscado && resultados.length === 0 && (
          <div style={s.sinServCard}>
            {/* [SEC-FIX] SVG en lugar de emoji 🌙 */}
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={T.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ marginBottom:'0.8rem' }}>
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
            <div style={s.sinServTit}>Sin servicios disponibles</div>
            {/* [SEC-FIX] nombreEst ya sanitizado */}
            <div style={s.sinServSub}>No hay trenes próximos para {nombreEst || 'esta estación'}.</div>
          </div>
        )}

        {!cargando && resultados.length > 0 && (
          <>
            <div style={s.estBanner}>
              <div style={s.estNombreWrap}>
                {/* [SEC-FIX] SVG en lugar de emoji 📍 */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.red} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                {/* [SEC-FIX] nombreEst ya sanitizado */}
                <span style={s.estNombre}>{nombreEst}</span>
              </div>
              <div style={s.estSub}>Próximos trenes · Destino final de cada servicio</div>
            </div>

            <div style={s.grid}>
              {s2.length > 0 && (
                <div style={s.col}>
                  <div style={{ ...s.colHeader, borderBottom: `3px solid ${T.red}`, background: T.redLight }}>
                    <div>
                      <div style={{ ...s.colDir, color: T.red }}>↓ Hacia Retiro</div>
                      <div style={s.colCount}>{s2.length} trenes próximos</div>
                    </div>
                    {/* [SEC-FIX] SVG en lugar de emoji 🚉 */}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={T.red} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="2" y="7" width="20" height="12" rx="2"/>
                      <circle cx="7" cy="19" r="2"/><circle cx="17" cy="19" r="2"/>
                      <path d="M2 12h20M7 7V4M17 7V4"/>
                    </svg>
                  </div>
                  <div role="list" aria-label="Trenes hacia Retiro">
                    {s2.map((t, i) => (
                      <FilaTren key={i} tren={t} calcMin={calcMin} colorSentido={T.red}/>
                    ))}
                  </div>
                </div>
              )}

              {s1.length > 0 && (
                <div style={s.col}>
                  <div style={{ ...s.colHeader, borderBottom: `3px solid ${T.blue}`, background: T.blueLight }}>
                    <div>
                      <div style={{ ...s.colDir, color: T.blue }}>↑ Hacia Villa Rosa</div>
                      <div style={s.colCount}>{s1.length} trenes próximos</div>
                    </div>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={T.blue} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="2" y="7" width="20" height="12" rx="2"/>
                      <circle cx="7" cy="19" r="2"/><circle cx="17" cy="19" r="2"/>
                      <path d="M2 12h20M7 7V4M17 7V4"/>
                    </svg>
                  </div>
                  <div role="list" aria-label="Trenes hacia Villa Rosa">
                    {s1.map((t, i) => (
                      <FilaTren key={i} tren={t} calcMin={calcMin} colorSentido={T.blue}/>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={s.leyenda}>
              <div style={s.leyTitulo}>Referencias de color:</div>
              <div style={s.leyItems}>
                <span style={s.leyItem}><span style={{ ...s.leyDot, background: T.verde }}/><span>Más de 5 minutos</span></span>
                <span style={s.leyItem}><span style={{ ...s.leyDot, background: T.orange }}/><span>Menos de 5 minutos</span></span>
                <span style={s.leyItem}><span style={{ ...s.leyDot, background: T.red }}/><span>Llega ahora</span></span>
              </div>
            </div>
          </>
        )}

      </main>
    </div>
  );
}

const s = {
  root: { backgroundColor: T.bgPage, minHeight: '100vh', fontFamily: "'Source Sans 3', 'Segoe UI', sans-serif", color: T.textPri },
  header: { background: T.bgWhite, boxShadow: `0 2px 8px ${T.sombra}`, position: 'sticky', top: 0, zIndex: 100 },
  headerInner: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', maxWidth: '820px', margin: '0 auto', width: '100%' },
  btnVolver: { background: T.bgWhite, border: `2px solid ${T.borde}`, color: T.textSub, padding: '0.6rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '600', whiteSpace: 'nowrap', minHeight: '44px' },
  headerCentro: { textAlign: 'center' },
  headerTitulo: { fontSize: '1.3rem', fontWeight: '700', color: T.textPri, fontFamily: "'Lora', serif", lineHeight: 1.1 },
  headerSub:  { fontSize: '0.75rem', color: T.textSub, marginTop: '2px' },
  horaChip: { fontSize: '1.4rem', fontWeight: '700', color: T.red, fontVariantNumeric: 'tabular-nums', fontFamily: "'Lora', serif", minWidth: '60px', textAlign: 'right' },
  headerLine: { height: '3px', background: `linear-gradient(90deg, ${T.red}, #E74C3C)` },
  main: { maxWidth: '820px', margin: '0 auto', padding: '1.5rem' },
  panel: { background: T.bgWhite, border: `1.5px solid ${T.borde}`, borderRadius: '16px', padding: '1.4rem', marginBottom: '1.2rem', boxShadow: `0 2px 8px ${T.sombra}` },
  panelTitulo: { fontSize: '1.1rem', fontWeight: '600', color: T.textPri, marginBottom: '1.1rem', fontFamily: "'Lora', serif" },
  busqFila: { display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' },
  dropLabel: { display: 'block', fontSize: '0.9rem', fontWeight: '600', color: T.textSub, marginBottom: '0.4rem' },
  dropBtn: { width: '100%', background: T.bgWhite, border: '2px solid', borderRadius: '10px', padding: '0.85rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'border-color 0.2s', minHeight: '52px', color: T.textPri },
  dropLista: { position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: T.bgWhite, border: `2px solid ${T.red}`, borderRadius: '10px', zIndex: 300, maxHeight: '260px', overflowY: 'auto', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' },
  dropOp: { padding: '0.9rem 1rem', cursor: 'pointer', fontSize: '1rem', borderBottom: `1px solid ${T.borde}`, transition: 'background 0.1s', borderLeftWidth: '3px', borderLeftStyle: 'solid' },
  botonesRow: { display: 'flex', gap: '0.8rem', flexWrap: 'wrap', alignItems: 'center' },
  btnBuscar: { background: T.red, border: 'none', color: '#FFFFFF', padding: '0.9rem 2rem', borderRadius: '10px', fontSize: '1.05rem', fontWeight: '700', minHeight: '52px', transition: 'opacity 0.2s', flexShrink: 0, display: 'inline-flex', alignItems: 'center' },
  btnLimpiar: { background: T.bgWhite, border: `2px solid ${T.borde}`, color: T.textSub, padding: '0.9rem 1.5rem', borderRadius: '10px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', minHeight: '52px' },
  ultimaAct: { fontSize: '0.82rem', color: T.textMuted, marginTop: '0.8rem' },
  errorCard: { display: 'flex', alignItems: 'center', gap: '0.7rem', background: T.redLight, border: `1.5px solid ${T.redBorde}`, borderRadius: '12px', padding: '1rem 1.2rem', marginBottom: '1rem' },
  errorTxt: { fontSize: '0.95rem', color: T.red, fontWeight: '600' },
  sinServCard: { textAlign: 'center', padding: '3rem 1rem', background: T.bgWhite, border: `1.5px solid ${T.borde}`, borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  sinServTit: { fontSize: '1.3rem', fontWeight: '700', color: T.textPri, fontFamily: "'Lora', serif", marginBottom: '0.4rem' },
  sinServSub: { fontSize: '0.95rem', color: T.textSub },
  estBanner:    { marginBottom: '1rem', padding: '0 0.2rem' },
  estNombreWrap:{ display: 'flex', alignItems: 'center', gap: '0.5rem' },
  estNombre: { fontSize: '1.4rem', fontWeight: '700', color: T.textPri, fontFamily: "'Lora', serif" },
  estSub: { fontSize: '0.82rem', color: T.textSub, marginTop: '0.15rem', paddingLeft: '1.7rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1rem' },
  col: { background: T.bgWhite, border: `1.5px solid ${T.borde}`, borderRadius: '16px', overflow: 'hidden', boxShadow: `0 2px 8px ${T.sombra}` },
  colHeader: { padding: '1rem 1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  colDir: { fontSize: '1.1rem', fontWeight: '700', fontFamily: "'Lora', serif" },
  colCount: { fontSize: '0.8rem', color: T.textSub, marginTop: '2px' },
  trenFila: { display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.9rem 1.2rem', borderBottom: `1px solid ${T.borde}`, transition: 'background 0.15s', borderLeftWidth: '4px', borderLeftStyle: 'solid' },
  trenIzquierda: { minWidth: '90px' },
  trenHoraLabel: { fontSize: '0.72rem', color: T.textMuted, marginBottom: '1px' },
  trenHora: { fontSize: '2rem', fontWeight: '700', fontVariantNumeric: 'tabular-nums', color: T.textPri, lineHeight: 1, fontFamily: "'Lora', serif" },
  trenDestino: { display: 'flex', alignItems: 'center', gap: '3px', marginTop: '4px' },
  trenDestinoIco: { fontSize: '0.8rem', fontWeight: '700', lineHeight: 1 },
  trenDestinoTxt: { fontSize: '0.78rem', color: T.textSub, fontWeight: '500', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '110px' },
  trenMedio: { flex: 1 },
  trenEstadoBadge: { display: 'inline-block', fontSize: '0.78rem', fontWeight: '600', border: '1.5px solid', borderRadius: '6px', padding: '3px 8px' },
  trenCountWrap: { textAlign: 'right', minWidth: '64px' },
  countAhora: { display: 'inline-block', color: '#FFFFFF', fontSize: '0.85rem', fontWeight: '800', padding: '6px 12px', borderRadius: '8px', animation: 'pulse 1s infinite' },
  countNormal: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end' },
  countNum: { fontSize: '2.4rem', fontWeight: '800', fontVariantNumeric: 'tabular-nums', lineHeight: 1, fontFamily: "'Lora', serif" },
  countLabel: { fontSize: '0.75rem', color: T.textMuted, fontWeight: '500' },
  leyenda: { background: T.bgWhite, border: `1.5px solid ${T.borde}`, borderRadius: '12px', padding: '1rem 1.2rem', boxShadow: `0 1px 4px ${T.sombra}` },
  leyTitulo: { fontSize: '0.85rem', fontWeight: '600', color: T.textSub, marginBottom: '0.6rem' },
  leyItems:  { display: 'flex', gap: '1.2rem', flexWrap: 'wrap' },
  leyItem: { display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.9rem', color: T.textSub },
  leyDot: { width: '12px', height: '12px', borderRadius: '50%', flexShrink: 0 },
};
