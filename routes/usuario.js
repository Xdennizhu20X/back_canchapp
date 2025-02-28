const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuario.controller');

// Rutas de autenticación
router.post('/auth/registro', UsuarioController.registrarse);
router.post('/auth/login', UsuarioController.loguearse);

// Rutas protegidas con autenticación
router.get('/usuarios', UsuarioController.obtenerUsuarios);

// Ruta exclusiva para "dueños"
router.get('/usuarios-protegidos', UsuarioController.verificarToken, UsuarioController.verificarDueno, UsuarioController.obtenerUsuarios);
router.get('/usuario/:id', UsuarioController.verificarToken, UsuarioController.obtenerUsuarioPorId);

module.exports = router;
