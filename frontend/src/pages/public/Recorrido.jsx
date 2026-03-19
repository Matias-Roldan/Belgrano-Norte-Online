// [ARCHIVO: Recorrido.jsx] — AUDITADO ✓
import { useSecureNavigate } from '../../hooks/useSecureNavigate';
import { T }                 from '../../utils/constantes';

// [SEC-FIX] Validar coordenadas antes de construir la URL de Google Maps
function getMapsUrl(lat, lng) {
  var latNum = parseFloat(lat);
  var lngNum = parseFloat(lng);
  if (isNaN(latNum) || isNaN(lngNum)) return null;
  if (latNum < -90  || latNum > 90)   return null;
  if (lngNum < -180 || lngNum > 180)  return null;
  return 'https://www.google.com/maps?q=' + latNum + ',' + lngNum;
}

const ESTACIONES = [
  { id: 1,  nombre: 'Retiro',               sub: 'Ciudad de Buenos Aires', cabecera: true,  lat: -34.5902082, lng: -58.3739791 },
  { id: 2,  nombre: 'Saldias',              sub: 'Ciudad de Buenos Aires',                  lat: -34.5724312, lng: -58.4026044 },
  { id: 3,  nombre: 'Ciudad Universitaria', sub: 'Ciudad de Buenos Aires',                  lat: -34.5437403, lng: -58.4465547 },
  { id: 4,  nombre: 'A. Del Valle',         sub: 'Vicente Lopez',                           lat: -34.537422,  lng: -58.4778252 },
  { id: 5,  nombre: 'M. M. Padilla',        sub: 'Vicente Lopez',                           lat: -34.5434812, lng: -58.5006609 },
  { id: 6,  nombre: 'Florida',              sub: 'Vicente Lopez',                           lat: -34.5370305, lng: -58.5130735 },
  { id: 7,  nombre: 'Munro',                sub: 'Vicente Lopez',                           lat: -34.5316841, lng: -58.5235666 },
  { id: 8,  nombre: 'Carapachay',           sub: 'Vicente Lopez',                           lat: -34.5288363, lng: -58.5374045 },
  { id: 9,  nombre: 'Villa Adelina',        sub: 'San Isidro',                              lat: -34.52365,   lng: -58.54611   },
  { id: 10, nombre: 'Boulogne Sur Mer',     sub: 'San Isidro',                              lat: -34.5089524, lng: -58.5649817 },
  { id: 11, nombre: 'Vice Alte. Montes',    sub: 'San Isidro',                              lat: -34.50401,   lng: -58.6201    },
  { id: 12, nombre: 'Don Torcuato',         sub: 'Tigre',                                   lat: -34.5026145, lng: -58.6419947 },
  { id: 13, nombre: 'A. Sourdeaux',         sub: 'Malvinas Argentinas',                     lat: -34.5029131, lng: -58.6668451 },
  { id: 14, nombre: 'Villa de Mayo',        sub: 'Malvinas Argentinas',                     lat: -34.5034582, lng: -58.6807585 },
  { id: 15, nombre: 'Los Polvorines',       sub: 'Malvinas Argentinas',                     lat: -34.49914,   lng: -58.6938453 },
  { id: 16, nombre: 'Ing. Pablo Nogues',    sub: 'Malvinas Argentinas',                     lat: -34.4932755, lng: -58.7072377 },
  { id: 17, nombre: 'Grand Bourg',          sub: 'Malvinas Argentinas',                     lat: -34.4853399, lng: -58.725062  },
  { id: 18, nombre: 'Tierras Altas',        sub: 'Malvinas Argentinas',                     lat: -34.47846,   lng: -58.74026   },
  { id: 19, nombre: 'Tortuguitas',          sub: 'Malvinas Argentinas',                     lat: -34.470715,  lng: -58.7578671 },
  { id: 20, nombre: 'Manuel Alberti',       sub: 'Pilar',                                   lat: -34.4626547, lng: -58.7761476 },
  { id: 21, nombre: 'Del Viso',             sub: 'Pilar',                                   lat: -34.4535911, lng: -58.7961939 },
  { id: 22, nombre: 'Cecilia Grierson',     sub: 'Pilar',                                   lat: -34.43926,   lng: -58.82401   },
  { id: 23, nombre: 'Villa Rosa',           sub: 'Pilar', cabecera: true,                   lat: -34.4168041, lng: -58.8712008 },
];

