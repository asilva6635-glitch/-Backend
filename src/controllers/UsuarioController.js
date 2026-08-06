const { Usuario } = require('../models');

// GET - Obtener todos los usuarios
exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json({
      success: true,
      message: 'Usuarios obtenidos',
      data: usuarios,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuarios',
    });
  }
};

// GET - Obtener usuario por ID
exports.obtenerUsuarioPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }
    res.json({
      success: true,
      message: 'Usuario obtenido',
      data: usuario,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuario',
    });
  }
};

// POST - Crear nuevo usuario
exports.crearUsuario = async (req, res) => {
  try {
    const { nombre, email, password, rol, departamento } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos',
      });
    }

    const usuario = await Usuario.create({
      nombre,
      email,
      password,
      rol: rol || 'usuario_final',
      departamento: departamento || 'General',
      estado: 'activo',
    });

    res.status(201).json({
      success: true,
      message: 'Usuario creado',
      data: usuario,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear usuario',
    });
  }
};

// PUT - Actualizar usuario
exports.actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, rol, departamento, estado } = req.body;

    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    await usuario.update({
      nombre: nombre || usuario.nombre,
      email: email || usuario.email,
      rol: rol || usuario.rol,
      departamento: departamento || usuario.departamento,
      estado: estado || usuario.estado,
    });

    res.json({
      success: true,
      message: 'Usuario actualizado',
      data: usuario,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar usuario',
    });
  }
};

// DELETE - Eliminar usuario
exports.eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    await usuario.destroy();

    res.json({
      success: true,
      message: 'Usuario eliminado',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar usuario',
    });
  }
};

// GET - Obtener técnicos disponibles
exports.obtenerTecnicosDisponibles = async (req, res) => {
  try {
    const tecnicos = await Usuario.findAll({
      where: { rol: 'tecnico', estado: 'activo' },
    });

    res.json({
      success: true,
      message: 'Técnicos disponibles',
      data: tecnicos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener técnicos',
    });
  }
};