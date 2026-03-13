
const getDiaId = () => {
  const dia = new Date().getDay();
  if (dia >= 1 && dia <= 5) return 1;
  if (dia === 6) return 2;
  return 3;
};

const getHoraActual = () => new Date().toLocaleTimeString('it-IT');

module.exports = { getDiaId, getHoraActual };