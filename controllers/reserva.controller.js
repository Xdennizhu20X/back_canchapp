const Reserva = require("../models/reserva.model");

// Crear una reserva
exports.crearReserva = async (req, res) => {
  try {
    console.log("Datos recibidos en la solicitud:", req.body); // 🔍 Log para depuración

    const { usuario, servicio, fecha, hora } = req.body;

    // Validación de datos obligatorios
    if (!usuario || !servicio || !fecha || !hora) {
      return res.status(400).json({
        mensaje: "Faltan datos obligatorios (usuario, servicio, fecha u hora).",
      });
    }

    // Crear y guardar la reserva
    const nuevaReserva = new Reserva({ usuario, servicio, fecha, hora });
    await nuevaReserva.save();

    res.status(201).json({ mensaje: "Reserva creada con éxito", reserva: nuevaReserva });
  } catch (err) {
    console.error("Error al crear reserva:", err);

    if (err.name === "ValidationError") {
      return res.status(400).json({
        mensaje: "Error de validación",
        detalles: err.errors,
      });
    }

    if (err.code === 11000) {
      return res.status(400).json({
        mensaje: "Ya existe una reserva en ese horario.",
      });
    }

    res.status(500).json({ mensaje: "Error interno del servidor", error: err.message });
  }
};

// Obtener reservas de un usuario
exports.obtenerReservas = async (req, res) => {
  try {
    const { usuarioId } = req.params;

    if (!usuarioId) {
      return res.status(400).json({ mensaje: "El ID de usuario es obligatorio." });
    }

    const reservas = await Reserva.find({ usuario: usuarioId }).populate("servicio");

    if (reservas.length === 0) {
      return res.status(404).json({ mensaje: "No se encontraron reservas para este usuario." });
    }

    res.status(200).json(reservas);
  } catch (err) {
    console.error("Error al obtener reservas:", err);
    res.status(500).json({ mensaje: "Error interno del servidor", error: err.message });
  }
};


// Obtener reservas por servicio
exports.obtenerReservasPorServicio = async (req, res) => {
  try {
    const { servicioId } = req.params;

    if (!servicioId) {
      return res.status(400).json({ mensaje: "El ID del servicio es obligatorio." });
    }

    const reservas = await Reserva.find({ servicio: servicioId }).populate("usuario");

    if (reservas.length === 0) {
      return res.status(404).json({ mensaje: "No se encontraron reservas para este servicio." });
    }

    res.status(200).json(reservas);
  } catch (err) {
    console.error("Error al obtener reservas por servicio:", err);
    res.status(500).json({ mensaje: "Error interno del servidor", error: err.message });
  }
};
