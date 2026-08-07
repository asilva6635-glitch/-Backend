const mongoose = require("mongoose");

const { Ticket } = require("../models");

const {
  validarDatosTicket,
} = require("../utils/ticketSecurity");


// =====================================
// GET /api/tickets
// =====================================

exports.obtenerTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      message: "Tickets obtenidos correctamente",
      data: tickets,
    });
  } catch (error) {
    console.error(
      "Error al obtener los tickets:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "No se pudieron obtener los tickets.",
    });
  }
};


// =====================================
// GET /api/tickets/:id
// =====================================

exports.obtenerTicketPorId = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message:
          "El identificador del ticket no es válido.",
      });
    }

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket no encontrado.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Ticket obtenido correctamente",
      data: ticket,
    });
  } catch (error) {
    console.error(
      "Error al obtener el ticket:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "No se pudo obtener el ticket.",
    });
  }
};


// =====================================
// POST /api/tickets
// =====================================

exports.crearTicket = async (req, res) => {
  try {
    const validacion =
      validarDatosTicket(req.body);

    if (!validacion.valido) {
      return res.status(400).json({
        success: false,
        message: validacion.errores[0],
        errors: validacion.errores,
      });
    }

    const nuevoTicket =
      await Ticket.create(
        validacion.datos
      );

    return res.status(201).json({
      success: true,
      message:
        "Ticket registrado correctamente.",
      data: nuevoTicket,
    });
  } catch (error) {
    console.error(
      "Error al crear ticket:",
      error
    );

    if (error.name === "ValidationError") {
      const errores = Object.values(
        error.errors
      ).map((item) => item.message);

      return res.status(400).json({
        success: false,
        message:
          errores[0] ||
          "Los datos del ticket no son válidos.",
        errors: errores,
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "No se pudo registrar el ticket.",
    });
  }
};


// =====================================
// PUT /api/tickets/:id
// =====================================

exports.actualizarTicket = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message:
          "El identificador del ticket no es válido.",
      });
    }

    const validacion =
      validarDatosTicket(req.body, {
        parcial: true,
      });

    if (!validacion.valido) {
      return res.status(400).json({
        success: false,
        message: validacion.errores[0],
        errors: validacion.errores,
      });
    }

    const ticketActualizado =
      await Ticket.findByIdAndUpdate(
        id,
        validacion.datos,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!ticketActualizado) {
      return res.status(404).json({
        success: false,
        message: "Ticket no encontrado.",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Ticket actualizado correctamente.",
      data: ticketActualizado,
    });
  } catch (error) {
    console.error(
      "Error al actualizar ticket:",
      error
    );

    if (error.name === "ValidationError") {
      const errores = Object.values(
        error.errors
      ).map((item) => item.message);

      return res.status(400).json({
        success: false,
        message:
          errores[0] ||
          "Los datos no son válidos.",
        errors: errores,
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "No se pudo actualizar el ticket.",
    });
  }
};


// =====================================
// DELETE /api/tickets/:id
// =====================================

exports.eliminarTicket = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message:
          "El identificador del ticket no es válido.",
      });
    }

    const ticketEliminado =
      await Ticket.findByIdAndDelete(id);

    if (!ticketEliminado) {
      return res.status(404).json({
        success: false,
        message: "Ticket no encontrado.",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Ticket eliminado correctamente.",
    });
  } catch (error) {
    console.error(
      "Error al eliminar ticket:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "No se pudo eliminar el ticket.",
    });
  }
};