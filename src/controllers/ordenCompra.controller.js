const { OrdenCompra, DetalleOrdenCompra, Medicamento, Laboratorio } = require('../models');
const sequelize = require('../config/db.config');

// Crear una nueva orden de compra con sus detalles
exports.crear = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { ordenCompra, detalles } = req.body;
    
    // Crear la orden de compra
    const nuevaOrdenCompra = await OrdenCompra.create(ordenCompra, { transaction: t });
    
    // Crear los detalles de la orden
    if (detalles && detalles.length > 0) {
      for (const detalle of detalles) {
        detalle.NroOrdenC = nuevaOrdenCompra.NroOrdenC;
        await DetalleOrdenCompra.create(detalle, { transaction: t });
      }
    }
    
    await t.commit();
    
    res.status(201).json({
      mensaje: 'Orden de compra creada exitosamente',
      ordenCompra: nuevaOrdenCompra
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ mensaje: error.message });
  }
};

// Obtener todas las órdenes de compra
exports.obtenerTodas = async (req, res) => {
  try {
    const ordenesCompra = await OrdenCompra.findAll({
      include: [
        {
          model: Laboratorio,
          attributes: ['CodLab', 'razonSocial']
        }
      ]
    });
    
    res.status(200).json(ordenesCompra);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Obtener una orden de compra por su número
exports.obtenerPorId = async (req, res) => {
  try {
    const ordenCompra = await OrdenCompra.findByPk(req.params.id, {
      include: [
        {
          model: Laboratorio,
          attributes: ['CodLab', 'razonSocial']
        },
        {
          model: DetalleOrdenCompra,
          include: [
            {
              model: Medicamento,
              attributes: ['CodMedicamento', 'descripcionMed', 'Presentacion', 'Marca']
            }
          ]
        }
      ]
    });
    
    if (!ordenCompra) {
      return res.status(404).json({ mensaje: 'Orden de compra no encontrada' });
    }
    
    res.status(200).json(ordenCompra);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Actualizar una orden de compra
exports.actualizar = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { ordenCompra, detalles } = req.body;
    const ordenCompraExistente = await OrdenCompra.findByPk(req.params.id);
    
    if (!ordenCompraExistente) {
      await t.rollback();
      return res.status(404).json({ mensaje: 'Orden de compra no encontrada' });
    }
    
    // Actualizar la orden de compra
    await ordenCompraExistente.update(ordenCompra, { transaction: t });
    
    // Si hay detalles, actualizar o crear nuevos
    if (detalles && detalles.length > 0) {
      // Eliminar detalles existentes
      await DetalleOrdenCompra.destroy({
        where: { NroOrdenC: req.params.id },
        transaction: t
      });
      
      // Crear los nuevos detalles
      for (const detalle of detalles) {
        detalle.NroOrdenC = req.params.id;
        await DetalleOrdenCompra.create(detalle, { transaction: t });
      }
    }
    
    await t.commit();
    
    res.status(200).json({
      mensaje: 'Orden de compra actualizada exitosamente',
      ordenCompra: ordenCompraExistente
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ mensaje: error.message });
  }
};

// Eliminar una orden de compra
exports.eliminar = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const ordenCompra = await OrdenCompra.findByPk(req.params.id);
    
    if (!ordenCompra) {
      await t.rollback();
      return res.status(404).json({ mensaje: 'Orden de compra no encontrada' });
    }
    
    // Eliminar los detalles asociados
    await DetalleOrdenCompra.destroy({
      where: { NroOrdenC: req.params.id },
      transaction: t
    });
    
    // Eliminar la orden de compra
    await ordenCompra.destroy({ transaction: t });
    
    await t.commit();
    
    res.status(200).json({ mensaje: 'Orden de compra eliminada correctamente' });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ mensaje: error.message });
  }
};