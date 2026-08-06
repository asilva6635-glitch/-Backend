const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/UsuarioController');

// Rutas de usuarios
router.get('/', usuarioController.obtenerUsuarios);
router.get('/tecnicos/disponibles', usuarioController.obtenerTecnicosDisponibles);
router.get('/:id', usuarioController.obtenerUsuarioPorId);
router.post('/', usuarioController.crearUsuario);
router.put('/:id', usuarioController.actualizarUsuario);
router.delete('/:id', usuarioController.eliminarUsuario);

module.exports = router;