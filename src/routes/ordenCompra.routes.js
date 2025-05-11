const express = require('express');
const ordenCompraController = require('../controllers/ordenCompra.controller');
const { verificarToken, esAdmin, esModerador } = require('../middleware/auth.middleware');
const router = express.Router();

// Rutas para gestionar órdenes de compra
router.post('/', [verificarToken, esModerador], ordenCompraController.crear);
router.get('/', verificarToken, ordenCompraController.obtenerTodas);
router.get('/:id', verificarToken, ordenCompraController.obtenerPorId);
router.put('/:id', [verificarToken, esModerador], ordenCompraController.actualizar);
router.delete('/:id', [verificarToken, esAdmin], ordenCompraController.eliminar);

module.exports = router;