// routes/panel.js
// ─────────────────────────────────────────────
// Solo define las rutas del panel admin.
// Todas requieren token JWT (verificado en server.js).
// La logica vive en controllers/panelController.js
// ─────────────────────────────────────────────
const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/panelController');

// Avisos
router.get('/avisos',              controller.getAvisos);
router.post('/avisos',             controller.crearAviso);
router.put('/avisos/:id',          controller.editarAviso);
router.patch('/avisos/:id/estado', controller.actualizarEstadoAviso);

// Estaciones
router.get('/estados-estacion',    controller.getEstadosEstacion);
router.put('/estaciones/estado',   controller.actualizarEstadoEstacion);

// Trenes
router.get('/estados-tren',        controller.getEstadosTren);
router.put('/trenes/estado',       controller.actualizarEstadoTren);

// Servicios
router.get('/servicios',           controller.getServicios);
router.patch('/servicios/:id',     controller.actualizarServicio);

module.exports = router;
