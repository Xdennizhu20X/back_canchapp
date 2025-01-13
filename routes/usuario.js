const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuario.controller');

// Ruta para crear un usuario
router.post('/usuarios', UsuarioController.crearUsuario);

// Ruta para obtener todos los usuarios
router.get('/usuarios', UsuarioController.obtenerUsuarios);

// Ruta para obtener un usuario por ID
router.get('/usuarios/:id', UsuarioController.obtenerUsuarioPorId);

// Ruta para actualizar un usuario
router.put('/usuarios/:id', UsuarioController.actualizarUsuario);

// Ruta para eliminar un usuario
router.delete('/usuarios/:id', UsuarioController.eliminarUsuario);

module.exports = router;