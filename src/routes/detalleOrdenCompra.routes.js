const express = require('express');
const detalleOrdenCompraController = require('../controllers/detalleOrdenCompra.controller');
const { verificarToken, esModerador } = require('../middleware/auth.middleware');
const router = express.Router();

// Rutas para gestionar detalles de órdenes de compra
router.get('/orden/:nroOrdenC', verificarToken, detalleOrdenCompraController.obtenerPorOrdenCompra);
router.get('/:nroOrdenC/:codMedicamento', verificarToken, detalleOrdenCompraController.obtenerPorId);
router.put('/:nroOrdenC/:codMedicamento', [verificarToken, esModerador], detalleOrdenCompraController.actualizar);
router.delete('/:nroOrdenC/:codMedicamento', [verificarToken, esModerador], detalleOrdenCompraController.eliminar);

module.exports = router;