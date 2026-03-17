// frontend/src/pages/Planificar.jsx
// ─────────────────────────────────────────────
// BELGRANO NORTE — Planificar Viaje
// ─────────────────────────────────────────────
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/belgrano';

// ── PALETA ────────────────────────────────────
const T = {
  bgPage:       '#F5F5F0',
  bgWhite:      '#FFFFFF',
  red:          '#C0392B',
  redLight:     '#FDECEA',
  redBorde:     '#E8A09A',
  blue:         '#1A6FAA',
  blueLight:    '#EAF3FB',
  blueBorde:    '#9AC4E2',
  textPri:      '#1A1A1A',
  textSub:      '#555555',
  textMuted:    '#999999',
  borde:        '#E0E0E0',
  sombra:       'rgba(0,0,0,0.07)',
  verde:        '#27AE60',
  verdeLight:   '#EAF7EF',
  verdeBorde:   '#A3D9B1',
  naranja:      '#D35400',
  naranjaLight: '#FEF0E7',
  naranjaBorde: '#F0B080',
};

// ── HORAS ─────────────────────────────────────
const HORAS = Array.from({ length: 24 }, (_, i) => ({
  valor: `${String(i).padStart(2, '0')}:00:00`,
  texto: `${String(i).padStart(2, '0')}:00 hs`,
}));

