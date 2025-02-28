const express = require("express");
const { 
  crearEspacioDeportivo, 
  editarEspacioDeportivo, 
  obtenerEspaciosDeportivos,
  obtenerEspaciosPorPropietario, 

} = require("../controllers/espacioDeportivo.controller");

const router = express.Router();

// Crear un espacio deportivo con imagen
router.post("/espacio-deportivo", crearEspacioDeportivo);

// Editar un espacio deportivo
router.put("/espacio-deportivo/:id", editarEspacioDeportivo);

// Obtener todos los espacios deportivos
router.get("/espacios-deportivos", obtenerEspaciosDeportivos);

router.get("/espacios-deportivos/:propietarioId", obtenerEspaciosPorPropietario); // Nueva ruta
  
module.exports = router;
