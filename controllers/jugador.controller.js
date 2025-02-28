const Jugador = require('../models/jugador.model');
const Usuario = require('../models/usuario.model'); // Asegúrate de tener el modelo de Usuario

// Crear un nuevo jugador asociado a un usuario
exports.crearJugador = async (req, res) => {
  try {
    const { usuario, ...datosJugador } = req.body;

    // Verificar si el usuario existe
    const usuarioExiste = await Usuario.findById(usuario);
    if (!usuarioExiste) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const nuevoJugador = new Jugador({ usuario, ...datosJugador });
    await nuevoJugador.save();
    res.status(201).json({ mensaje: 'Jugador creado exitosamente', jugador: nuevoJugador });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear jugador', error });
  }
};

// Obtener todos los jugadores con los datos del usuario
exports.obtenerJugadores = async (req, res) => {
  try {
    const jugadores = await Jugador.find().populate('usuario', 'nombre'); // Poblar solo el nombre del usuario
    res.json(jugadores);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener jugadores', error });
  }
};

// Obtener un jugador por ID con los datos del usuario
exports.obtenerJugadorPorId = async (req, res) => {
  try {
    const jugador = await Jugador.findById(req.params.id).populate('usuario', 'nombre email');
    if (!jugador) {
      return res.status(404).json({ mensaje: 'Jugador no encontrado' });
    }
    res.json(jugador);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el jugador', error });
  }
};

// Actualizar un jugador
exports.actualizarJugador = async (req, res) => {
  try {
    const { usuario, ...datosJugador } = req.body;

    if (usuario) {
      const usuarioExiste = await Usuario.findById(usuario);
      if (!usuarioExiste) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
      }
    }

    const jugadorActualizado = await Jugador.findByIdAndUpdate(req.params.id, { usuario, ...datosJugador }, { new: true });
    if (!jugadorActualizado) {
      return res.status(404).json({ mensaje: 'Jugador no encontrado' });
    }
    res.json({ mensaje: 'Jugador actualizado exitosamente', jugador: jugadorActualizado });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar jugador', error });
  }
};

// Eliminar un jugador
exports.eliminarJugador = async (req, res) => {
  try {
    const jugadorEliminado = await Jugador.findByIdAndDelete(req.params.id);
    if (!jugadorEliminado) {
      return res.status(404).json({ mensaje: 'Jugador no encontrado' });
    }
    res.json({ mensaje: 'Jugador eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar jugador', error });
  }

// Obtener un jugador por el ID de usuario (con todos los datos del jugador)


};

exports.obtenerJugadorPorUsuarioId = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    if (!usuarioId) {
      return res.status(400).json({ mensaje: 'El parámetro usuarioId es obligatorio' });
    }

    // Verificar que el usuarioId tiene un formato válido (puedes ajustarlo según tu esquema)
    if (!usuarioId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ mensaje: 'El ID de usuario no es válido' });
    }

    console.log(`Consultando jugador con usuarioId: ${usuarioId}`); // Para depuración

    // Intentar encontrar al jugador por usuarioId
    const jugador = await Jugador.findOne({ usuario: usuarioId }).populate('usuario');

    if (!jugador) {
      return res.status(404).json({ mensaje: 'Jugador no encontrado para este usuario' });
    }

    res.json(jugador); // Devolver los datos del jugador con los datos del usuario poblados
  } catch (error) {
    console.error('Error al obtener el jugador:', error); // Registro detallado del error
    res.status(500).json({
      mensaje: 'Error al obtener el jugador por ID de usuario',
      error: error.message || error, // Proporciona un mensaje de error claro
    });
  }
};
