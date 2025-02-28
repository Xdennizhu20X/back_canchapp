const Reserva = require("../models/reserva.model");
const moment = require("moment");

// Crear una reserva
exports.crearReserva = async (req, res) => {
  try {
    console.log("Datos recibidos en la solicitud:", req.body); // 🔍 Log para depuración

    const { usuario, servicio, espacio, fecha, hora } = req.body;

    // Validación de datos obligatorios
    if (!usuario || !servicio || !espacio || !fecha || !hora) {
      return res.status(400).json({
        mensaje: "Faltan datos obligatorios (usuario, servicio, fecha u hora).",
      });
    }

    // Crear y guardar la reserva
    const nuevaReserva = new Reserva({ usuario, servicio, espacio, fecha, hora });
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
    const { servicioId } = req.query; // Recibir el servicioId como un query param

    if (!usuarioId) {
      return res.status(400).json({ mensaje: "El ID de usuario es obligatorio." });
    }

    // Actualizar reservas expiradas antes de obtener la lista
    await actualizarReservasExpiradas();

    // Obtener reservas del usuario
    let reservas = await Reserva.find({ usuario: usuarioId })
      .populate("usuario", "nombre")
      .populate("servicio", "nombre");

    // Filtrar por servicioId si se proporciona
    if (servicioId) {
      reservas = reservas.filter((reserva) => reserva.servicio._id.toString() === servicioId);
    }

    if (reservas.length === 0) {
      return res.status(404).json({ mensaje: "No se encontraron reservas." });
    }

    res.status(200).json(reservas);
  } catch (err) {
    console.error("❌ Error al obtener reservas:", err);
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

    // Actualizar reservas expiradas antes de obtener la lista
    await actualizarReservasExpiradas();

    const reservas = await Reserva.find({ servicio: servicioId })
      .populate("usuario", "nombre") // Solo muestra el nombre del usuario
      .populate("servicio", "nombre"); // Solo muestra el nombre del servicio

    if (reservas.length === 0) {
      return res.status(404).json({ mensaje: "No se encontraron reservas para este servicio." });
    }

    res.status(200).json(reservas);
  } catch (err) {
    console.error("❌ Error al obtener reservas por servicio:", err);
    res.status(500).json({ mensaje: "Error interno del servidor", error: err.message });
  }
};

exports.obtenerReservasPorEspacio = async (req, res) => {
  try {
    const { espacioId } = req.params;

    if (!espacioId) {
      return res.status(400).json({ mensaje: "El ID del espacio es obligatorio." });
    }

    // Actualizar reservas expiradas antes de obtener la lista
    await actualizarReservasExpiradas();

    // Buscar reservas asociadas al espacio
    const reservas = await Reserva.find({ espacio: espacioId })
      .populate("usuario", "nombre")
      .populate("servicio", "nombre")
      .populate("espacio", "nombre"); // Asegura que se obtiene información del espacio

    if (reservas.length === 0) {
      return res.status(404).json({ mensaje: "No se encontraron reservas para este espacio." });
    }

    res.status(200).json(reservas);
  } catch (err) {
    console.error("❌ Error al obtener reservas por espacio:", err);
    res.status(500).json({ mensaje: "Error interno del servidor", error: err.message });
  }
};

// Actualizar el estado de una reserva
exports.actualizarEstadoReserva = async (req, res) => {
  try {
    const { reservaId } = req.params; // ID de la reserva desde la URL
    const { estado } = req.body; // Estado recibido desde el cliente

    // Validación: asegurarse de que el estado es válido
    const estadosPermitidos = ["Pendiente", "Confirmada", "Cancelada"];
    if (!estadosPermitidos.includes(estado)) {
      return res.status(400).json({ mensaje: "Estado no válido" });
    }

    // Buscar y actualizar la reserva
    const reservaActualizada = await Reserva.findByIdAndUpdate(
      reservaId,
      { estado },
      { new: true } // Devuelve la reserva actualizada
    );

    if (!reservaActualizada) {
      return res.status(404).json({ mensaje: "Reserva no encontrada" });
    }

    res.status(200).json({ mensaje: "Estado actualizado con éxito", reserva: reservaActualizada });
  } catch (err) {
    console.error("Error al actualizar estado de la reserva:", err);
    res.status(500).json({ mensaje: "Error interno del servidor", error: err.message });
  }
};

const actualizarReservasExpiradas = async () => {
  try {
    const hoy = moment().format("YYYY-MM-DD"); // Fecha actual en formato YYYY-MM-DD

    // Buscar reservas cuya fecha es anterior a hoy y aún no están "Terminadas"
    const reservasExpiradas = await Reserva.find({
      fecha: { $lt: hoy }, // Fecha anterior a hoy
      estado: { $ne: "Terminada" }, // Solo las que no están terminadas
    });

    if (reservasExpiradas.length > 0) {
      // Marcar las reservas expiradas como "Terminadas"
      await Reserva.updateMany(
        { _id: { $in: reservasExpiradas.map((reserva) => reserva._id) } },
        { $set: { estado: "Terminada" } }
      );
      console.log(`✅ ${reservasExpiradas.length} reservas expiradas actualizadas.`);
    }
  } catch (err) {
    console.error("❌ Error al actualizar reservas expiradas:", err);
  }
};
