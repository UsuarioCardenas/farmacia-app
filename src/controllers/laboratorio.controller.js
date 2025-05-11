const { Laboratorio } = require('../models');

// Crear un nuevo laboratorio
exports.crear = async (req, res) => {
  try {
    const nuevoLaboratorio = await Laboratorio.create(req.body);
    res.status(201).json(nuevoLaboratorio);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Obtener todos los laboratorios
exports.obtenerTodos = async (req, res) => {
  try {
    const laboratorios = await Laboratorio.findAll();
    res.status(200).json(laboratorios);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Obtener un laboratorio por su código
exports.obtenerPorId = async (req, res) => {
  try {
    const laboratorio = await Laboratorio.findByPk(req.params.id);
    
    if (!laboratorio) {
      return res.status(404).json({ mensaje: 'Laboratorio no encontrado' });
    }
    
    res.status(200).json(laboratorio);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Actualizar un laboratorio
exports.actualizar = async (req, res) => {
  try {
    const laboratorio = await Laboratorio.findByPk(req.params.id);
    
    if (!laboratorio) {
      return res.status(404).json({ mensaje: 'Laboratorio no encontrado' });
    }
    
    await laboratorio.update(req.body);
    res.status(200).json(laboratorio);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Eliminar un laboratorio
exports.eliminar = async (req, res) => {
  try {
    const laboratorio = await Laboratorio.findByPk(req.params.id);
    
    if (!laboratorio) {
      return res.status(404).json({ mensaje: 'Laboratorio no encontrado' });
    }
    
    await laboratorio.destroy();
    res.status(200).json({ mensaje: 'Laboratorio eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};