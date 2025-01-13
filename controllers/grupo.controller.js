const Grupo = require('../models/grupo.model');

// Crear un grupo
exports.crearGrupo = async (req, res) => {
  try {
    const { nombre, descripcion, integrantes } = req.body;
    const grupo = new Grupo({ nombre, descripcion, integrantes });
    await grupo.save();
    res.status(201).json(grupo);
  } catch (err) {
    res.status(400).json({ message: 'Error al crear grupo', error: err });
  }
};

// Obtener todos los grupos
exports.obtenerGrupos = async (req, res) => {
  try {
    const grupos = await Grupo.find().populate('integrantes');
    res.status(200).json(grupos);
  } catch (err) {
    res.status(400).json({ message: 'Error al obtener grupos', error: err });
  }
};

// Invitar a un usuario al grupo
exports.invitarUsuario = async (req, res) => {
  try {
    const { grupoId, usuarioId } = req.body;
    const grupo = await Grupo.findById(grupoId);
    grupo.integrantes.push(usuarioId);
    await grupo.save();
    res.status(200).json(grupo);
  } catch (err) {
    res.status(400).json({ message: 'Error al invitar usuario', error: err });
  }
};
