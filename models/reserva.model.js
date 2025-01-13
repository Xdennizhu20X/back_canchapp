const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reservaSchema = new Schema({
  usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true }, // Relación con el usuario
  cancha: { type: Schema.Types.ObjectId, ref: 'Cancha', required: true }, // Relación con la cancha
  fecha: { type: Date, required: true },
  hora: { type: String, required: true }, // Hora en formato HH:MM
  estado: { type: String, default: 'pendiente' }, // Estado de la reserva
});

const Reserva = mongoose.model('Reserva', reservaSchema);
module.exports = Reserva;
