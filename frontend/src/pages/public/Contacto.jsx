// [ARCHIVO: Contacto.jsx] -- AUDITADO
import { useSecureNavigate } from '../../hooks/useSecureNavigate';
import { T }                 from '../../utils/constantes';

const CONTACTOS = [
  {
    tipo:   'ubicacion',
    titulo: 'Direccion',
    linea1: 'Av. Dr. Ramos Mejia 1430',
    linea2: 'Estacion Retiro, Buenos Aires',
    color:  '#7D3C98',
    bg:     '#F5EEF8',
    href:   'https://maps.google.com/?q=Av.+Dr.+Ramos+Mejia+1430+Buenos+Aires',
    accion: 'Ver en mapa',
  },
  {
    tipo:   'horario',
    titulo: 'Horario de atencion',
    linea1: 'Lunes a Viernes',
    linea2: '8:00 a 20:00 hs',
    color:  '#D35400',
    bg:     '#FEF0E7',
  },
  {
    tipo:   'telefono',
    titulo: 'Telefono',
    linea2: '0800-777-3377',
    color:  '#1A6FAA',
    bg:     '#EAF3FB',
  },
  {
    tipo:   'email',
    titulo: 'Correo electronico',
    linea1: 'atencionalpasajero@ferrovias.com.ar',
    color:  '#C0392B',
    bg:     '#FDECEA',
  },
];

function IconoTipo({ tipo, color }) {
  var c = color || '#555';
  if (tipo === 'ubicacion') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    );
  }
  if (tipo === 'horario') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    );
  }
  if (tipo === 'telefono') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.64 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.64a16 16 0 0 0 5.95 5.95l.97-.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  );
}

function LinkAccion({ href, tipo, accion, titulo, color, bg }) {
  return (
    <a
      href={href}
      target={tipo === 'ubicacion' ? '_blank' : undefined}
      rel={tipo === 'ubicacion' ? 'noopener noreferrer' : undefined}
      style={{
        fontSize: '0.8rem', fontWeight: '700',
        padding: '6px 12px', borderRadius: '8px',
        border: '1.5px solid ' + color + '55',
        textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0,
        color: color, background: bg,
      }}
      aria-label={accion + ': ' + titulo}
    >
      {accion}
    </a>
  );
}

export default function Contacto() {
  var navigate = useSecureNavigate(); // [SEC-FIX] navegacion segura con allowlist

  return (
    <div style={s.root}>

      <header style={s.header}>
        <div style={s.headerInner}>
          <button
            onClick={function() { navigate('/'); }}
            style={s.btnVolver}
            aria-label="Volver al inicio"
          >
            Volver
          </button>
          <div style={s.headerCentro}>
            <div style={s.headerTitulo}>Contacto</div>
            <div style={s.headerSub}>Atencion al Pasajero</div>
          </div>
          <div style={{ minWidth: '80px' }} aria-hidden="true" />
        </div>
        <div style={s.headerLine} />
      </header>

      <main style={s.main}>

        <div style={s.panel}>
          <div style={s.panelTitulo}>Oficina de Atencion al Pasajero</div>
          <p style={s.panelTxt}>
            Contacto con el Tren Belgrano Norte - Empresa Ferrovias.
            Podas comunicarte por telefono, correo electronico o acercarte
            personalmente a la oficina en Estacion Retiro.
          </p>
        </div>

        {CONTACTOS.map(function(item, i) {
          return (
            <div
              key={i}
              style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                background: T.bgWhite, border: '1.5px solid ' + T.borde,
                borderLeft: '4px solid ' + item.color,
                borderRadius: '12px', padding: '1rem 1.2rem',
                marginBottom: '0.8rem', boxShadow: '0 2px 8px ' + T.sombra,
              }}
            >
              <div style={{
                width: '44px', height: '44px', minWidth: '44px',
                borderRadius: '10px', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, background: item.bg,
              }}>
                <IconoTipo tipo={item.tipo} color={item.color} />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '0.78rem', fontWeight: '700', color: item.color,
                  textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem',
                }}>
                  {item.titulo}
                </div>
                <div style={{ fontSize: '0.97rem', fontWeight: '600', color: T.textPri }}>
                  {item.linea1}
                </div>
                {item.linea2 && (
                  <div style={{ fontSize: '0.85rem', color: T.textSub }}>
                    {item.linea2}
                  </div>
                )}
              </div>

              {item.href && (
                <LinkAccion
                  href={item.href}
                  tipo={item.tipo}
                  accion={item.accion}
                  titulo={item.titulo}
                  color={item.color}
                  bg={item.bg}
                />
              )}
            </div>
          );
        })}

        <div style={s.aviso} role="note">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7A6000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0, marginTop: '1px' }}>
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
            <line x1="12" y1="12" x2="12" y2="16"/>
          </svg>
          <span style={s.avisoTxt}>
            Este sitio no pertenece a Ferrovias ni a ningun organismo oficial.
            Para consultas formales dirigirse directamente a los canales indicados.
          </span>
        </div>

      </main>
    </div>
  );
}

const s = {
  root:         { backgroundColor: T.bgPage, minHeight: '100vh', fontFamily: "'Source Sans 3', 'Segoe UI', sans-serif", color: T.textPri },
  header:       { background: T.bgWhite, boxShadow: '0 2px 8px ' + T.sombra, position: 'sticky', top: 0, zIndex: 100 },
  headerInner:  { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', maxWidth: '820px', margin: '0 auto', width: '100%' },
  btnVolver:    { background: T.bgWhite, border: '2px solid ' + T.borde, color: T.textSub, padding: '0.6rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '600', whiteSpace: 'nowrap', minHeight: '44px' },
  headerCentro: { textAlign: 'center' },
  headerTitulo: { fontSize: '1.3rem', fontWeight: '700', color: T.textPri, fontFamily: "'Lora', serif", lineHeight: 1.1 },
  headerSub:    { fontSize: '0.75rem', color: T.textSub, marginTop: '2px' },
  headerLine:   { height: '3px', background: 'linear-gradient(90deg, ' + T.red + ', #E74C3C)' },
  main:         { maxWidth: '820px', margin: '0 auto', padding: '1.5rem' },
  panel:        { background: T.bgWhite, border: '1.5px solid ' + T.borde, borderRadius: '16px', padding: '1.4rem', marginBottom: '1rem', boxShadow: '0 2px 8px ' + T.sombra },
  panelTitulo:  { fontSize: '1.1rem', fontWeight: '600', color: T.textPri, fontFamily: "'Lora', serif", marginBottom: '0.6rem' },
  panelTxt:     { fontSize: '0.95rem', color: T.textSub, lineHeight: 1.6, margin: 0 },
  aviso:        { display: 'flex', alignItems: 'flex-start', gap: '0.7rem', background: '#FFFBEB', border: '1.5px solid #F0D060', borderRadius: '12px', padding: '1rem 1.2rem', marginTop: '0.4rem' },
  avisoTxt:     { fontSize: '0.88rem', color: '#7A6000', lineHeight: 1.5 },
};
