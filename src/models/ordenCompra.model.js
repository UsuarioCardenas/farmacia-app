const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const Laboratorio = require('./laboratorio.model');

const OrdenCompra = sequelize.define('OrdenCompra', {
  NroOrdenC: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  fechaEmision: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  Situacion: {
    type: DataTypes.ENUM('Pendiente', 'Completada', 'Cancelada'),
    defaultValue: 'Pendiente'
  },
  NroFacturaProv: {
    type: DataTypes.STRING
  },
  CodLab: {
    type: DataTypes.STRING,
    references: {
      model: Laboratorio,
      key: 'CodLab'
    }
  }
}, {
  tableName: 'ordencompra',
  timestamps: true
});

// Establecer la relación con Laboratorio
OrdenCompra.belongsTo(Laboratorio, { foreignKey: 'CodLab' });

module.exports = OrdenCompra;