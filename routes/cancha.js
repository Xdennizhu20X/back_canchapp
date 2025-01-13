const express = require('express');
const router = express.Router();
const CanchaController = require('../controllers/cancha.controller');

// Ruta para crear una cancha
router.post('/canchas', CanchaController.crearCancha);

// Ruta para obtener todas las canchas
router.get('/canchas', CanchaController.obtenerCanchas);

// Ruta para obtener una cancha por ID
router.get('/canchas/:id', CanchaController.obtenerCanchaPorId);

// Ruta para actualizar una cancha
router.put('/canchas/:id', CanchaController.actualizarCancha);

// Ruta para eliminar una cancha
router.delete('/canchas/:id', CanchaController.eliminarCancha);

module.exports = router;