// ── DROPDOWN GENÉRICO ─────────────────────────
function Dropdown({ label, opciones, valorKey, textoKey, value, onChange, placeholder, acento, deshabilitado }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const txt = opciones.find(o => String(o[valorKey]) === String(value))?.[textoKey] || '';
  const color = acento || T.red;

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
      <label style={s.dropLabel}>{label}</label>
      <button
        onClick={() => { if (!deshabilitado) setOpen(!open); }}
        style={{
          ...s.dropBtn,
          borderColor: value ? color : T.borde,
          color: value ? T.textPri : T.textMuted,
          opacity: deshabilitado ? 0.5 : 1,
          cursor: deshabilitado ? 'not-allowed' : 'pointer',
        }}
      >
        <span style={{ fontSize: '1rem', fontWeight: value ? '600' : '400' }}>
          {txt || placeholder}
        </span>
        <span style={{ fontSize: '0.8rem', color: T.textMuted }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && !deshabilitado && (
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
                  borderLeft: `3px solid ${on ? color : 'transparent'}`,
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

// ── DROPDOWN DE HORAS ─────────────────────────
function DropdownHora({ label, value, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const txt = HORAS.find(h => h.valor === value)?.texto || '';

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative', flex: 1, minWidth: '150px' }}>
      <label style={s.dropLabel}>{label}</label>
      <button
        onClick={() => setOpen(!open)}
        style={{
          ...s.dropBtn,
          borderColor: value ? T.blue : T.borde,
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
          {HORAS.map((h) => {
            const on = h.valor === value;
            return (
              <div
                key={h.valor}
                onClick={() => { onChange(h.valor); setOpen(false); }}
                style={{
                  ...s.dropOp,
                  background: on ? T.blueLight : T.bgWhite,
                  color:      on ? T.blue      : T.textPri,
                  fontWeight: on ? '700'        : '400',
                  borderLeft: `3px solid ${on ? T.blue : 'transparent'}`,
                }}
                onMouseEnter={e => { if (!on) e.currentTarget.style.background = '#F8F8F8'; }}
                onMouseLeave={e => { if (!on) e.currentTarget.style.background = T.bgWhite; }}
              >
                {h.texto}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── COMPONENTE PRINCIPAL ──────────────────────
export default function Planificar() {
  const navigate = useNavigate();

  const [estaciones,  setEstaciones]  = useState([]);
  const [dias,        setDias]        = useState([]);

  const [origenSel,   setOrigenSel]   = useState('');
  const [destinoSel,  setDestinoSel]  = useState('');
  const [diaSel,      setDiaSel]      = useState('');
  const [horaInicio,  setHoraInicio]  = useState('');
  const [horaFin,     setHoraFin]     = useState('');

  const [resultados,  setResultados]  = useState([]);
  const [buscado,     setBuscado]     = useState(false);
  const [cargando,    setCargando]    = useState(false);
  const [error,       setError]       = useState(null);
  const [horaActual,  setHoraActual]  = useState('');
  const [ultimaAct,   setUltimaAct]   = useState('');

  // ── Reloj ──
  useEffect(() => {
    const tick = () => {
      const n = new Date();
      setHoraActual(`${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // ── Datos iniciales ──
  useEffect(() => {
    Promise.all([api.get('/estaciones'), api.get('/dias')])
      .then(([e, d]) => { setEstaciones(e.data); setDias(d.data); })
      .catch(() => setError('No se pudieron cargar los datos. Intentá de nuevo.'));
  }, []);

  // Cuando cambia el origen, limpiamos el destino si es igual
  const handleOrigenChange = (val) => {
    setOrigenSel(val);
    if (val === destinoSel) setDestinoSel('');
  };

  // Estaciones disponibles para destino (todas menos el origen)
  const estacionesDestino = estaciones.filter(e => String(e.id_estacion) !== String(origenSel));

  const horasValidas = !horaInicio || !horaFin || horaFin > horaInicio;
  const origenDistintoDestino = !origenSel || !destinoSel || origenSel !== destinoSel;
  const puedesBuscar = origenSel && destinoSel && diaSel && horaInicio && horaFin && horasValidas && origenDistintoDestino;

  // ── Buscar ──
  const buscar = useCallback(async () => {
    if (!puedesBuscar) return;
    setCargando(true); setError(null); setBuscado(true);
    try {
      const res = await api.get('/horarios-rango', {
        params: {
          idOrigen:   origenSel,
          idDestino:  destinoSel,
          idDia:      diaSel,
          Inicio:     horaInicio,
          Fin:        horaFin,
        },
      });
      setResultados(res.data);
      const n = new Date();
      setUltimaAct(`${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`);
    } catch {
      setError('Error al buscar horarios. Revisá los filtros e intentá de nuevo.');
      setResultados([]);
    } finally { setCargando(false); }
  }, [origenSel, destinoSel, diaSel, horaInicio, horaFin, puedesBuscar]);

  const limpiar = () => {
    setOrigenSel(''); setDestinoSel(''); setDiaSel('');
    setHoraInicio(''); setHoraFin('');
    setResultados([]); setBuscado(false);
    setError(null); setUltimaAct('');
  };

  const nombreOrigen  = estaciones.find(e => String(e.id_estacion) === String(origenSel))?.nombre_estacion  || '';
  const nombreDestino = estaciones.find(e => String(e.id_estacion) === String(destinoSel))?.nombre_estacion || '';
  const nombreDia     = dias.find(e => String(e.ID_Dia) === String(diaSel))?.Descripcion_Dia || '';

  return (
    <div style={s.root}>

      {/* ── HEADER ── */}
      <header style={s.header}>
        <div style={s.headerInner}>
          <button onClick={() => navigate('/')} style={s.btnVolver}>← Volver</button>
          <div style={s.headerCentro}>
            <div style={s.headerTitulo}>Planificar Viaje</div>
            <div style={s.headerSub}>Línea Belgrano Norte</div>
          </div>
          <div style={s.horaChip}>{horaActual}</div>
        </div>
        <div style={s.headerLine}/>
      </header>

      <main style={s.main}>

        {/* ── PANEL DE BÚSQUEDA ── */}
        <div style={s.panel}>
          <div style={s.panelTitulo}>¿De dónde a dónde querés viajar?</div>

          {/* Fila 1: Origen + Destino */}
          <div style={s.filaConector}>
            <Dropdown
              label="Estación origen"
              opciones={estaciones}
              valorKey="id_estacion"
              textoKey="nombre_estacion"
              value={origenSel}
              onChange={handleOrigenChange}
              placeholder="¿Desde dónde salís?..."
              acento={T.red}
            />
            <div style={s.flechaConector}>
              <div style={s.flechaLinea} />
              <span style={s.flechaIco}>→</span>
              <div style={s.flechaLinea} />
            </div>
            <Dropdown
              label="Estación destino"
              opciones={estacionesDestino}
              valorKey="id_estacion"
              textoKey="nombre_estacion"
              value={destinoSel}
              onChange={setDestinoSel}
              placeholder="¿A dónde vas?..."
              acento={T.blue}
              deshabilitado={!origenSel}
            />
          </div>

          {/* Fila 2: Día */}
          <div style={{ ...s.fila, marginTop: '1rem' }}>
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

          {/* Fila 3: Horas */}
          <div style={{ ...s.fila, marginTop: '1rem' }}>
            <DropdownHora
              label="Hora de inicio"
              value={horaInicio}
              onChange={setHoraInicio}
              placeholder="¿Desde qué hora?..."
            />
            <DropdownHora
              label="Hora de fin"
              value={horaFin}
              onChange={setHoraFin}
              placeholder="¿Hasta qué hora?..."
            />
          </div>

          {/* Aviso horas inválidas */}
          {!horasValidas && (
            <div style={{ ...s.avisoHora, marginTop: '0.8rem' }}>
              ⚠️ La hora de fin debe ser posterior a la de inicio
            </div>
          )}

          {/* Botones */}
          <div style={s.botonesRow}>
            <button
              onClick={buscar}
              disabled={!puedesBuscar || cargando}
              style={{
                ...s.btnBuscar,
                opacity: !puedesBuscar ? 0.45 : 1,
                cursor:  !puedesBuscar ? 'not-allowed' : 'pointer',
              }}
            >
              {cargando ? 'Buscando...' : '🔍  Buscar horarios'}
            </button>
            {buscado && <button onClick={limpiar} style={s.btnLimpiar}>Limpiar</button>}
          </div>
          {ultimaAct && <div style={s.ultimaAct}>Última búsqueda: {ultimaAct} hs</div>}
        </div>

        {/* ── ERROR ── */}
        {error && (
          <div style={s.errorCard}>
            <span style={s.errorIco}>⚠️</span>
            <span style={s.errorTxt}>{error}</span>
          </div>
        )}

        {/* ── CARGANDO ── */}
        {cargando && (
          <div style={s.loadingCard}>
            <div style={s.loadingIco}>🚂</div>
            <div style={s.loadingTxt}>Buscando horarios disponibles...</div>
          </div>
        )}

        {/* ── SIN RESULTADOS ── */}
        {!cargando && buscado && resultados.length === 0 && (
          <div style={s.sinCard}>
            <div style={s.sinIco}>🌙</div>
            <div style={s.sinTit}>Sin horarios disponibles</div>
            <div style={s.sinSub}>
              No hay servicios de {nombreOrigen} a {nombreDestino} en ese rango horario.
            </div>
          </div>
        )}

        {/* ── RESULTADOS ── */}
        {!cargando && resultados.length > 0 && (
          <div style={s.resultadosBox}>

            {/* Encabezado */}
            <div style={s.resHeader}>
              {/* Tramo */}
              <div style={s.resTramo}>
                <div style={s.resTramoItem}>
                  <span style={s.resTramoLabel}>Origen</span>
                  <span style={s.resTramoNombre}>{nombreOrigen}</span>
                </div>
                <div style={s.resTramoFlecha}>→</div>
                <div style={s.resTramoItem}>
                  <span style={s.resTramoLabel}>Destino</span>
                  <span style={{ ...s.resTramoNombre, color: T.blue }}>{nombreDestino}</span>
                </div>
              </div>

              {/* Badges + count */}
              <div style={s.resMeta}>
                <div style={s.resDetalles}>
                  <span style={s.resBadgeGris}>{nombreDia}</span>
                  <span style={s.resBadgeGris}>
                    {HORAS.find(h => h.valor === horaInicio)?.texto} → {HORAS.find(h => h.valor === horaFin)?.texto}
                  </span>
                </div>
                <div style={s.resCount}>
                  {resultados.length}
                  <span style={s.resCountSub}>trenes</span>
                </div>
              </div>
            </div>

            {/* Lista de trenes */}
            <div>
              {resultados.map((tren, i) => {
                const horaSalida  = (tren.Hora_Salida  || '').slice(0, 5) || '--:--';
                const horaLlegada = (tren.Hora_Llegada || '').slice(0, 5) || '--:--';
                const estado = tren.Estado || '';
                return (
                  <div
                    key={i}
                    style={s.trenFila}
                    onMouseEnter={e => e.currentTarget.style.background = '#F8F8F8'}
                    onMouseLeave={e => e.currentTarget.style.background = T.bgWhite}
                  >
                    {/* Número */}
                    <span style={s.trenNum}>{String(i + 1).padStart(2, '0')}</span>

                    {/* Salida */}
                    <div style={s.trenBloque}>
                      <span style={s.trenBloqueLabel}>Sale</span>
                      <span style={{ ...s.trenHora, color: T.red }}>{horaSalida}</span>
                      <span style={s.trenBloqueEst}>{nombreOrigen}</span>
                    </div>

                    {/* Flecha central */}
                    <div style={s.trenFlechaWrap}>
                      <div style={s.trenFlechaLinea} />
                      <span style={s.trenFlechaIco}>🚂</span>
                      <div style={s.trenFlechaLinea} />
                    </div>

                    {/* Llegada */}
                    <div style={s.trenBloque}>
                      <span style={s.trenBloqueLabel}>Llega</span>
                      <span style={{ ...s.trenHora, color: T.blue }}>{horaLlegada}</span>
                      <span style={s.trenBloqueEst}>{nombreDestino}</span>
                    </div>

                    {/* Estado */}
                    <div style={s.trenEstadoWrap}>
                      {estado && estado !== 'En hora' && (
                        <span style={s.trenEstadoBadge}>{estado}</span>
                      )}
                      {(!estado || estado === 'En hora') && (
                        <span style={s.trenEnHoraBadge}>En hora</span>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
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
    maxWidth: '900px', margin: '0 auto', width: '100%',
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
  headerSub: { fontSize: '0.75rem', color: T.textSub, marginTop: '2px' },
  horaChip: {
    fontSize: '1.4rem', fontWeight: '700', color: T.red,
    fontVariantNumeric: 'tabular-nums',
    fontFamily: "'Lora', serif",
    minWidth: '60px', textAlign: 'right',
  },
  headerLine: { height: '3px', background: `linear-gradient(90deg, ${T.red}, #E74C3C)` },

  main: { maxWidth: '900px', margin: '0 auto', padding: '1.5rem' },

  panel: {
    background: T.bgWhite, border: `1.5px solid ${T.borde}`,
    borderRadius: '16px', padding: '1.4rem',
    marginBottom: '1.2rem', boxShadow: `0 2px 8px ${T.sombra}`,
  },
  panelTitulo: {
    fontSize: '1.1rem', fontWeight: '600', color: T.textPri,
    marginBottom: '1.2rem', fontFamily: "'Lora', serif",
  },

  // Fila origen → destino con flecha
  filaConector: {
    display: 'flex', alignItems: 'flex-end',
    gap: '0.5rem', flexWrap: 'wrap',
  },
  flechaConector: {
    display: 'flex', alignItems: 'center', gap: '4px',
    paddingBottom: '0.6rem', flexShrink: 0,
  },
  flechaLinea: { width: '12px', height: '2px', background: T.borde },
  flechaIco:   { fontSize: '1.1rem', color: T.textMuted, fontWeight: '700' },

  fila: { display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-start' },

  dropLabel: {
    display: 'block', fontSize: '0.9rem', fontWeight: '600',
    color: T.textSub, marginBottom: '0.4rem',
  },
  dropBtn: {
    width: '100%', background: T.bgWhite, border: '2px solid',
    borderRadius: '10px', padding: '0.85rem 1rem',
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', transition: 'border-color 0.2s',
    minHeight: '52px', color: T.textPri,
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

  avisoHora: {
    background: T.naranjaLight, border: `1.5px solid ${T.naranjaBorde}`,
    borderRadius: '10px', padding: '0.75rem 1rem',
    fontSize: '0.9rem', color: T.naranja, fontWeight: '600',
  },

  botonesRow: { display: 'flex', gap: '0.8rem', flexWrap: 'wrap', marginTop: '1.2rem' },
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

  loadingCard: {
    textAlign: 'center', padding: '3rem 1rem',
    background: T.bgWhite, border: `1.5px solid ${T.borde}`,
    borderRadius: '16px', boxShadow: `0 2px 8px ${T.sombra}`,
  },
  loadingIco: { fontSize: '2.5rem', marginBottom: '0.8rem' },
  loadingTxt: { fontSize: '1.05rem', color: T.textSub, fontWeight: '500' },

  sinCard: {
    textAlign: 'center', padding: '3.5rem 1rem',
    background: T.bgWhite, border: `1.5px solid ${T.borde}`,
    borderRadius: '16px', boxShadow: `0 2px 8px ${T.sombra}`,
  },
  sinIco: { fontSize: '3rem', marginBottom: '0.8rem' },
  sinTit: {
    fontSize: '1.3rem', fontWeight: '700', color: T.textPri,
    fontFamily: "'Lora', serif", marginBottom: '0.4rem',
  },
  sinSub: { fontSize: '0.95rem', color: T.textSub },

  // Resultados
  resultadosBox: {
    background: T.bgWhite, border: `1.5px solid ${T.borde}`,
    borderRadius: '16px', overflow: 'hidden',
    boxShadow: `0 2px 8px ${T.sombra}`,
  },
  resHeader: {
    padding: '1.2rem 1.5rem',
    borderBottom: `3px solid ${T.borde}`,
    background: T.bgPage,
  },
  resTramo: {
    display: 'flex', alignItems: 'center', gap: '0.8rem',
    marginBottom: '0.8rem', flexWrap: 'wrap',
  },
  resTramoItem: { display: 'flex', flexDirection: 'column', gap: '2px' },
  resTramoLabel: { fontSize: '0.72rem', color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' },
  resTramoNombre: {
    fontSize: '1.2rem', fontWeight: '700',
    color: T.red, fontFamily: "'Lora', serif",
  },
  resTramoFlecha: {
    fontSize: '1.4rem', color: T.textMuted,
    fontWeight: '700', paddingTop: '12px',
  },
  resMeta: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem',
  },
  resDetalles: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' },
  resBadgeGris: {
    fontSize: '0.82rem', fontWeight: '600', color: T.textSub,
    background: '#F0F0EC', border: `1px solid ${T.borde}`,
    borderRadius: '20px', padding: '3px 12px',
  },
  resCount: {
    fontSize: '2rem', fontWeight: '800',
    fontFamily: "'Lora', serif", lineHeight: 1,
    color: T.textPri, textAlign: 'center',
  },
  resCountSub: {
    display: 'block', fontSize: '0.72rem', fontWeight: '600',
    color: T.textSub, fontFamily: "'Source Sans 3', sans-serif",
  },

  // Fila de tren
  trenFila: {
    display: 'flex', alignItems: 'center',
    gap: '0.8rem', padding: '1rem 1.5rem',
    borderBottom: `1px solid ${T.borde}`,
    transition: 'background 0.15s', background: T.bgWhite,
    flexWrap: 'wrap',
  },
  trenNum: {
    fontSize: '0.85rem', color: T.textMuted,
    fontWeight: '700', minWidth: '24px',
    fontVariantNumeric: 'tabular-nums',
  },
  trenBloque: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: '2px', minWidth: '80px',
  },
  trenBloqueLabel: {
    fontSize: '0.7rem', color: T.textMuted,
    textTransform: 'uppercase', letterSpacing: '0.05em',
  },
  trenHora: {
    fontSize: '1.9rem', fontWeight: '700',
    fontVariantNumeric: 'tabular-nums', lineHeight: 1,
    fontFamily: "'Lora', serif",
  },
  trenBloqueEst: {
    fontSize: '0.72rem', color: T.textSub,
    fontWeight: '500', textAlign: 'center',
    maxWidth: '90px', overflow: 'hidden',
    textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  },
  trenFlechaWrap: {
    display: 'flex', alignItems: 'center',
    gap: '4px', flex: 1, minWidth: '60px',
  },
  trenFlechaLinea: { flex: 1, height: '2px', background: T.borde },
  trenFlechaIco:   { fontSize: '1.2rem' },
  trenEstadoWrap:  { marginLeft: 'auto' },
  trenEstadoBadge: {
    display: 'inline-block', fontSize: '0.78rem',
    fontWeight: '600', border: '1.5px solid #F0B080',
    borderRadius: '6px', padding: '3px 10px',
    color: T.naranja, background: T.naranjaLight,
  },
  trenEnHoraBadge: {
    display: 'inline-block', fontSize: '0.78rem',
    fontWeight: '600', border: `1.5px solid ${T.verdeBorde}`,
    borderRadius: '6px', padding: '3px 10px',
    color: T.verde, background: T.verdeLight,
  },
};
