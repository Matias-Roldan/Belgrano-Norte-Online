const express = require('express');
const router  = express.Router();
const db      = require('../config/db');

router.post('/avisos', async (req, res) => {
  const { titulo, descripcion, nivel } = req.body;
  try {
    const [result] = await db.query('CALL sp_insertar_aviso(?, ?, ?)', [titulo, descripcion, nivel]);
    res.json({ message: 'Aviso creado con éxito', id: result[0][0].id_nuevo_aviso });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/avisos', async (req, res) => {
  try {
    const [result] = await db.query('CALL sp_get_avisos_Panel()');
    res.json(result[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/avisos/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, nivel } = req.body;
  try {
    const [result] = await db.query('CALL sp_editar_avisos_Panel(?, ?, ?, ?)', [id, titulo, descripcion, nivel]);
    res.json({ message: result[0][0].resultado });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.patch('/avisos/:id/estado', async (req, res) => {
  const { id } = req.params;
  const { activo } = req.body;
  try {
    const [result] = await db.query('CALL sp_actualizar_estado_avisos_Panel(?, ?)', [id, activo]);
    res.json({ message: result[0][0].resultado });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.get('/estados-estacion', async (req, res) => {
  try {
    const [result] = await db.query('CALL sp_get_estados_estacion_panel()');
    res.json(result[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/estaciones/estado', async (req, res) => {
  const { id_estacion, nuevo_estado } = req.body;
  try {
    const [result] = await db.query('CALL sp_actualizar_estado_estacion(?, ?)', [id_estacion, nuevo_estado]);
    res.json({ message: result[0][0].resultado });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.get('/estados-tren', async (req, res) => {
  try {
    const [result] = await db.query('CALL sp_get_estados_tren_panel()');
    res.json(result[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/trenes/estado', async (req, res) => {
  const { id_tren, nuevo_estado } = req.body;
  try {
    const [result] = await db.query('CALL sp_actualizar_estado_tren(?, ?)', [id_tren, nuevo_estado]);
    res.json({ message: result[0][0].resultado });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.get('/servicios', async (req, res) => {
  try {
    const [result] = await db.query('CALL sp_get_servicios_panel()');
    res.json(result[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/servicios/:id', async (req, res) => {
  const { id } = req.params;
  const { activo } = req.body;
  try {
    const [result] = await db.query('CALL sp_actualizar_servicio_panel(?, ?)', [id, activo]);
    res.json(result[0][0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;