const Servicio = require("../models/servicio.model");
const EspacioDeportivo = require("../models/espacio_deportivo.model");
const multer = require("multer");

// Configuración de Multer para subir imágenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Carpeta donde se guardarán las imágenes
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Agregar un servicio a un espacio deportivo con horarios incluidos
const agregarServicio = async (req, res) => {
  try {
    const { espacioId } = req.params;
    const { nombre, tipo, horarios } = req.body;
    const imagen = req.file ? `/uploads/${req.file.filename}` : null;

    // Verificar si los campos requeridos están presentes
    if (!nombre || !tipo) {
      return res.status(400).json({ mensaje: "Faltan datos obligatorios (nombre o tipo)" });
    }

    // Verificar si el espacio existe
    const espacio = await EspacioDeportivo.findById(espacioId);
    if (!espacio) {
      return res.status(404).json({ mensaje: "Espacio deportivo no encontrado" });
    }

    // Parsear horarios si es una cadena JSON
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

    // Validar la estructura de cada objeto en horarios
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

    // Crear el nuevo servicio
    const nuevoServicio = new Servicio({
      espacio: espacioId,
      nombre,
      tipo,
      imagen,
      horarios: parsedHorarios, // Usar los horarios parseados
    });
    await nuevoServicio.save();

    // Actualizar el espacio deportivo con el nuevo servicio
    espacio.servicios.push(nuevoServicio._id);
    await espacio.save();

    res.status(201).json(nuevoServicio);
    console.log('Servicio creado:', nuevoServicio);
    console.log('Datos recibidos:', req.body.horarios);

  } catch (error) {
    console.error('Error al agregar servicio:', error.stack || error); // Ver más detalles del error
    res.status(500).json({ mensaje: "Error al agregar servicio", error: error.message || error });
  }
};

// Actualizar un servicio existente
const actualizarServicio = async (req, res) => {
  try {
    const { servicioId } = req.params;
    const { nombre, tipo, horarios } = req.body;
    const imagen = req.file ? `/uploads/${req.file.filename}` : null;

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
    
    // Buscar el servicio por ID
    const servicio = await Servicio.findById(servicioId);
    if (!servicio) {
      return res.status(404).json({ mensaje: "Servicio no encontrado" });
    }

    // Devolver los horarios del servicio
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
