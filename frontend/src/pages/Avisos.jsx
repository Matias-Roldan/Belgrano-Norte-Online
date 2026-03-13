// frontend/src/pages/Avisos.jsx
// ─────────────────────────────────────────────
// BELGRANO NORTE — Avisos del Servicio
// ─────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/belgrano';
import { useAutoRefresh } from '../hooks/useAutoRefresh';

// ── PALETA ────────────────────────────────────
const T = {
  bgPage:       '#F5F5F0',
  bgWhite:      '#FFFFFF',
  red:          '#C0392B',
  redLight:     '#FDECEA',
  redBorde:     '#E8A09A',
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

// ── CONFIG POR NIVEL ──────────────────────────
const NIVEL = {
  3: { label: 'Crítico',      color: T.red,     bgLight: T.redLight,      borde: T.redBorde,     emoji: '🚨' },
  2: { label: 'Advertencia',  color: T.naranja,  bgLight: T.naranjaLight,  borde: T.naranjaBorde, emoji: '⚠️' },
  1: { label: 'Informativo',  color: T.verde,    bgLight: T.verdeLight,    borde: T.verdeBorde,   emoji: 'ℹ️' },
};

const formatFecha = (fechaISO) => {
  if (!fechaISO) return '';
  return new Date(fechaISO).toLocaleDateString('es-AR', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
};

// ── TARJETA DE AVISO ──────────────────────────
function TarjetaAviso({ aviso }) {
  const cfg = NIVEL[aviso.nivel] || NIVEL[1];
  return (
    <div style={{ ...s.tarjeta, borderColor: cfg.borde }}>
      <div style={{ ...s.tarjetaFranja, background: cfg.color }}/>
      <div style={s.tarjetaCuerpo}>
        <div style={s.tarjetaHeader}>
          <div style={s.tarjetaTituloWrap}>
            <span style={s.tarjetaEmoji}>{cfg.emoji}</span>
            <h3 style={s.tarjetaTitulo}>{aviso.titulo}</h3>
          </div>
          <span style={{ ...s.nivelBadge, color: cfg.color, background: cfg.bgLight, borderColor: cfg.borde }}>
            {cfg.label}
          </span>
        </div>
        <p style={s.tarjetaDesc}>{aviso.descripcion}</p>
        <div style={s.tarjetaFooter}>
          <span style={s.tarjetaFecha}>📅 Publicado: {formatFecha(aviso.fecha_creacion)}</span>
        </div>
      </div>
    </div>
  );
}

// ── AVISOS PRINCIPAL ──────────────────────────
export default function Avisos() {
  const navigate = useNavigate();
  const [avisos,     setAvisos]     = useState([]);
  const [cargando,   setCargando]   = useState(true);
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

  const fetchAvisos = async () => {
    try {
      const res = await api.get('/avisos');
      setAvisos(res.data);
      setError(null);
      const n = new Date();
      setUltimaAct(`${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`);
    } catch {
      setError('No se pudieron cargar los avisos. Intentá de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  useAutoRefresh(fetchAvisos, 60000);

  const criticos     = avisos.filter(a => a.nivel === 3);
  const advertencias = avisos.filter(a => a.nivel === 2);
  const informativos = avisos.filter(a => a.nivel === 1);

  const estado = criticos.length > 0
    ? { texto: 'Hay interrupciones en el servicio', color: T.red,     bg: T.redLight,     borde: T.redBorde,     icono: '🚨' }
    : advertencias.length > 0
    ? { texto: 'Servicio con alteraciones',         color: T.naranja, bg: T.naranjaLight, borde: T.naranjaBorde, icono: '⚠️' }
    : { texto: 'Servicio operando con normalidad',  color: T.verde,   bg: T.verdeLight,   borde: T.verdeBorde,   icono: '✅' };

  return (
    <div style={s.root}>

      {/* ── HEADER ── */}
      <header style={s.header}>
        <div style={s.headerInner}>
          <button onClick={() => navigate('/')} style={s.btnVolver}>← Volver</button>
          <div style={s.headerCentro}>
            <div style={s.headerTitulo}>Avisos del Servicio</div>
            <div style={s.headerSub}>Línea Belgrano Norte</div>
          </div>
          <div style={s.horaChip}>{horaActual}</div>
        </div>
        <div style={s.headerLine}/>
      </header>

      <main style={s.main}>

        {/* ── BANNER DE ESTADO GENERAL ── */}
        <div style={{ ...s.estadoBanner, background: estado.bg, borderColor: estado.borde }}>
          <span style={s.estadoIco}>{estado.icono}</span>
          <div>
            <div style={{ ...s.estadoTitulo, color: estado.color }}>{estado.texto}</div>
            <div style={s.estadoSub}>
              {avisos.length === 0 ? 'Sin avisos activos'
                : `${avisos.length} aviso${avisos.length !== 1 ? 's' : ''} activo${avisos.length !== 1 ? 's' : ''}`}
              {ultimaAct && ` · Actualizado: ${ultimaAct} hs`}
            </div>
          </div>
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
            <div style={s.loadingIco}>🔔</div>
            <div style={s.loadingTxt}>Cargando avisos...</div>
          </div>
        )}

        {/* ── SIN AVISOS ── */}
        {!cargando && !error && avisos.length === 0 && (
          <div style={s.sinCard}>
            <div style={s.sinIco}>✅</div>
            <div style={s.sinTit}>Todo en orden</div>
            <div style={s.sinSub}>El servicio opera con normalidad. No hay avisos activos.</div>
          </div>
        )}

        {/* ── CRÍTICOS ── */}
        {criticos.length > 0 && (
          <section style={s.seccion}>
            <div style={s.seccionHeader}>
              <span style={{ ...s.seccionBadge, color: T.red, background: T.redLight, borderColor: T.redBorde }}>
                🚨 Críticos ({criticos.length})
              </span>
            </div>
            {criticos.map(a => <TarjetaAviso key={a.id_aviso} aviso={a}/>)}
          </section>
        )}

        {/* ── ADVERTENCIAS ── */}
        {advertencias.length > 0 && (
          <section style={s.seccion}>
            <div style={s.seccionHeader}>
              <span style={{ ...s.seccionBadge, color: T.naranja, background: T.naranjaLight, borderColor: T.naranjaBorde }}>
                ⚠️ Advertencias ({advertencias.length})
              </span>
            </div>
            {advertencias.map(a => <TarjetaAviso key={a.id_aviso} aviso={a}/>)}
          </section>
        )}

        {/* ── INFORMATIVOS ── */}
        {informativos.length > 0 && (
          <section style={s.seccion}>
            <div style={s.seccionHeader}>
              <span style={{ ...s.seccionBadge, color: T.verde, background: T.verdeLight, borderColor: T.verdeBorde }}>
                ℹ️ Informativos ({informativos.length})
              </span>
            </div>
            {informativos.map(a => <TarjetaAviso key={a.id_aviso} aviso={a}/>)}
          </section>
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
  headerSub: { fontSize: '0.75rem', color: T.textSub, marginTop: '2px' },
  horaChip: {
    fontSize: '1.4rem', fontWeight: '700', color: T.red,
    fontVariantNumeric: 'tabular-nums',
    fontFamily: "'Lora', serif",
    minWidth: '60px', textAlign: 'right',
  },
  headerLine: { height: '3px', background: `linear-gradient(90deg, ${T.red}, #E74C3C)` },

  main: { maxWidth: '820px', margin: '0 auto', padding: '1.5rem' },

  estadoBanner: {
    display: 'flex', alignItems: 'center', gap: '1rem',
    border: '2px solid', borderRadius: '16px',
    padding: '1.2rem 1.5rem', marginBottom: '1.5rem',
    boxShadow: `0 2px 8px ${T.sombra}`,
  },
  estadoIco:    { fontSize: '2.5rem', lineHeight: 1, flexShrink: 0 },
  estadoTitulo: {
    fontSize: '1.15rem', fontWeight: '700',
    fontFamily: "'Lora', serif", marginBottom: '0.2rem',
  },
  estadoSub:    { fontSize: '0.85rem', color: T.textSub },

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
    background: T.verdeLight, border: `2px solid ${T.verdeBorde}`,
    borderRadius: '16px',
  },
  sinIco: { fontSize: '3rem', marginBottom: '0.8rem' },
  sinTit: {
    fontSize: '1.3rem', fontWeight: '700', color: T.verde,
    fontFamily: "'Lora', serif", marginBottom: '0.4rem',
  },
  sinSub: { fontSize: '0.95rem', color: T.textSub },

  seccion:       { marginBottom: '1.5rem' },
  seccionHeader: { marginBottom: '0.75rem' },
  seccionBadge: {
    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
    fontSize: '0.9rem', fontWeight: '700',
    border: '1.5px solid', borderRadius: '20px', padding: '0.4rem 1rem',
  },

  tarjeta: {
    display: 'flex', background: T.bgWhite,
    border: '2px solid', borderRadius: '14px',
    overflow: 'hidden', marginBottom: '0.9rem',
    boxShadow: `0 2px 8px ${T.sombra}`,
  },
  tarjetaFranja: { width: '6px', flexShrink: 0 },
  tarjetaCuerpo: { flex: 1, padding: '1.2rem 1.4rem' },
  tarjetaHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', gap: '0.8rem',
    marginBottom: '0.75rem', flexWrap: 'wrap',
  },
  tarjetaTituloWrap: { display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 },
  tarjetaEmoji:  { fontSize: '1.3rem', flexShrink: 0 },
  tarjetaTitulo: {
    margin: 0, fontSize: '1.1rem', fontWeight: '700',
    color: T.textPri, fontFamily: "'Lora', serif", lineHeight: 1.3,
  },
  nivelBadge: {
    fontSize: '0.78rem', fontWeight: '700',
    border: '1.5px solid', borderRadius: '20px',
    padding: '3px 12px', whiteSpace: 'nowrap', flexShrink: 0,
  },
  tarjetaDesc: {
    margin: '0 0 1rem', fontSize: '1rem',
    color: T.textSub, lineHeight: 1.65,
  },
  tarjetaFooter: { borderTop: `1px solid ${T.borde}`, paddingTop: '0.65rem' },
  tarjetaFecha:  { fontSize: '0.82rem', color: T.textMuted },
};
