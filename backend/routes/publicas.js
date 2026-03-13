const express = require('express');
const router  = express.Router();
const db      = require('../config/db');
const { getDiaId, getHoraActual } = require('../helpers/tiempo');

router.get('/estaciones', async (req, res) => {
  try {
    const [rows] = await db.query('CALL sp_get_estaciones()');
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/sentidos', async (req, res) => {
  try {
    const [rows] = await db.query('CALL sp_get_sentidos()');
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/tablero/:idEstacion', async (req, res) => {
  const { idEstacion } = req.params;
  const { idDia, hora } = req.query;
  const diaFinal  = idDia || getDiaId();
  const horaFinal = hora  || getHoraActual();
  try {
    const [rows] = await db.query('CALL sp_get_tablero_estacion(?, ?, ?)', [idEstacion, diaFinal, horaFinal]);
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/horarios-rango', async (req, res) => {
  const { idEstacion, idDia, idSentido, inicio, fin } = req.query;
  try {
    const [rows] = await db.query('CALL sp_get_horarios_rango(?, ?, ?, ?, ?)', [idEstacion, idDia, idSentido, inicio, fin]);
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/avisos', async (req, res) => {
  try {
    const [rows] = await db.query('CALL sp_get_avisos_activos()');
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/avisos', async (req, res) => {
  const { titulo, descripcion, nivel } = req.body;
  try {
    const [result] = await db.query('CALL sp_insertar_aviso(?, ?, ?)', [titulo, descripcion, nivel]);
    res.json({ message: 'Aviso creado con éxito', id: result[0][0].id_nuevo_aviso });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/dias', async (req, res) => {
  try {
    const [rows] = await db.query('CALL sp_get_dias()');
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/servicios', async (req, res) => {
  try {
    const [result] = await db.query('CALL sp_get_servicios_activos()');
    res.json(result[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;