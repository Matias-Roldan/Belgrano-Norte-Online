// helpers/validar.js
// ─────────────────────────────────────────────
// Funciones de validacion y sanitizacion compartidas
// entre controllers publicos y del panel.
// ─────────────────────────────────────────────

// [SEC-FIX] Valida que val sea un entero positivo.
// Devuelve el numero parseado o null si es invalido.
function validarId(val) {
  const n = parseInt(val, 10);
  return Number.isInteger(n) && n > 0 ? n : null;
}

// [SEC-FIX] Sanitiza un string:
// - Elimina caracteres de control (null bytes, etc.)
// - Limita longitud maxima
// - Devuelve null si el resultado esta vacio
function sanitizar(val, max = 255) {
  if (typeof val !== 'string') return null;
  return val.replace(/[\x00-\x1F\x7F]/g, '').trim().slice(0, max) || null;
}

// [SEC-FIX] Valida formato de hora HH:MM:SS o HH:MM
// Evita que datos arbitrarios lleguen al stored procedure.
function validarHora(val) {
  if (typeof val !== 'string') return null;
  const limpio = val.trim();
  if (/^\d{2}:\d{2}(:\d{2})?$/.test(limpio)) return limpio;
  return null;
}

// [SEC-FIX] Valida que el id de dia sea 1, 2 o 3
// (1=semana, 2=sabado, 3=domingo) segun la DB.
function validarIdDia(val) {
  const n = parseInt(val, 10);
  return [1, 2, 3].includes(n) ? n : null;
}

// [SEC-FIX] Respuesta de error interna estandarizada.
// Nunca expone err.message al cliente en produccion.
function errInterno(res, err) {
  console.error('[API Error]', err.message);
  return res.status(500).json({ error: 'Error interno del servidor' });
}

module.exports = { validarId, sanitizar, validarHora, validarIdDia, errInterno };
