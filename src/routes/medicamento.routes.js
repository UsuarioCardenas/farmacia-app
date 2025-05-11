const express = require('express');
const medicamentoController = require('../controllers/medicamento.controller');
const { verificarToken, esAdmin, esModerador } = require('../middleware/auth.middleware');
const router = express.Router();

// Rutas para gestionar medicamentos
router.post('/', [verificarToken, esModerador], medicamentoController.crear);
router.get('/', verificarToken, medicamentoController.obtenerTodos);
router.get('/:id', verificarToken, medicamentoController.obtenerPorId);
router.put('/:id', [verificarToken, esModerador], medicamentoController.actualizar);
router.delete('/:id', [verificarToken, esAdmin], medicamentoController.eliminar);

module.exports = router;