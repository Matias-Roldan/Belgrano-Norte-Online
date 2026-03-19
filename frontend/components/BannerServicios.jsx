// components/BannerServicios.jsx
// ─────────────────────────────────────────────
// Banner dinamico que muestra el estado actual
// del servicio consultando la API en tiempo real.
// ─────────────────────────────────────────────
import { useState, useEffect } from 'react';
import api from '../src/api/belgrano';
import { T,PALETA_SERVICIO } from '../src/utils/constantes';
import { validarServicio } from '../src/utils/sanitizar';

function getCfgServicio(id) {
  return PALETA_SERVICIO[id] || PALETA_SERVICIO[1];
}

function IconoEstado({ tipo }) {
  if (tipo === 2) return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  );
  if (tipo === 3) return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/>
    </svg>
  );
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

export default function BannerServicios() {
  const [servicios, setServicios] = useState([]);
  const [cargando,  setCargando]  = useState(true);

  useEffect(() => {
    let activo = true;
    api.get('/servicios')
      .then(r => {
        if (!activo) return;
        const data    = Array.isArray(r.data) ? r.data : [];
        const seguros = data.map(validarServicio).filter(Boolean).slice(0, 10);
        setServicios(seguros);
      })
      .catch(() => { if (activo) setServicios([]); })
      .finally(() => { if (activo) setCargando(false); });
    return () => { activo = false; };
  }, []);

  if (!cargando && servicios.length === 0) {
    return (
      <div role="status" aria-live="polite" aria-label="Estado del servicio: normal"
        style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.85rem 1.5rem', background: '#F0FBF4', borderBottom: '1px solid #C8E6C9' }}
      >
        <span aria-hidden="true" style={{ width: '10px', height: '10px', borderRadius: '50%', background: T.verde, boxShadow: `0 0 8px ${T.verde}88`, flexShrink: 0, display: 'inline-block', animation: 'pulse 2.5s infinite' }}/>
        <span style={{ fontSize: '0.9rem', color: '#2E7D32', fontWeight: '500' }}>Servicio operando con normalidad en todas las estaciones</span>
      </div>
    );
  }

  if (!cargando && servicios.length === 1) {
    const srv = servicios[0];
    const cfg = getCfgServicio(srv.id_servicio);
    return (
      <div role="status" aria-live="polite" aria-label={`Alerta de servicio: ${srv.titulo}`}
        style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.85rem 1.5rem', background: cfg.bg, borderBottom: `1px solid ${cfg.borde}` }}
      >
        <span aria-hidden="true" style={{ width: '10px', height: '10px', borderRadius: '50%', background: cfg.dot, flexShrink: 0, display: 'inline-block', animation: 'pulse 2.5s infinite' }}/>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', color: cfg.color, fontWeight: '600' }}>
          <IconoEstado tipo={srv.id_servicio}/>
          {srv.titulo}
        </span>
        {srv.descripcion && (
          <span style={{ fontSize: '0.85rem', color: cfg.color, opacity: 0.8 }}>
            — {srv.descripcion}
          </span>
        )}
      </div>
    );
  }

  if (!cargando && servicios.length > 1) {
    return (
      <div role="status" aria-live="polite" style={{ borderBottom: '1px solid #E0E0E0' }}>
        {servicios.map(srv => {
          const cfg = getCfgServicio(srv.id_servicio);
          return (
            <div key={srv.id_servicio} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.7rem', padding: '0.75rem 1.5rem', background: cfg.bg, borderBottom: `1px solid ${cfg.borde}` }}>
              <span aria-hidden="true" style={{ width: '10px', height: '10px', borderRadius: '50%', background: cfg.dot, flexShrink: 0, marginTop: '5px', display: 'inline-block', animation: 'pulse 2.5s infinite' }}/>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', color: cfg.color, fontWeight: '700', lineHeight: 1.3 }}>
                  <IconoEstado tipo={srv.id_servicio}/>
                  {srv.titulo}
                </div>
                {srv.descripcion && (
                  <div style={{ fontSize: '0.82rem', color: cfg.color, opacity: 0.8, marginTop: '1px' }}>
                    {srv.descripcion}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.85rem 1.5rem', background: '#F8F8F8', borderBottom: '1px solid #E0E0E0' }}>
      <span aria-hidden="true" style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#CBD5E0', flexShrink: 0, display: 'inline-block' }}/>
      <span style={{ fontSize: '0.9rem', color: T.textMuted }}>Verificando estado del servicio...</span>
    </div>
  );
}
