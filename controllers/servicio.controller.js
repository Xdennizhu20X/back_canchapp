const Servicio = require("../models/servicio.model");
const EspacioDeportivo = require("../models/espacio_deportivo.model");
const { upload } = require("../config/cloudinary");

// Agregar un servicio a un espacio deportivo con horarios incluidos
const agregarServicio = async (req, res) => {
  try {
    const { espacioId } = req.params;
    const { nombre, tipo, horarios } = req.body;
    const imagen = req.file ? req.file.path : null; // Obtener la URL de Cloudinary

    if (!nombre || !tipo) {
      return res.status(400).json({ mensaje: "Faltan datos obligatorios (nombre o tipo)" });
    }

    const espacio = await EspacioDeportivo.findById(espacioId);
    if (!espacio) {
      return res.status(404).json({ mensaje: "Espacio deportivo no encontrado" });
    }
    
    let parsedHorarios = [];
    if (typeof horarios === 'string') {
      try {
        parsedHorarios = JSON.parse(horarios);
      } catch (error) {
        return res.status(400).json({ mensaje: "Formato de horarios inválido", error: error.message });
      }
    } else if (Array.isArray(horarios)) {
      parsedHorarios = horarios;
    } else {
      return res.status(400).json({ mensaje: "Horarios debe ser un arreglo de objetos o un JSON válido" });
    }

    for (const horario of parsedHorarios) {
      if (
        typeof horario.inicio !== 'string' ||
        typeof horario.fin !== 'string' ||
        typeof horario.precio !== 'number' ||
        typeof horario.disponible !== 'boolean'
      ) {
        return res.status(400).json({ mensaje: "Estructura de horarios inválida" });
      }
    }

    const nuevoServicio = new Servicio({
      espacio: espacioId,
      nombre,
      tipo,
      imagen,
      horarios: parsedHorarios,
    });
    await nuevoServicio.save();

    espacio.servicios.push(nuevoServicio._id);
    await espacio.save();

    res.status(201).json(nuevoServicio);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al agregar servicio", error: error.message || error });
  }
};

// Actualizar un servicio existente
const actualizarServicio = async (req, res) => {
  try {
    const { servicioId } = req.params;
    const { nombre, tipo, horarios } = req.body;
    const imagen = req.file ? req.file.path : null;

    const servicio = await Servicio.findById(servicioId);
    if (!servicio) {
      return res.status(404).json({ mensaje: "Servicio no encontrado" });
    }

    if (nombre) servicio.nombre = nombre;
    if (tipo) servicio.tipo = tipo;
    if (horarios) servicio.horarios = horarios;
    if (imagen) servicio.imagen = imagen;

    await servicio.save();
    res.json(servicio);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar servicio", error });
  }
};

// Obtener todos los servicios de un espacio deportivo
const obtenerServiciosDeEspacio = async (req, res) => {
  try {
    const { espacioId } = req.params;
    const servicios = await Servicio.find({ espacio: espacioId });
    res.json(servicios);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener los servicios", error });
  }
};

// Obtener los horarios de un servicio específico
const obtenerHorariosDeServicio = async (req, res) => {
  try {
    const { servicioId } = req.params;
    const servicio = await Servicio.findById(servicioId);
    if (!servicio) {
      return res.status(404).json({ mensaje: "Servicio no encontrado" });
    }
    res.json(servicio.horarios);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener los horarios del servicio", error: error.message });
  }
};

module.exports = { 
  agregarServicio: [upload.single("imagen"), agregarServicio], 
  actualizarServicio: [upload.single("imagen"), actualizarServicio],
  obtenerServiciosDeEspacio,
  obtenerHorariosDeServicio
};
