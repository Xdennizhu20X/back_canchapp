const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const grupoSchema = new Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  integrantes: [{ type: Schema.Types.ObjectId, ref: 'Usuario' }], // Relación con usuarios
  fechaCreacion: { type: Date, default: Date.now },
});

const Grupo = mongoose.model('Grupo', grupoSchema);
module.exports = Grupo;
