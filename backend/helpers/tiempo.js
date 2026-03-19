// helpers/tiempo.js
// ─────────────────────────────────────────────
// Helpers de fecha y hora para los stored procedures.
// ─────────────────────────────────────────────

// Devuelve el id de dia segun la DB:
// 1 = Lunes a Viernes, 2 = Sabado, 3 = Domingo
const getDiaId = () => {
  const dia = new Date().getDay();
  if (dia >= 1 && dia <= 5) return 1;
  if (dia === 6) return 2;
  return 3;
};

// Devuelve la hora actual en formato HH:MM:SS
const getHoraActual = () => new Date().toLocaleTimeString('it-IT');

module.exports = { getDiaId, getHoraActual };
