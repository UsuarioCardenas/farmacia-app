const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const Laboratorio = require('./laboratorio.model');

const Medicamento = sequelize.define('Medicamento', {
  CodMedicamento: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  descripcionMed: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fechaFabricacion: {
    type: DataTypes.DATE
  },
  fechaVencimiento: {
    type: DataTypes.DATE
  },
  Presentacion: {
    type: DataTypes.STRING
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  precioVentaUni: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  precioVentaPres: {
    type: DataTypes.DECIMAL(10, 2)
  },
  CodTipoMed: {
    type: DataTypes.STRING
  },
  Marca: {
    type: DataTypes.STRING
  },
  CodEspec: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'medicamento',
  timestamps: true
});

module.exports = Medicamento;