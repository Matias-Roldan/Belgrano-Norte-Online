// [ARCHIVO: Avisos.jsx] — AUDITADO ✓
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/belgrano';
import { useAutoRefresh } from '../hooks/useAutoRefresh';

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

// [SEC-FIX] Niveles válidos como Set para validación
const NIVELES_VALIDOS = new Set([1, 2, 3]);

// [SEC-FIX] Config de nivel sin emojis — iconos SVG controlados
const NIVEL = {
  3: { label: 'Crítico',     color: T.red,    bgLight: T.redLight,     borde: T.redBorde,     icono: 'crit' },
  2: { label: 'Advertencia', color: T.naranja, bgLight: T.naranjaLight, borde: T.naranjaBorde, icono: 'warn' },
  1: { label: 'Informativo', color: T.verde,   bgLight: T.verdeLight,   borde: T.verdeBorde,   icono: 'info' },
};

// [SEC-FIX] SVG por tipo — reemplaza todos los emojis de nivel
function IconoNivel({ tipo, size = 16, color }) {
  const c = color || '#555';
  if (tipo === 'crit') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/>
      <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );
  if (tipo === 'warn') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  );
  if (tipo === 'ok') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/><polyline points="20 6 9 17 4 12"/>
    </svg>
  );
  // info
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="8" strokeWidth="3"/><line x1="12" y1="12" x2="12" y2="16"/>
    </svg>
  );
}

// [SEC-FIX] Sanitizar texto de API
function sanitizarTexto(str, max = 500) {
  if (typeof str !== 'string') return '';
  return str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim().slice(0, max);
}

// [SEC-FIX] Validar aviso recibido de la API pública
function validarAviso(a) {
  if (!a || typeof a !== 'object') return null;
  const id    = parseInt(a.id_aviso, 10);
  const nivel = parseInt(a.nivel, 10);
  if (!Number.isInteger(id) || id <= 0) return null;
  if (!NIVELES_VALIDOS.has(nivel)) return null;
  return {
    id_aviso:       id,
    nivel,
    titulo:         sanitizarTexto(a.titulo || '', 120),
    descripcion:    sanitizarTexto(a.descripcion || '', 500),
    fecha_creacion: a.fecha_creacion || null,
  };
}

// [SEC-FIX] Formatear fecha de forma segura — sin tirar si el valor es inválido
const formatFecha = (fechaISO) => {
  if (!fechaISO) return '';
  const d = new Date(fechaISO);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' });
};