export default function Recorrido() {
  var navigate = useSecureNavigate(); // [SEC-FIX] navegacion segura con allowlist

  var filas = ESTACIONES.map(function(est, idx) {
    var esCabecera = est.cabecera === true;
    var colorCab   = idx === 0 ? T.red      : T.blue;
    var bgCab      = idx === 0 ? T.redLight  : T.blueLight;
    var bordeCab   = idx === 0 ? T.redBorde  : '#9AC4E2';
    var mapsUrl    = getMapsUrl(est.lat, est.lng);

    var dotStyle = Object.assign({}, s.dot, {
      background: esCabecera ? T.textPri : T.bgWhite,
      border:     '3px solid ' + (esCabecera ? T.textPri : T.borde),
      width:      esCabecera ? '16px' : '11px',
      height:     esCabecera ? '16px' : '11px',
    });

    var rowStyle = Object.assign({}, s.estRow, {
      background: esCabecera ? T.bgPage : T.bgWhite,
      borderLeft: esCabecera ? ('4px solid ' + colorCab) : '4px solid transparent',
    });

    var nombreStyle = Object.assign({}, s.estNombre, {
      fontWeight: esCabecera ? '700' : '500',
      color:      esCabecera ? colorCab : T.textPri,
    });

    var btnStyle = Object.assign({}, s.mapBtn, {
      color:       esCabecera ? colorCab : T.textSub,
      background:  esCabecera ? bgCab    : T.bgPage,
      borderColor: esCabecera ? bordeCab : T.borde,
    });

    var lineaArriba = idx > 0
      ? { display: 'block', width: '2px', flex: '1', minHeight: '8px', background: T.borde }
      : null;

    var lineaAbajo = idx < ESTACIONES.length - 1
      ? { display: 'block', width: '2px', flex: '1', minHeight: '8px', background: T.borde }
      : null;

    var badge = esCabecera
      ? { fontSize: '0.68rem', fontWeight: '600', border: '1px solid ' + T.borde, borderRadius: '5px', padding: '1px 6px', background: T.bgPage, color: T.textSub }
      : null;

    var enlace = mapsUrl
      ? { href: mapsUrl, style: btnStyle }
      : null;

    return {
      key:         est.id,
      dotStyle,
      rowStyle,
      nombreStyle,
      btnStyle,
      lineaArriba,
      lineaAbajo,
      badge,
      enlace,
      esCabecera,
      nombre:      est.nombre,
      sub:         est.sub,
      num:         idx + 1,
    };
  });

  return (
    <div style={s.root}>

      <header style={s.header}>
        <div style={s.headerInner}>
          <button onClick={function() { navigate('/'); }} style={s.btnVolver} aria-label="Volver al inicio">
            Volver
          </button>
          <div style={s.headerCentro}>
            <div style={s.headerTitulo}>Recorrido</div>
            <div style={s.headerSub}>Ramal Retiro - Villa Rosa</div>
          </div>
          <div style={{ minWidth: '80px' }}/>
        </div>
        <div style={s.headerLine}/>
      </header>

      <main style={s.main}>

        <div style={s.panel}>
          <div style={s.panelTitulo}>Linea Belgrano Norte</div>
          <p style={s.panelTxt}>
            El Ferrocarril Belgrano Norte tiene un recorrido de{' '}
            <strong>54 kilometros</strong> de extension entre las cabeceras de
            estacion <strong>Retiro</strong>, en la Ciudad de Buenos Aires, y la
            estacion <strong>Villa Rosa</strong> en el Partido de Pilar.
          </p>
          <div style={s.statsRow}>
            <div style={s.stat}>
              <div style={s.statNum}>54</div>
              <div style={s.statLbl}>km de extension</div>
            </div>
            <div style={s.stat}>
              <div style={Object.assign({}, s.statNum, { color: T.blue })}>
                {ESTACIONES.length}
              </div>
              <div style={s.statLbl}>estaciones</div>
            </div>
            <div style={s.stat}>
              <div style={Object.assign({}, s.statNum, { color: '#7D3C98' })}>2</div>
              <div style={s.statLbl}>cabeceras</div>
            </div>
          </div>
        </div>

        <div style={s.cabecrasRow}>
          <div style={Object.assign({}, s.cabeceraCard, { borderTop: '4px solid ' + T.red })}>
            <div style={s.cabeceraIco}></div>
            <div style={s.cabeceraLbl}>Cabecera sur</div>
            <div style={Object.assign({}, s.cabeceraNombre, { color: T.red })}>Retiro</div>
            <div style={s.cabeceraDesc}>Ciudad de Buenos Aires</div>
          </div>
          <div style={s.flechaConector}>
            <div style={s.flechaLinea}/>
            <div style={s.flechaTxt}>54 km - 23 estaciones</div>
            <div style={s.flechaLinea}/>
          </div>
          <div style={Object.assign({}, s.cabeceraCard, { borderTop: '4px solid ' + T.blue })}>
            <div style={s.cabeceraIco}></div>
            <div style={s.cabeceraLbl}>Cabecera norte</div>
            <div style={Object.assign({}, s.cabeceraNombre, { color: T.blue })}>Villa Rosa</div>
            <div style={s.cabeceraDesc}>Partido de Pilar</div>
          </div>
        </div>

        <div style={s.listaPanel}>
          <div style={s.listaTitulo}>Estaciones del recorrido</div>

          {filas.map(function(f) {
            return (
              <div key={f.key} style={s.filaEst}>
                <div style={s.lineaCol}>
                  {f.lineaArriba && <div style={f.lineaArriba}/>}
                  <div style={f.dotStyle}/>
                  {f.lineaAbajo && <div style={f.lineaAbajo}/>}
                </div>
                <div style={f.rowStyle}>
                  <div style={s.estNumero}>{f.num}</div>
                  <div style={s.estInfo}>
                    <div style={f.nombreStyle}>
                      {f.nombre}
                      {f.badge && <span style={f.badge}>Cabecera</span>}
                    </div>
                    <div style={s.estSub}>{f.sub}</div>
                  </div>
                  {f.enlace
                    ? (
                      <a
                        href={f.enlace.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={f.enlace.style}
                        aria-label={'Ver ' + f.nombre + ' en mapa'}
                      >
                        Ver en mapa
                      </a>
                    )
                    : (
                      <span style={Object.assign({}, f.btnStyle, { opacity: 0.4, cursor: 'default' })}>
                        Ver en mapa
                      </span>
                    )
                  }
                </div>
              </div>
            );
          })}
        </div>

      </main>
    </div>
  );
}

const s = {
  root:           { backgroundColor: T.bgPage, minHeight: '100vh', fontFamily: "'Source Sans 3', 'Segoe UI', sans-serif", color: T.textPri },
  header:         { background: T.bgWhite, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', position: 'sticky', top: 0, zIndex: 100 },
  headerInner:    { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', maxWidth: '820px', margin: '0 auto', width: '100%' },
  btnVolver:      { background: T.bgWhite, border: '2px solid ' + T.borde, color: T.textSub, padding: '0.6rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '600', whiteSpace: 'nowrap', minHeight: '44px' },
  headerCentro:   { textAlign: 'center' },
  headerTitulo:   { fontSize: '1.3rem', fontWeight: '700', color: T.textPri, fontFamily: "'Lora', serif", lineHeight: 1.1 },
  headerSub:      { fontSize: '0.75rem', color: T.textSub, marginTop: '2px' },
  headerLine:     { height: '3px', background: 'linear-gradient(90deg, #C0392B, #E74C3C)' },
  main:           { maxWidth: '820px', margin: '0 auto', padding: '1.5rem' },
  panel:          { background: T.bgWhite, border: '1.5px solid ' + T.borde, borderRadius: '16px', padding: '1.4rem', marginBottom: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
  panelTitulo:    { fontSize: '1.1rem', fontWeight: '600', color: T.textPri, fontFamily: "'Lora', serif", marginBottom: '0.6rem' },
  panelTxt:       { fontSize: '0.95rem', color: T.textSub, lineHeight: 1.6, margin: '0 0 1.2rem' },
  statsRow:       { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.8rem' },
  stat:           { background: T.bgPage, borderRadius: '10px', padding: '0.8rem', textAlign: 'center', border: '1px solid ' + T.borde },
  statNum:        { fontSize: '1.8rem', fontWeight: '700', color: T.red, fontFamily: "'Lora', serif", lineHeight: 1 },
  statLbl:        { fontSize: '0.75rem', color: T.textMuted, marginTop: '3px' },
  cabecrasRow:    { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' },
  cabeceraCard:   { flex: 1, background: T.bgWhite, border: '1.5px solid ' + T.borde, borderRadius: '12px', padding: '1rem', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
  cabeceraIco:    { fontSize: '1.5rem', marginBottom: '0.3rem' },
  cabeceraLbl:    { fontSize: '0.72rem', color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' },
  cabeceraNombre: { fontSize: '1.1rem', fontWeight: '700', fontFamily: "'Lora', serif", margin: '0.2rem 0' },
  cabeceraDesc:   { fontSize: '0.8rem', color: T.textSub },
  flechaConector: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '0 4px' },
  flechaLinea:    { width: '1px', height: '20px', background: T.borde },
  flechaTxt:      { fontSize: '0.7rem', color: T.textMuted, whiteSpace: 'nowrap', textAlign: 'center' },
  listaPanel:     { background: T.bgWhite, border: '1.5px solid ' + T.borde, borderRadius: '16px', padding: '1.4rem', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
  listaTitulo:    { fontSize: '1.1rem', fontWeight: '600', color: T.textPri, fontFamily: "'Lora', serif", marginBottom: '1rem' },
  filaEst:        { display: 'flex', alignItems: 'stretch', gap: '0.8rem', marginBottom: '3px' },
  lineaCol:       { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20px', flexShrink: 0 },
  dot:            { borderRadius: '50%', flexShrink: 0, transition: 'all 0.2s' },
  estRow:         { flex: 1, display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.6rem 0.9rem', borderRadius: '8px', border: '1px solid ' + T.borde, borderLeftWidth: '4px', borderLeftStyle: 'solid' },
  estNumero:      { fontSize: '0.75rem', fontWeight: '700', color: T.textMuted, minWidth: '18px', textAlign: 'right', fontFamily: "'Lora', serif" },
  estInfo:        { flex: 1 },
  estNombre:      { fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' },
  estSub:         { fontSize: '0.76rem', color: T.textMuted, marginTop: '1px' },
  mapBtn:         { fontSize: '0.75rem', fontWeight: '600', padding: '5px 10px', borderRadius: '8px', border: '1.5px solid', textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0, cursor: 'pointer' },
};
