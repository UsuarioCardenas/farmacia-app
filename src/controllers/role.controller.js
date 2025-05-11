const Usuario = require('../models/usuario.model');

// Obtener todos los usuarios con sus roles
exports.obtenerUsuariosConRoles = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: ['id', 'username', 'email', 'rol']
    });
    
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Cambiar el rol de un usuario
exports.cambiarRol = async (req, res) => {
  try {
    const { id } = req.params;
    const { rol } = req.body;
    
    if (!rol || !['admin', 'moderador', 'usuario'].includes(rol)) {
      return res.status(400).json({ mensaje: 'Rol no válido. Debe ser admin, moderador o usuario' });
    }
    
    const usuario = await Usuario.findByPk(id);
    
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    
    await usuario.update({ rol });
    
    res.status(200).json({
      mensaje: 'Rol actualizado exitosamente',
      usuario: {
        id: usuario.id,
        username: usuario.username,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Obtener información del usuario actual
exports.obtenerUsuarioActual = async (req, res) => {
  try {
    const usuario = {
      id: req.usuario.id,
      username: req.usuario.username,
      email: req.usuario.email,
      rol: req.usuario.rol
    };
    
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};