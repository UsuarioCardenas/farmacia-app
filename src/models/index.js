const sequelize = require('../config/db.config');
const Usuario = require('./usuario.model');
const Laboratorio = require('./laboratorio.model');
const Medicamento = require('./medicamento.model');
const OrdenCompra = require('./ordenCompra.model');
const DetalleOrdenCompra = require('./detalleOrdenCompra.model');

// Definir las relaciones
Laboratorio.hasMany(OrdenCompra, { foreignKey: 'CodLab' });
OrdenCompra.belongsTo(Laboratorio, { foreignKey: 'CodLab' });

OrdenCompra.hasMany(DetalleOrdenCompra, { foreignKey: 'NroOrdenC' });
DetalleOrdenCompra.belongsTo(OrdenCompra, { foreignKey: 'NroOrdenC' });

Medicamento.hasMany(DetalleOrdenCompra, { foreignKey: 'CodMedicamento' });
DetalleOrdenCompra.belongsTo(Medicamento, { foreignKey: 'CodMedicamento' });

// Exportar los modelos y la instancia de sequelize
module.exports = {
  sequelize,
  Usuario,
  Laboratorio,
  Medicamento,
  OrdenCompra,
  DetalleOrdenCompra
};