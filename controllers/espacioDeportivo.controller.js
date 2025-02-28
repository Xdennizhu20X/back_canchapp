const EspacioDeportivo = require("../models/espacio_deportivo.model");
const { upload } = require("../config/cloudinary");

// Crear un espacio deportivo (un usuario solo puede tener uno)
const crearEspacioDeportivo = async (req, res) => {
  try {
    const { nombre, ubicacion, propietario, descripcion } = req.body;
    const imagen = req.file ? req.file.path : null; // Obtener la URL de Cloudinary

    // Verificar si el usuario ya tiene un espacio deportivo
    const existe = await EspacioDeportivo.findOne({ propietario });
    if (existe) {
      return res.status(400).json({ mensaje: "Ya tienes un espacio deportivo registrado." });
    }

    const nuevoEspacio = new EspacioDeportivo({ 
      nombre, 
      ubicacion, 
      propietario, 
      descripcion, 
      imagen 
    });

    await nuevoEspacio.save();
    res.status(201).json(nuevoEspacio);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear el espacio deportivo", error });
  }
};

// Editar un espacio deportivo
const editarEspacioDeportivo = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, ubicacion, descripcion } = req.body;
    const imagen = req.file ? req.file.path : null;

    const espacio = await EspacioDeportivo.findById(id);
    if (!espacio) {
      return res.status(404).json({ mensaje: "Espacio deportivo no encontrado" });
    }

    if (nombre) espacio.nombre = nombre;
    if (ubicacion) espacio.ubicacion = ubicacion;
    if (descripcion) espacio.descripcion = descripcion;
    if (imagen) espacio.imagen = imagen; // Actualizar imagen con URL de Cloudinary

    await espacio.save();
    res.json(espacio);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al editar el espacio deportivo", error });
  }
};

// Obtener todos los espacios deportivos con sus servicios y propietario
const obtenerEspaciosDeportivos = async (req, res) => {
  try {
    const espacios = await EspacioDeportivo.find()
      .populate("propietario", "nombre email")
      .populate("servicios");

    res.json(espacios);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener los espacios deportivos", error });
  }
};

// Obtener espacios deportivos por ID del propietario
const obtenerEspaciosPorPropietario = async (req, res) => {
  try {
    const { propietarioId } = req.params;

    const espacios = await EspacioDeportivo.find({ propietario: propietarioId })
      .populate("propietario", "nombre email")
      .populate("servicios");

    if (espacios.length === 0) {
      return res.status(404).json({ mensaje: "No se encontraron espacios deportivos para este propietario" });
    }

    res.json(espacios);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener los espacios deportivos", error });
  }
};

module.exports = { 
  crearEspacioDeportivo: [upload.single("imagen"), crearEspacioDeportivo], 
  editarEspacioDeportivo: [upload.single("imagen"), editarEspacioDeportivo], 
  obtenerEspaciosDeportivos,
  obtenerEspaciosPorPropietario
};
