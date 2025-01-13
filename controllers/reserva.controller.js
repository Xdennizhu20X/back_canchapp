const Reserva = require('../models/reserva.model');

// Crear una reserva
exports.crearReserva = async (req, res) => {
  try {
    const { usuario, cancha, fecha, hora } = req.body;
    const reserva = new Reserva({ usuario, cancha, fecha, hora });
    await reserva.save();
    res.status(201).json(reserva);
  } catch (err) {
    res.status(400).json({ message: 'Error al crear reserva', error: err });
  }
};

// Obtener reservas de un usuario
exports.obtenerReservas = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const reservas = await Reserva.find({ usuario: usuarioId }).populate('cancha');
    res.status(200).json(reservas);
  } catch (err) {
    res.status(400).json({ message: 'Error al obtener reservas', error: err });
  }
};
