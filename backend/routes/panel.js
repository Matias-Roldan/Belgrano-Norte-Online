const express = require('express');
const router  = express.Router();
const db      = require('../config/db');

// [SEC-FIX] Validador de ID numérico entero positivo
function validarId(val) {
  const n = parseInt(val, 10);
  return Number.isInteger(n) && n > 0 ? n : null;
}

// [SEC-FIX] Sanitizar string — limitar longitud y eliminar caracteres de control
function sanitizar(val, max = 255) {
  if (typeof val !== 'string') return null;
  return val.replace(/[\x00-\x1F\x7F]/g, '').trim().slice(0, max) || null;
}

// [SEC-FIX] Respuesta de error sin exponer detalles internos
function errInterno(res, err) {
  console.error('[Panel Error]', err.message);
  return res.status(500).json({ error: 'Error interno del servidor' });
}

router.post('/avisos', async (req, res) => {
  const titulo      = sanitizar(req.body.titulo, 120);
  const descripcion = sanitizar(req.body.descripcion, 500);
  const nivel       = validarId(req.body.nivel);

  if (!titulo || !nivel) {
    return res.status(400).json({ error: 'titulo y nivel son requeridos' });
  }

  try {
    const [result] = await db.query('CALL sp_insertar_aviso(?, ?, ?)', [titulo, descripcion, nivel]);
    res.json({ message: 'Aviso creado con éxito', id: result[0][0].id_nuevo_aviso });
  } catch (err) { errInterno(res, err); }
});

router.get('/avisos', async (req, res) => {
  try {
    const [result] = await db.query('CALL sp_get_avisos_Panel()');
    res.json(result[0]);
  } catch (err) { errInterno(res, err); }
});

router.put('/avisos/:id', async (req, res) => {
  const id          = validarId(req.params.id);
  const titulo      = sanitizar(req.body.titulo, 120);
  const descripcion = sanitizar(req.body.descripcion, 500);
  const nivel       = validarId(req.body.nivel);

  if (!id || !titulo || !nivel) {
    return res.status(400).json({ error: 'Parámetros inválidos' });
  }

  try {
    const [result] = await db.query('CALL sp_editar_avisos_Panel(?, ?, ?, ?)', [id, titulo, descripcion, nivel]);
    res.json({ message: result[0][0].resultado });
  } catch (err) { errInterno(res, err); }
});

router.patch('/avisos/:id/estado', async (req, res) => {
  const id     = validarId(req.params.id);
  const activo = req.body.activo === true || req.body.activo === 1 ? 1 : 0;

  if (!id) return res.status(400).json({ error: 'ID inválido' });

  try {
    const [result] = await db.query('CALL sp_actualizar_estado_avisos_Panel(?, ?)', [id, activo]);
    res.json({ message: result[0][0].resultado });
  } catch (err) { errInterno(res, err); }
});

router.get('/estados-estacion', async (req, res) => {
  try {
    const [result] = await db.query('CALL sp_get_estados_estacion_panel()');
    res.json(result[0]);
  } catch (err) { errInterno(res, err); }
});

router.put('/estaciones/estado', async (req, res) => {
  const id_estacion  = validarId(req.body.id_estacion);
  const nuevo_estado = validarId(req.body.nuevo_estado);

  if (!id_estacion || nuevo_estado === null) {
    return res.status(400).json({ error: 'Parámetros inválidos' });
  }

  try {
    const [result] = await db.query('CALL sp_actualizar_estado_estacion(?, ?)', [id_estacion, nuevo_estado]);
    res.json({ message: result[0][0].resultado });
  } catch (err) { errInterno(res, err); }
});

router.get('/estados-tren', async (req, res) => {
  try {
    const [result] = await db.query('CALL sp_get_estados_tren_panel()');
    res.json(result[0]);
  } catch (err) { errInterno(res, err); }
});

router.put('/trenes/estado', async (req, res) => {
  const id_tren      = validarId(req.body.id_tren);
  const nuevo_estado = validarId(req.body.nuevo_estado);

  if (!id_tren || nuevo_estado === null) {
    return res.status(400).json({ error: 'Parámetros inválidos' });
  }

  try {
    const [result] = await db.query('CALL sp_actualizar_estado_tren(?, ?)', [id_tren, nuevo_estado]);
    res.json({ message: result[0][0].resultado });
  } catch (err) { errInterno(res, err); }
});

router.get('/servicios', async (req, res) => {
  try {
    const [result] = await db.query('CALL sp_get_servicios_panel()');
    res.json(result[0]);
  } catch (err) { errInterno(res, err); }
});

router.patch('/servicios/:id', async (req, res) => {
  const id     = validarId(req.params.id);
  const activo = req.body.activo === true || req.body.activo === 1 ? 1 : 0;

  if (!id) return res.status(400).json({ error: 'ID inválido' });

  try {
    const [result] = await db.query('CALL sp_actualizar_servicio_panel(?, ?)', [id, activo]);
    res.json(result[0][0]);
  } catch (err) { errInterno(res, err); }
});

module.exports = router;

