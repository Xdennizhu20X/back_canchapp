const Usuario = require('../models/usuario.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UsuarioController = {
  // Registrar un usuario
  async registrarse(req, res) {
    try {
      const { nombre, email, password, rol } = req.body;

      // Verificar si el email ya está en uso
      const usuarioExistente = await Usuario.findOne({ email });
      if (usuarioExistente) {
        return res.status(400).json({ error: 'El correo ya está registrado' });
      }

      // Validar el rol
      if (!['jugador', 'dueño'].includes(rol)) {
        return res.status(400).json({ error: 'Rol no válido' });
      }

      // Hashear la contraseña
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // Crear usuario
      const nuevoUsuario = new Usuario({ nombre, email, password: passwordHash, rol });
      const usuarioGuardado = await nuevoUsuario.save();

      res.status(201).json({ mensaje: 'Usuario registrado con éxito', usuario: usuarioGuardado });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Iniciar sesión
  async loguearse(req, res) {
    try {
      const { email, password } = req.body;

      // Buscar usuario
      const usuario = await Usuario.findOne({ email });
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // Verificar contraseña
      const esValida = await bcrypt.compare(password, usuario.password);
      if (!esValida) {
        return res.status(401).json({ error: 'Contraseña incorrecta' });
      }

      // Crear token JWT
      const token = jwt.sign({ id: usuario._id, rol: usuario.rol }, 'secreto_super_seguro', { expiresIn: '1h' });

      res.status(200).json({ mensaje: 'Inicio de sesión exitoso', token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Middleware para verificar token y rol
  verificarToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Acceso denegado' });

    try {
      const verificado = jwt.verify(token, 'secreto_super_seguro');
      req.usuario = verificado;
      next();
    } catch (error) {
      res.status(400).json({ error: 'Token no válido' });
    }
  },

  // Middleware para verificar si el usuario es dueño
  verificarDueno(req, res, next) {
    if (req.usuario.rol !== 'dueño') {
      return res.status(403).json({ error: 'Acceso restringido a dueños' });
    }
    next();
  },

  // Obtener todos los usuarios (solo dueños pueden acceder)
  async obtenerUsuarios(req, res) {
    try {
      const usuarios = await Usuario.find();
      res.status(200).json(usuarios);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = UsuarioController;
