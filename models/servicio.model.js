const mongoose = require("mongoose");

const servicioSchema = new mongoose.Schema({
  espacio: { type: mongoose.Schema.Types.ObjectId, ref: "EspacioDeportivo", required: true },
  nombre: { type: String, required: true },
  tipo: { type: String, enum: ["Cancha", "Piscina", "Ecuavoley", "Otro"], required: true },
  imagen: { type: String }, // URL de la imagen del servicio
  horarios: [
    {
      inicio: { type: String, required: true }, // "08:00"
      fin: { type: String, required: true }, // "09:00" 
      precio: { type: Number, required: true }, // Precio específico para este horario
      disponible: { type: Boolean, default: true }
    }
  ]
});

// Middleware para generar los intervalos de horarios antes de guardar
servicioSchema.pre("save", function (next) {
  let newHorarios = [];
  let inicio = this.horarios[0]?.inicio || "08:00";
  let fin = this.horarios[0]?.fin || "18:00";
  let precio = this.horarios[0]?.precio || 10; // Precio por defecto

  let [startHour, startMinute] = inicio.split(":").map(Number);
  let [endHour, endMinute] = fin.split(":").map(Number);

  while (startHour < endHour || (startHour === endHour && startMinute < endMinute)) {
    let nextHour = startHour + 1;
    if (nextHour > 23) break; // Evitar que pase de medianoche

    newHorarios.push({
      inicio: `${String(startHour).padStart(2, "0")}:${String(startMinute).padStart(2, "0")}`,
      fin: `${String(nextHour).padStart(2, "0")}:${String(startMinute).padStart(2, "0")}`,
      precio: precio,
      disponible: true
    });

    startHour = nextHour;
  }

  this.horarios = newHorarios;
  next();
});

module.exports = mongoose.model("Servicio", servicioSchema);
