// routes/publicas.js
// ─────────────────────────────────────────────
// Solo define las rutas publicas.
// La logica vive en controllers/publicasController.js
// ─────────────────────────────────────────────
const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/publicasController');

router.get('/estaciones',    controller.getEstaciones);
router.get('/sentidos',      controller.getSentidos);
router.get('/dias',          controller.getDias);
router.get('/avisos',        controller.getAvisos);
router.get('/servicios',     controller.getServicios);
router.get('/tablero/:idEstacion', controller.getTablero);
router.get('/horarios-rango',      controller.getHorariosRango);

module.exports = router;
