const Cancha = require('../models/cancha.model');

const CanchaController = {
  // Crear una nueva cancha
  async crearCancha(req, res) {
    try {
      const { nombre, direccion, imagenes, descripcion } = req.body;
      const nuevaCancha = new Cancha({ nombre, direccion, imagenes, descripcion });
      const canchaGuardada = await nuevaCancha.save();
      res.status(201).json(canchaGuardada);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Obtener todas las canchas
  async obtenerCanchas(req, res) {
    try {
      const canchas = await Cancha.find();
      res.status(200).json(canchas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener una cancha por ID
  async obtenerCanchaPorId(req, res) {
    try {
      const cancha = await Cancha.findById(req.params.id);
      if (!cancha) return res.status(404).json({ error: 'Cancha no encontrada' });
      res.status(200).json(cancha);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Actualizar una cancha
  async actualizarCancha(req, res) {
    try {
      const { id } = req.params;
      const datosActualizados = req.body;
      const canchaActualizada = await Cancha.findByIdAndUpdate(id, datosActualizados, { new: true });
      if (!canchaActualizada) return res.status(404).json({ error: 'Cancha no encontrada' });
      res.status(200).json(canchaActualizada);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Eliminar una cancha
  async eliminarCancha(req, res) {
    try {
      const { id } = req.params;
      const canchaEliminada = await Cancha.findByIdAndDelete(id);
      if (!canchaEliminada) return res.status(404).json({ error: 'Cancha no encontrada' });
      res.status(200).json({ mensaje: 'Cancha eliminada con éxito' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = CanchaController;