const mongoose = require('mongoose');

const dbURI =  'mongodb://127.0.0.1:27017/boda_milton'; // Usa la variable de entorno o la URI local por defecto

mongoose.connect(dbURI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión a la base de datos:'));
db.once('open', () => {
  console.log('¡Conexión a la base de datos establecida correctamente!');
});
