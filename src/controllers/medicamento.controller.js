const { Medicamento } = require('../models');

// Crear un nuevo medicamento
exports.crear = async (req, res) => {
  try {
    const nuevoMedicamento = await Medicamento.create(req.body);
    res.status(201).json(nuevoMedicamento);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Obtener todos los medicamentos
exports.obtenerTodos = async (req, res) => {
  try {
    const medicamentos = await Medicamento.findAll();
    res.status(200).json(medicamentos);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Obtener un medicamento por su código
exports.obtenerPorId = async (req, res) => {
  try {
    const medicamento = await Medicamento.findByPk(req.params.id);
    
    if (!medicamento) {
      return res.status(404).json({ mensaje: 'Medicamento no encontrado' });
    }
    
    res.status(200).json(medicamento);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Actualizar un medicamento
exports.actualizar = async (req, res) => {
  try {
    const medicamento = await Medicamento.findByPk(req.params.id);
    
    if (!medicamento) {
      return res.status(404).json({ mensaje: 'Medicamento no encontrado' });
    }
    
    await medicamento.update(req.body);
    res.status(200).json(medicamento);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Eliminar un medicamento
exports.eliminar = async (req, res) => {
  try {
    const medicamento = await Medicamento.findByPk(req.params.id);
    
    if (!medicamento) {
      return res.status(404).json({ mensaje: 'Medicamento no encontrado' });
    }
    
    await medicamento.destroy();
    res.status(200).json({ mensaje: 'Medicamento eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};