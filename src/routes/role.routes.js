const express = require('express');
const roleController = require('../controllers/role.controller');
const { verificarToken, esAdmin } = require('../middleware/auth.middleware');
const router = express.Router();

// Rutas para gestionar roles
router.get('/usuarios', [verificarToken, esAdmin], roleController.obtenerUsuariosConRoles);
router.put('/usuarios/:id/rol', [verificarToken, esAdmin], roleController.cambiarRol);
router.get('/perfil', verificarToken, roleController.obtenerUsuarioActual);

module.exports = router;