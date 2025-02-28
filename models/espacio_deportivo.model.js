const mongoose = require("mongoose");

const EspacioDeportivoSchema = new mongoose.Schema({
  nombre: String,
  ubicacion: String, // Antes 'direccion'
  descripcion: String,
  imagen: String, // Nuevo campo para la imagen
  propietario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" }, // Referencia a un usuario
  servicios: [{ type: mongoose.Schema.Types.ObjectId, ref: "Servicio" }]
});

module.exports = mongoose.model("EspacioDeportivo", EspacioDeportivoSchema);
