const mongoose = require("mongoose");

const reservaSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
  servicio: { type: mongoose.Schema.Types.ObjectId, ref: "Servicio", required: true },
  fecha: { type: String, required: true }, // "YYYY-MM-DD"
  hora: { type: String, required: true }, // "HH:mm"
  estado: { type: String, enum: ["Pendiente", "Confirmada", "Cancelada"], default: "Pendiente" },
});

// Evita reservas duplicadas para el mismo servicio, fecha y hora
reservaSchema.index({ servicio: 1, fecha: 1, hora: 1 }, { unique: true });

// Validación antes de guardar la reserva
reservaSchema.pre("validate", async function (next) {
  try {
    const Servicio = mongoose.model("Servicio");
    const servicio = await Servicio.findById(this.servicio);

    if (!servicio) {
      return next(new Error("El servicio seleccionado no existe."));
    }

    // Verificar si la hora de la reserva está dentro de los horarios permitidos
    const horarioValido = servicio.horarios.some(horario => {
      return this.hora >= horario.inicio && this.hora < horario.fin;
    });

    if (!horarioValido) {
      return next(new Error("La hora seleccionada no está dentro de los horarios disponibles del servicio."));
    }

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Reserva", reservaSchema);
