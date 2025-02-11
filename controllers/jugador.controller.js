const Jugador = require('../models/jugador.model');

// Crear un nuevo jugador
exports.crearJugador = async (req, res) => {
  try {
    const nuevoJugador = new Jugador(req.body);
    await nuevoJugador.save();
    res.status(201).json({ mensaje: 'Jugador creado exitosamente', jugador: nuevoJugador });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear jugador', error });
  }
};

// Obtener todos los jugadores
exports.obtenerJugadores = async (req, res) => {
  try {
    const jugadores = await Jugador.find();
    res.json(jugadores);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener jugadores', error });
  }
};

// Obtener un jugador por ID
exports.obtenerJugadorPorId = async (req, res) => {
  try {
    const jugador = await Jugador.findById(req.params.id);
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
    const jugadorActualizado = await Jugador.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
};
