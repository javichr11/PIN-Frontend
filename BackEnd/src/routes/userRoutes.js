const express = require('express');
const { registrarUsuario, obtenerUsuarios } = require('../controllers/userController');

const router = express.Router();

// Ruta para registrar un usuario
router.post('/', registrarUsuario);

// Ruta para obtener todos los usuarios
router.get('/', obtenerUsuarios);

module.exports = router;
