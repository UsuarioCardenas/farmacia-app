const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario.model');
require('dotenv').config();

exports.registrar = async (req, res) => {
  try {
    const { username, email, password, rol } = req.body;

    // Verificar si el usuario ya existe por username
    const usuarioPorUsername = await Usuario.findOne({ where: { username } });
    if (usuarioPorUsername) {
      return res.status(400).json({ mensaje: 'El nombre de usuario ya está registrado' });
    }

    // Verificar si el usuario ya existe por email
    const usuarioPorEmail = await Usuario.findOne({ where: { email } });
    if (usuarioPorEmail) {
      return res.status(400).json({ mensaje: 'El email ya está registrado' });
    }

    // Crear nuevo usuario
    const nuevoUsuario = await Usuario.create({
      username,
      email,
      password,
      rol: rol || 'usuario'
    });

    res.status(201).json({ 
      mensaje: 'Usuario registrado exitosamente',
      usuario: {
        id: nuevoUsuario.id,
        username: nuevoUsuario.username,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol
      }
    });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

exports.iniciarSesion = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Buscar usuario
    const usuario = await Usuario.findOne({ where: { username } });

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Verificar contraseña
    const passwordValida = await usuario.validarPassword(password);

    if (!passwordValida) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    res.status(200).json({
      id: usuario.id,
      username: usuario.username,
      email: usuario.email,
      rol: usuario.rol,
      accessToken: token
    });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};