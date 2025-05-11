const { DetalleOrdenCompra, Medicamento } = require('../models');

// Obtener todos los detalles de una orden de compra
exports.obtenerPorOrdenCompra = async (req, res) => {
  try {
    const detalles = await DetalleOrdenCompra.findAll({
      where: { NroOrdenC: req.params.nroOrdenC },
      include: [
        {
          model: Medicamento,
          attributes: ['CodMedicamento', 'descripcionMed', 'Presentacion', 'Marca']
        }
      ]
    });
    
    res.status(200).json(detalles);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Obtener un detalle específico
exports.obtenerPorId = async (req, res) => {
  try {
    const { nroOrdenC, codMedicamento } = req.params;
    
    const detalle = await DetalleOrdenCompra.findOne({
      where: {
        NroOrdenC: nroOrdenC,
        CodMedicamento: codMedicamento
      },
      include: [
        {
          model: Medicamento,
          attributes: ['CodMedicamento', 'descripcionMed', 'Presentacion', 'Marca']
        }
      ]
    });
    
    if (!detalle) {
      return res.status(404).json({ mensaje: 'Detalle de orden de compra no encontrado' });
    }
    
    res.status(200).json(detalle);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Actualizar un detalle específico
exports.actualizar = async (req, res) => {
  try {
    const { nroOrdenC, codMedicamento } = req.params;
    
    const detalle = await DetalleOrdenCompra.findOne({
      where: {
        NroOrdenC: nroOrdenC,
        CodMedicamento: codMedicamento
      }
    });
    
    if (!detalle) {
      return res.status(404).json({ mensaje: 'Detalle de orden de compra no encontrado' });
    }
    
    await detalle.update(req.body);
    res.status(200).json(detalle);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Eliminar un detalle específico
exports.eliminar = async (req, res) => {
  try {
    const { nroOrdenC, codMedicamento } = req.params;
    
    const detalle = await DetalleOrdenCompra.findOne({
      where: {
        NroOrdenC: nroOrdenC,
        CodMedicamento: codMedicamento
      }
    });
    
    if (!detalle) {
      return res.status(404).json({ mensaje: 'Detalle de orden de compra no encontrado' });
    }
    
    await detalle.destroy();
    res.status(200).json({ mensaje: 'Detalle de orden de compra eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};