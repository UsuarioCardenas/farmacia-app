const express = require('express');
const laboratorioController = require('../controllers/laboratorio.controller');
const { verificarToken, esAdmin, esModerador } = require('../middleware/auth.middleware');
const router = express.Router();

// Rutas para gestionar laboratorios
router.post('/', [verificarToken, esModerador], laboratorioController.crear);
router.get('/', verificarToken, laboratorioController.obtenerTodos);
router.get('/:id', verificarToken, laboratorioController.obtenerPorId);
router.put('/:id', [verificarToken, esModerador], laboratorioController.actualizar);
router.delete('/:id', [verificarToken, esAdmin], laboratorioController.eliminar);

module.exports = router;