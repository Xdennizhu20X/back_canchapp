const mongoose = require('mongoose');

const JugadorSchema = new mongoose.Schema({
  posicion: { type: String, enum: ['Portero', 'Jugador'], required: true },
  estatura: { type: Number, required: true },
  edad: { type: Number, required: true },
  atributos: {
    Tiro: { type: Number, min: 1, max: 10, default: 5 },
    Regate: { type: Number, min: 1, max: 10, default: 5 },
    Pase: { type: Number, min: 1, max: 10, default: 5 },
    Ritmo: { type: Number, min: 1, max: 10, default: 5 },
    Defensa: { type: Number, min: 1, max: 10, default: 5 },
    Físico: { type: Number, min: 1, max: 10, default: 5 },  
    Reflejos: { type: Number, min: 1, max: 10, default: 5 }
  }
});

const Jugador = mongoose.model('Jugador', JugadorSchema);
module.exports = Jugador;
