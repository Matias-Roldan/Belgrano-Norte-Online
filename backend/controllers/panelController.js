// controllers/panelController.js
// ─────────────────────────────────────────────
// Logica de negocio para las rutas del panel admin.
// Requiere token JWT valido (verificado en middleware).
// ─────────────────────────────────────────────
const db                                  = require('../config/db');
const { validarId, sanitizar, errInterno } = require('../helpers/validar');

// ── AVISOS ────────────────────────────────────

// GET /api/panel/avisos
const getAvisos = async (req, res) => {
  try {
    const [result] = await db.query('CALL sp_get_avisos_Panel()');
    res.json(result[0]);
  } catch (err) { errInterno(res, err); }
};

// POST /api/panel/avisos
const crearAviso = async (req, res) => {
  const titulo      = sanitizar(req.body.titulo, 120);
  const descripcion = sanitizar(req.body.descripcion, 500);
  const nivel       = validarId(req.body.nivel);

  if (!titulo || !nivel) {
    return res.status(400).json({ error: 'titulo y nivel son requeridos' });
  }

  try {
    const [result] = await db.query('CALL sp_insertar_aviso(?, ?, ?)', [titulo, descripcion, nivel]);
    res.json({ message: 'Aviso creado con exito', id: result[0][0].id_nuevo_aviso });
  } catch (err) { errInterno(res, err); }
};

// PUT /api/panel/avisos/:id
const editarAviso = async (req, res) => {
  const id          = validarId(req.params.id);
  const titulo      = sanitizar(req.body.titulo, 120);
  const descripcion = sanitizar(req.body.descripcion, 500);
  const nivel       = validarId(req.body.nivel);

  if (!id || !titulo || !nivel) {
    return res.status(400).json({ error: 'Parametros invalidos' });
  }

  try {
    const [result] = await db.query('CALL sp_editar_avisos_Panel(?, ?, ?, ?)', [id, titulo, descripcion, nivel]);
    res.json({ message: result[0][0].resultado });
  } catch (err) { errInterno(res, err); }
};

// PATCH /api/panel/avisos/:id/estado
const actualizarEstadoAviso = async (req, res) => {
  const id     = validarId(req.params.id);
  const activo = req.body.activo === true || req.body.activo === 1 ? 1 : 0;

  if (!id) return res.status(400).json({ error: 'ID invalido' });

  try {
    const [result] = await db.query('CALL sp_actualizar_estado_avisos_Panel(?, ?)', [id, activo]);
    res.json({ message: result[0][0].resultado });
  } catch (err) { errInterno(res, err); }
};

// ── ESTACIONES ────────────────────────────────

// GET /api/panel/estados-estacion
const getEstadosEstacion = async (req, res) => {
  try {
    const [result] = await db.query('CALL sp_get_estados_estacion_panel()');
    res.json(result[0]);
  } catch (err) { errInterno(res, err); }
};

// PUT /api/panel/estaciones/estado
const actualizarEstadoEstacion = async (req, res) => {
  const id_estacion  = validarId(req.body.id_estacion);
  const nuevo_estado = validarId(req.body.nuevo_estado);

  if (!id_estacion || nuevo_estado === null) {
    return res.status(400).json({ error: 'Parametros invalidos' });
  }

  try {
    const [result] = await db.query('CALL sp_actualizar_estado_estacion(?, ?)', [id_estacion, nuevo_estado]);
    res.json({ message: result[0][0].resultado });
  } catch (err) { errInterno(res, err); }
};

// ── TRENES ────────────────────────────────────

// GET /api/panel/estados-tren
const getEstadosTren = async (req, res) => {
  try {
    const [result] = await db.query('CALL sp_get_estados_tren_panel()');
    res.json(result[0]);
  } catch (err) { errInterno(res, err); }
};

// PUT /api/panel/trenes/estado
const actualizarEstadoTren = async (req, res) => {
  const id_tren      = validarId(req.body.id_tren);
  const nuevo_estado = validarId(req.body.nuevo_estado);

  if (!id_tren || nuevo_estado === null) {
    return res.status(400).json({ error: 'Parametros invalidos' });
  }

  try {
    const [result] = await db.query('CALL sp_actualizar_estado_tren(?, ?)', [id_tren, nuevo_estado]);
    res.json({ message: result[0][0].resultado });
  } catch (err) { errInterno(res, err); }
};

// ── SERVICIOS ─────────────────────────────────

// GET /api/panel/servicios
const getServicios = async (req, res) => {
  try {
    const [result] = await db.query('CALL sp_get_servicios_panel()');
    res.json(result[0]);
  } catch (err) { errInterno(res, err); }
};

// PATCH /api/panel/servicios/:id
const actualizarServicio = async (req, res) => {
  const id     = validarId(req.params.id);
  const activo = req.body.activo === true || req.body.activo === 1 ? 1 : 0;

  if (!id) return res.status(400).json({ error: 'ID invalido' });

  try {
    const [result] = await db.query('CALL sp_actualizar_servicio_panel(?, ?)', [id, activo]);
    res.json(result[0][0]);
  } catch (err) { errInterno(res, err); }
};

module.exports = {
  getAvisos,
  crearAviso,
  editarAviso,
  actualizarEstadoAviso,
  getEstadosEstacion,
  actualizarEstadoEstacion,
  getEstadosTren,
  actualizarEstadoTren,
  getServicios,
  actualizarServicio,
};
