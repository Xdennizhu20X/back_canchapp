const mongoose = require('mongoose');

// Crear el esquema de Cancha
const CanchaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  direccion: {
    type: String,
    required: true,
  },
  imagenes: {
    type: [String],
    default: [],
  },
  descripcion: {
    type: String,
    required: true,
  },
  disponible: {
    type: Boolean,
    default: true,
  },
});

// Crear el modelo de Cancha
const Cancha = mongoose.model('Cancha', CanchaSchema);

module.exports = Cancha;
