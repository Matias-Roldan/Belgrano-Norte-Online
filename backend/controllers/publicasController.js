// controllers/publicasController.js
// ─────────────────────────────────────────────
// Logica de negocio para las rutas publicas.
// Las rutas solo definen el path — la logica vive aca.
// ─────────────────────────────────────────────
const db                                          = require('../config/db');
const { getDiaId, getHoraActual }                 = require('../helpers/tiempo');
const { validarId, sanitizar, validarHora, validarIdDia, errInterno } = require('../helpers/validar');

// GET /api/estaciones
const getEstaciones = async (req, res) => {
  try {
    const [rows] = await db.query('CALL sp_get_estaciones()');
    res.json(rows[0]);
  } catch (err) { errInterno(res, err); }
};

// GET /api/sentidos
const getSentidos = async (req, res) => {
  try {
    const [rows] = await db.query('CALL sp_get_sentidos()');
    res.json(rows[0]);
  } catch (err) { errInterno(res, err); }
};

// GET /api/dias
const getDias = async (req, res) => {
  try {
    const [rows] = await db.query('CALL sp_get_dias()');
    res.json(rows[0]);
  } catch (err) { errInterno(res, err); }
};

// GET /api/avisos
const getAvisos = async (req, res) => {
  try {
    const [rows] = await db.query('CALL sp_get_avisos_activos()');
    res.json(rows[0]);
  } catch (err) { errInterno(res, err); }
};

// GET /api/servicios
const getServicios = async (req, res) => {
  try {
    const [result] = await db.query('CALL sp_get_servicios_activos()');
    res.json(result[0]);
  } catch (err) { errInterno(res, err); }
};

// GET /api/tablero/:idEstacion
const getTablero = async (req, res) => {
  // [SEC-FIX] Validar idEstacion — antes llegaba sin validar al SP
  const idEstacion = validarId(req.params.idEstacion);
  if (!idEstacion) {
    return res.status(400).json({ error: 'ID de estacion invalido' });
  }

  // [SEC-FIX] Validar idDia y hora — antes llegaban sin validar al SP
  const idDia = req.query.idDia ? validarIdDia(req.query.idDia) : getDiaId();
  const hora  = req.query.hora  ? validarHora(req.query.hora)   : getHoraActual();

  if (idDia === null) return res.status(400).json({ error: 'idDia invalido' });
  if (hora  === null) return res.status(400).json({ error: 'hora invalida' });

  try {
    const [rows] = await db.query('CALL sp_get_tablero_estacion(?, ?, ?)', [idEstacion, idDia, hora]);
    res.json(rows[0]);
  } catch (err) { errInterno(res, err); }
};

// GET /api/horarios-rango
const getHorariosRango = async (req, res) => {
  // [SEC-FIX] Todos los parametros se validaban sin sanitizar — riesgo de inyeccion
  const idOrigen  = validarId(req.query.idOrigen);
  const idDestino = validarId(req.query.idDestino);
  const idDia     = validarIdDia(req.query.idDia);
  const inicio    = validarHora(req.query.Inicio);
  const fin       = validarHora(req.query.Fin);

  if (!idOrigen || !idDestino) {
    return res.status(400).json({ error: 'idOrigen e idDestino son requeridos y deben ser IDs validos' });
  }
  if (idDia === null) return res.status(400).json({ error: 'idDia invalido (1=semana, 2=sabado, 3=domingo)' });
  if (!inicio || !fin) return res.status(400).json({ error: 'Inicio y Fin deben tener formato HH:MM o HH:MM:SS' });

  try {
    const [rows] = await db.query(
      'CALL sp_get_horarios_rango(?, ?, ?, ?, ?)',
      [idOrigen, idDestino, idDia, inicio, fin]
    );
    res.json(rows[0]);
  } catch (err) { errInterno(res, err); }
};

module.exports = {
  getEstaciones,
  getSentidos,
  getDias,
  getAvisos,
  getServicios,
  getTablero,
  getHorariosRango,
};
