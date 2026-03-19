// utils/constantes.js
// ─────────────────────────────────────────────
// Paleta de colores y constantes compartidas
// entre todos los componentes y paginas.
// ─────────────────────────────────────────────

export const T = {
  bgPage:      '#F5F5F0',
  bgWhite:     '#FFFFFF',
  bgCard:      '#FFFFFF',
  red:         '#C0392B',
  redLight:    '#FDECEA',
  redBorde:    '#E8A09A',
  blue:        '#1A6FAA',
  blueLight:   '#EAF3FB',
  blueBorde:   '#9AC4E2',
  orange:      '#D35400',
  orangeLight: '#FEF0E7',
  orangeBorde: '#F0B080',
  slate:       '#2C3E50',
  slateLight:  '#EAF0F6',
  slateBorde:  '#A8BDCC',
  textPri:     '#1A1A1A',
  textSub:     '#555555',
  textMuted:   '#999999',
  borde:       '#E0E0E0',
  sombra:      'rgba(0,0,0,0.08)',
  verde:       '#27AE60',
  verdeLight:  '#EAF7EF',
  amarillo:    '#F39C12',
};

// [SEC-FIX] Allowlist de rutas validas para navegacion programatica.
// Previene open redirect si alguien manipula los parametros de navegacion.
export const RUTAS_VALIDAS = new Set([
  '/', '/tablero', '/planificar', '/avisos', '/quienes-somos',
  '/recorrido', '/tarifa', '/contacto', '/estaciones', '/panel',
  '/panel/avisos', '/panel/estaciones', '/panel/trenes', '/panel/servicios',
]);

export const PALETA_SERVICIO = {
  1: { color: '#27AE60', bg: '#F0FBF4', borde: '#C8E6C9', dot: '#27AE60', label: 'Normal' },
  2: { color: '#D35400', bg: '#FEF3E2', borde: '#F9CB8D', dot: '#D35400', label: 'Alerta' },
  3: { color: '#C0392B', bg: '#FDECEA', borde: '#E8A09A', dot: '#C0392B', label: 'Critico' },
};

export const RUTAS_SIN_NAV = [
  '/panel', '/panel/avisos', '/panel/estaciones', '/panel/trenes', '/panel/servicios',
];
