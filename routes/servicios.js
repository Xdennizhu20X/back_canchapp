const express = require("express");
const router = express.Router();
const { 
  agregarServicio, 
  actualizarServicio, 
  obtenerServiciosDeEspacio, 
  obtenerHorariosDeServicio
} = require("../controllers/servicio.controller");

// Ruta para agregar un servicio a un espacio deportivo (incluyendo horarios)
router.post("/:espacioId", agregarServicio);

// Ruta para actualizar un servicio (incluyendo horarios y otros datos)
router.put("/:servicioId", actualizarServicio);

// Ruta para obtener todos los servicios de un espacio deportivo
router.get("/:espacioId", obtenerServiciosDeEspacio);
router.get("/:servicioId/horarios", obtenerHorariosDeServicio);

module.exports = router;
