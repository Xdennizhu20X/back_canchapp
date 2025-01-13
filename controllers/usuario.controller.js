

const Usuario = require('../models/usuario.model');

const UsuarioController = {
  // Crear un nuevo usuario
  async crearUsuario(req, res) {
    try {
      const { nombre, email, password } = req.body;
      const nuevoUsuario = new Usuario({ nombre, email, password });
      const usuarioGuardado = await nuevoUsuario.save();
      res.status(201).json(usuarioGuardado);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Obtener todos los usuarios
  async obtenerUsuarios(req, res) {
    try {
      const usuarios = await Usuario.find();
      res.status(200).json(usuarios);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener un usuario por ID
  async obtenerUsuarioPorId(req, res) {
    try {
      const usuario = await Usuario.findById(req.params.id);
      if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
      res.status(200).json(usuario);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Actualizar un usuario
  async actualizarUsuario(req, res) {
    try {
      const { id } = req.params;
      const datosActualizados = req.body;
      const usuarioActualizado = await Usuario.findByIdAndUpdate(id, datosActualizados, { new: true });
      if (!usuarioActualizado) return res.status(404).json({ error: 'Usuario no encontrado' });
      res.status(200).json(usuarioActualizado);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Eliminar un usuario
  async eliminarUsuario(req, res) {
    try {
      const { id } = req.params;
      const usuarioEliminado = await Usuario.findByIdAndDelete(id);
      if (!usuarioEliminado) return res.status(404).json({ error: 'Usuario no encontrado' });
      res.status(200).json({ mensaje: 'Usuario eliminado con éxito' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = UsuarioController;