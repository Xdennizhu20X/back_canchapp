// Importar mongoose
const mongoose = require('mongoose');

// Crear el esquema de Usuario
const UsuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  fechaRegistro: {
    type: Date,
    default: Date.now,
  },
  calificacion: {
    type: Number,
    default: 0,
  },
  estadisticas: {
    partidosJugados: {
      type: Number,
      default: 0,
    },
    partidosGanados: {
      type: Number,
      default: 0,
    },
  },
});

// Crear el modelo de Usuario
const Usuario = mongoose.model('Usuario', UsuarioSchema);

module.exports = Usuario;
