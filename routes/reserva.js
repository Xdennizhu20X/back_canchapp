const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reserva.controller');

router.post('/crear', reservaController.crearReserva);
router.get('/:usuarioId', reservaController.obtenerReservas);
router.get("/servicio/:servicioId", reservaController.obtenerReservasPorServicio);
router.patch("/:reservaId/estado", reservaController.actualizarEstadoReserva);
router.get("/espacio/:espacioId", reservaController.obtenerReservasPorEspacio);

module.exports = router;
