// utils/sanitizar.js
// ─────────────────────────────────────────────
// Funciones de sanitizacion y validacion de datos
// provenientes de la API. Compartidas entre componentes.
// ─────────────────────────────────────────────

// [SEC-FIX] Sanitiza strings de la API antes de renderizarlos.
// Elimina caracteres de control y limita longitud maxima.
// Para HTML rico usar DOMPurify (npm install dompurify).
export function sanitizarTexto(str, maxLen = 300) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>'"]/g, c => ({ '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c]))
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim()
    .slice(0, maxLen);
}

// [SEC-FIX] Valida que los datos de servicio de la API tienen
// la forma esperada antes de usarlos en el render.
// Previene prototype pollution y errores si la API devuelve datos inesperados.
export function validarServicio(srv) {
  if (!srv || typeof srv !== 'object') return null;
  const idValido = [1, 2, 3].includes(Number(srv.id_servicio));
  if (!idValido) return null;
  return {
    id_servicio: Number(srv.id_servicio),
    titulo:      sanitizarTexto(srv.titulo || '', 120),
    descripcion: srv.descripcion ? sanitizarTexto(srv.descripcion, 250) : null,
  };
}
