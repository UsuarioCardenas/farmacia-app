const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const OrdenCompra = require('./ordenCompra.model');
const Medicamento = require('./medicamento.model');

const DetalleOrdenCompra = sequelize.define('DetalleOrdenCompra', {
  NroOrdenC: {
    type: DataTypes.STRING,
    primaryKey: true,
    references: {
      model: OrdenCompra,
      key: 'NroOrdenC'
    }
  },
  CodMedicamento: {
    type: DataTypes.STRING,
    primaryKey: true,
    references: {
      model: Medicamento,
      key: 'CodMedicamento'
    }
  },
  descripcion: {
    type: DataTypes.STRING
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'detalleordencompra',
  timestamps: true
});

// Establecer las relaciones
DetalleOrdenCompra.belongsTo(OrdenCompra, { foreignKey: 'NroOrdenC' });
DetalleOrdenCompra.belongsTo(Medicamento, { foreignKey: 'CodMedicamento' });

module.exports = DetalleOrdenCompra;