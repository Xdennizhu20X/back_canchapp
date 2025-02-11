const express = require('express');
const router = express.Router();
const JugadorController = require('../controllers/jugador.controller');

// Rutas CRUD para jugadores
router.post('/jugadores', JugadorController.crearJugador);
router.get('/jugadores', JugadorController.obtenerJugadores);
router.get('/jugadores/:id', JugadorController.obtenerJugadorPorId);
router.put('/jugadores/:id', JugadorController.actualizarJugador);
router.delete('/jugadores/:id', JugadorController.eliminarJugador);

module.exports = router;