// ── TARJETA DE AVISO ──────────────────────────
function TarjetaAviso({ aviso }) {
  const cfg   = NIVEL[aviso.nivel] || NIVEL[1];
  const fecha = formatFecha(aviso.fecha_creacion);

  return (
    <article style={{ ...s.tarjeta, borderColor: cfg.borde }} aria-label={`Aviso ${cfg.label}: ${aviso.titulo}`}>
      <div style={{ ...s.tarjetaFranja, background: cfg.color }} aria-hidden="true"/>
      <div style={s.tarjetaCuerpo}>
        <div style={s.tarjetaHeader}>
          <div style={s.tarjetaTituloWrap}>
            <IconoNivel tipo={cfg.icono} size={20} color={cfg.color}/>
            {/* [SEC-FIX] titulo ya sanitizado en validarAviso() */}
            <h3 style={s.tarjetaTitulo}>{aviso.titulo}</h3>
          </div>
          <span style={{ ...s.nivelBadge, color: cfg.color, background: cfg.bgLight, borderColor: cfg.borde }}>
            {cfg.label}
          </span>
        </div>
        {/* [SEC-FIX] descripcion ya sanitizada — renderizada como texto plano */}
        <p style={s.tarjetaDesc}>{aviso.descripcion}</p>
        {fecha && (
          <div style={s.tarjetaFooter}>
            <span style={s.tarjetaFecha}>
              {/* [SEC-FIX] SVG en lugar de emoji 📅 */}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={T.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ marginRight:'4px', verticalAlign:'middle' }}>
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Publicado: {fecha}
            </span>
          </div>
        )}
      </div>
    </article>
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
      // [SEC-FIX] Validar y sanitizar cada aviso recibido
      const data = Array.isArray(res.data) ? res.data : [];
      setAvisos(data.map(validarAviso).filter(Boolean).slice(0, 50));
      setError(null);
      const n = new Date();
      setUltimaAct(`${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`);
    } catch {
      // [SEC-FIX] Mensaje genérico — sin exponer detalles del error
      setError('No se pudieron cargar los avisos. Intentá de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  useAutoRefresh(fetchAvisos, 60000);

  // [SEC-FIX] Filtrar por nivel usando comparación estricta con números validados
  const criticos     = avisos.filter(a => a.nivel === 3);
  const advertencias = avisos.filter(a => a.nivel === 2);
  const informativos = avisos.filter(a => a.nivel === 1);

  // [SEC-FIX] Estado calculado localmente — no depende de datos de la API
  const estadoTipo = criticos.length > 0 ? 'crit'
    : advertencias.length > 0 ? 'warn'
    : 'ok';

  const ESTADO_CFG = {
    crit: { texto: 'Hay interrupciones en el servicio', color: T.red,    bg: T.redLight,     borde: T.redBorde,     icono: 'crit' },
    warn: { texto: 'Servicio con alteraciones',         color: T.naranja, bg: T.naranjaLight, borde: T.naranjaBorde, icono: 'warn' },
    ok:   { texto: 'Servicio operando con normalidad',  color: T.verde,   bg: T.verdeLight,   borde: T.verdeBorde,   icono: 'ok'   },
  };
  const estado = ESTADO_CFG[estadoTipo];

  return (
    <div style={s.root}>
      <header style={s.header}>
        <div style={s.headerInner}>
          <button onClick={() => navigate('/')} style={s.btnVolver} aria-label="Volver al inicio">← Volver</button>
          <div style={s.headerCentro}>
            <div style={s.headerTitulo}>Avisos del Servicio</div>
            <div style={s.headerSub}>Línea Belgrano Norte</div>
          </div>
          <div style={s.horaChip} aria-label={`Hora actual: ${horaActual}`}>{horaActual}</div>
        </div>
        <div style={s.headerLine}/>
      </header>

      <main style={s.main}>

        {/* ── BANNER DE ESTADO GENERAL ── */}
        <div
          role="status"
          aria-live="polite"
          style={{ ...s.estadoBanner, background: estado.bg, borderColor: estado.borde }}
        >
          <IconoNivel tipo={estado.icono} size={32} color={estado.color}/>
          <div>
            {/* [SEC-FIX] texto del estado es hardcodeado — no depende de la API */}
            <div style={{ ...s.estadoTitulo, color: estado.color }}>{estado.texto}</div>
            <div style={s.estadoSub}>
              {avisos.length === 0
                ? 'Sin avisos activos'
                : `${avisos.length} aviso${avisos.length !== 1 ? 's' : ''} activo${avisos.length !== 1 ? 's' : ''}`}
              {ultimaAct && ` · Actualizado: ${ultimaAct} hs`}
            </div>
          </div>
        </div>

        {/* ── ERROR ── */}
        {error && (
          <div role="alert" style={s.errorCard}>
            <IconoNivel tipo="warn" size={20} color={T.red}/>
            {/* [SEC-FIX] error es mensaje hardcodeado */}
            <span style={s.errorTxt}>{error}</span>
          </div>
        )}

        {/* ── CARGANDO ── */}
        {cargando && (
          <div style={s.loadingCard} aria-live="polite" aria-busy="true">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={T.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ marginBottom:'0.8rem' }}>
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <div style={s.loadingTxt}>Cargando avisos...</div>
          </div>
        )}

        {/* ── SIN AVISOS ── */}
        {!cargando && !error && avisos.length === 0 && (
          <div style={s.sinCard}>
            <IconoNivel tipo="ok" size={44} color={T.verde}/>
            <div style={{ ...s.sinTit, marginTop:'0.8rem' }}>Todo en orden</div>
            <div style={s.sinSub}>El servicio opera con normalidad. No hay avisos activos.</div>
          </div>
        )}

        {/* ── CRÍTICOS ── */}
        {criticos.length > 0 && (
          <section style={s.seccion} aria-label="Avisos críticos">
            <div style={s.seccionHeader}>
              <span style={{ ...s.seccionBadge, color: T.red, background: T.redLight, borderColor: T.redBorde, display:'inline-flex', alignItems:'center', gap:'0.4rem' }}>
                <IconoNivel tipo="crit" size={13} color={T.red}/>
                Críticos ({criticos.length})
              </span>
            </div>
            {criticos.map(a => <TarjetaAviso key={a.id_aviso} aviso={a}/>)}
          </section>
        )}

        {/* ── ADVERTENCIAS ── */}
        {advertencias.length > 0 && (
          <section style={s.seccion} aria-label="Advertencias">
            <div style={s.seccionHeader}>
              <span style={{ ...s.seccionBadge, color: T.naranja, background: T.naranjaLight, borderColor: T.naranjaBorde, display:'inline-flex', alignItems:'center', gap:'0.4rem' }}>
                <IconoNivel tipo="warn" size={13} color={T.naranja}/>
                Advertencias ({advertencias.length})
              </span>
            </div>
            {advertencias.map(a => <TarjetaAviso key={a.id_aviso} aviso={a}/>)}
          </section>
        )}

        {/* ── INFORMATIVOS ── */}
        {informativos.length > 0 && (
          <section style={s.seccion} aria-label="Avisos informativos">
            <div style={s.seccionHeader}>
              <span style={{ ...s.seccionBadge, color: T.verde, background: T.verdeLight, borderColor: T.verdeBorde, display:'inline-flex', alignItems:'center', gap:'0.4rem' }}>
                <IconoNivel tipo="info" size={13} color={T.verde}/>
                Informativos ({informativos.length})
              </span>
            </div>
            {informativos.map(a => <TarjetaAviso key={a.id_aviso} aviso={a}/>)}
          </section>
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
  headerSub: { fontSize: '0.75rem', color: T.textSub, marginTop: '2px' },
  horaChip: { fontSize: '1.4rem', fontWeight: '700', color: T.red, fontVariantNumeric: 'tabular-nums', fontFamily: "'Lora', serif", minWidth: '60px', textAlign: 'right' },
  headerLine: { height: '3px', background: `linear-gradient(90deg, ${T.red}, #E74C3C)` },
  main: { maxWidth: '820px', margin: '0 auto', padding: '1.5rem' },
  estadoBanner: { display: 'flex', alignItems: 'center', gap: '1rem', border: '2px solid', borderRadius: '16px', padding: '1.2rem 1.5rem', marginBottom: '1.5rem', boxShadow: `0 2px 8px ${T.sombra}` },
  estadoTitulo: { fontSize: '1.15rem', fontWeight: '700', fontFamily: "'Lora', serif", marginBottom: '0.2rem' },
  estadoSub:    { fontSize: '0.85rem', color: T.textSub },
  errorCard: { display: 'flex', alignItems: 'center', gap: '0.7rem', background: T.redLight, border: `1.5px solid ${T.redBorde}`, borderRadius: '12px', padding: '1rem 1.2rem', marginBottom: '1rem' },
  errorTxt: { fontSize: '0.95rem', color: T.red, fontWeight: '600' },
  loadingCard: { textAlign: 'center', padding: '3rem 1rem', background: T.bgWhite, border: `1.5px solid ${T.borde}`, borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  loadingTxt: { fontSize: '1.05rem', color: T.textSub, fontWeight: '500' },
  sinCard: { textAlign: 'center', padding: '3.5rem 1rem', background: T.verdeLight, border: `2px solid ${T.verdeBorde}`, borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  sinTit: { fontSize: '1.3rem', fontWeight: '700', color: T.verde, fontFamily: "'Lora', serif", marginBottom: '0.4rem' },
  sinSub: { fontSize: '0.95rem', color: T.textSub },
  seccion:       { marginBottom: '1.5rem' },
  seccionHeader: { marginBottom: '0.75rem' },
  seccionBadge: { fontSize: '0.9rem', fontWeight: '700', border: '1.5px solid', borderRadius: '20px', padding: '0.4rem 1rem' },
  tarjeta: { display: 'flex', background: T.bgWhite, border: '2px solid', borderRadius: '14px', overflow: 'hidden', marginBottom: '0.9rem', boxShadow: `0 2px 8px ${T.sombra}` },
  tarjetaFranja: { width: '6px', flexShrink: 0 },
  tarjetaCuerpo: { flex: 1, padding: '1.2rem 1.4rem' },
  tarjetaHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.8rem', marginBottom: '0.75rem', flexWrap: 'wrap' },
  tarjetaTituloWrap: { display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 },
  tarjetaTitulo: { margin: 0, fontSize: '1.1rem', fontWeight: '700', color: T.textPri, fontFamily: "'Lora', serif", lineHeight: 1.3 },
  nivelBadge: { fontSize: '0.78rem', fontWeight: '700', border: '1.5px solid', borderRadius: '20px', padding: '3px 12px', whiteSpace: 'nowrap', flexShrink: 0 },
  tarjetaDesc: { margin: '0 0 1rem', fontSize: '1rem', color: T.textSub, lineHeight: 1.65 },
  tarjetaFooter: { borderTop: `1px solid ${T.borde}`, paddingTop: '0.65rem', display: 'flex', alignItems: 'center' },
  tarjetaFecha:  { fontSize: '0.82rem', color: T.textMuted, display: 'flex', alignItems: 'center' },
};