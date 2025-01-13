const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reserva.controller');

router.post('/crear', reservaController.crearReserva);
router.get('/:usuarioId', reservaController.obtenerReservas);

module.exports = router;
