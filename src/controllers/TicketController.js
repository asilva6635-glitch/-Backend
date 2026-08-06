const { Ticket, Usuario } = require('../models');

// GET - Obtener todos los tickets
exports.obtenerTickets = async (req, res) => {
  try {
    const tickets = await Ticket.findAll({
      include: [{
        model: Usuario,
        as: 'usuarioReportante',
        attributes: ['id', 'nombre', 'email'],
      }],
    });

    res.json({
      success: true,
      message: 'Tickets obtenidos exitosamente',
      data: tickets,
      pagination: {
        total: tickets.length,
        pages: 1,
        currentPage: 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener tickets',
      error: error.message,
    });
  }
};

// GET - Obtener ticket por ID
exports.obtenerTicketPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findByPk(id, {
      include: [{
        model: Usuario,
        as: 'usuarioReportante',
        attributes: ['id', 'nombre', 'email'],
      }],
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket no encontrado',
      });
    }

    res.json({
      success: true,
      message: 'Ticket obtenido',
      data: ticket,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener ticket',
      error: error.message,
    });
  }
};

// POST - Crear nuevo ticket
exports.crearTicket = async (req, res) => {
  try {
    const { titulo, descripcion, categoria, usuarioReportanteId, prioridad } = req.body;

    // Validaciones
    if (!titulo || !descripcion || !usuarioReportanteId) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos',
      });
    }

    // Generar número de ticket
    const ultimoTicket = await Ticket.findOne({
      order: [['id', 'DESC']],
    });
    const numeroTicket = `TK-${String((ultimoTicket?.id || 0) + 1).padStart(5, '0')}`;

    const ticket = await Ticket.create({
      numero: numeroTicket,
      titulo,
      descripcion,
      categoria: categoria || 'general',
      usuarioReportanteId,
      prioridad: prioridad || 'media',
      estado: 'abierto',
    });

    res.status(201).json({
      success: true,
      message: 'Ticket creado exitosamente, mensaje adicional.',
      data: ticket,
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear ticket',
      error: error.message,
    });
  }
};

// PUT - Actualizar ticket
exports.actualizarTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, categoria, prioridad, estado } = req.body;

    const ticket = await Ticket.findByPk(id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket no encontrado',
      });
    }

    await ticket.update({
      titulo: titulo || ticket.titulo,
      descripcion: descripcion || ticket.descripcion,
      categoria: categoria || ticket.categoria,
      prioridad: prioridad || ticket.prioridad,
      estado: estado || ticket.estado,
    });

    res.json({
      success: true,
      message: 'Ticket actualizado',
      data: ticket,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar ticket',
      error: error.message,
    });
  }
};

// DELETE - Eliminar ticket
exports.eliminarTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findByPk(id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket no encontrado',
      });
    }

    await ticket.destroy();

    res.json({
      success: true,
      message: 'Ticket eliminado',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar ticket',
      error: error.message,
    });
  }
};

// GET - Estadísticas
exports.obtenerEstadisticas = async (req, res) => {
  try {
    const total = await Ticket.count();
    const abiertos = await Ticket.count({ where: { estado: 'abierto' } });
    const resueltos = await Ticket.count({ where: { estado: 'resuelto' } });

    res.json({
      success: true,
      message: 'Estadísticas obtenidas',
      data: {
        total,
        abiertos,
        resueltos,
        cerrados: await Ticket.count({ where: { estado: 'cerrado' } }),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
      error: error.message,
    });
  }
};