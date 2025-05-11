const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Laboratorio = sequelize.define('Laboratorio', {
  CodLab: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  razonSocial: {
    type: DataTypes.STRING,
    allowNull: false
  },
  direccion: {
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true
    }
  },
  telefono: {
    type: DataTypes.STRING
  },
  contacto: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'laboratorio',
  timestamps: true
});

module.exports = Laboratorio;