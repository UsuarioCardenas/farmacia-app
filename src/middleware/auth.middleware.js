const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario.model');
require('dotenv').config();

const verificarToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(403).json({ mensaje: 'No se proporcionó token de autenticación' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findByPk(decoded.id);

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'Token no válido o expirado' });
  }
};

const esAdmin = async (req, res, next) => {
  try {
    if (req.usuario.rol !== 'admin') {
      return res.status(403).json({ mensaje: 'Requiere rol de Administrador' });
    }
    next();
  } catch (error) {
    return res.status(500).json({ mensaje: error.message });
  }
};

const esModerador = async (req, res, next) => {
  try {
    if (req.usuario.rol !== 'moderador' && req.usuario.rol !== 'admin') {
      return res.status(403).json({ mensaje: 'Requiere rol de Moderador o Administrador' });
    }
    next();
  } catch (error) {
    return res.status(500).json({ mensaje: error.message });
  }
};

module.exports = {
  verificarToken,
  esAdmin,
  esModerador
};