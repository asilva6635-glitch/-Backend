const mongoose = require("mongoose");

const { Ticket } = require("../models");

const {
  validarDatosTicket,
} = require("../utils/ticketSecurity");


// =====================================================
// FUNCIÓN AUXILIAR PARA ERRORES DE MONGOOSE / MONGODB
// =====================================================

const manejarErrorMongo = (error, res, mensajeGeneral) => {
  console.error("==========================================");
  console.error("❌ ERROR MONGODB / MONGOOSE");
  console.error("Nombre:", error.name);
  console.error("Mensaje:", error.message);
  console.error("Código:", error.code);
  console.error("==========================================");

  // Error de validación de Mongoose
  if (error.name === "ValidationError") {
    const errores = Object.values(error.errors || {}).map(
      (item) => item.message
    );

    return res.status(400).json({
      success: false,
      message:
        errores[0] ||
        "Los datos ingresados no son válidos.",
      errors: errores,
    });
  }

  // ID de MongoDB inválido
  if (error.name === "CastError") {
    return res.status(400).json({
      success: false,
      message:
        "El identificador proporcionado no es válido.",
    });
  }

  // Clave duplicada
  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message:
        "Ya existe un registro con esos datos.",
    });
  }

  // Falta de permisos en MongoDB
  if (
    error.code === 13 ||
    String(error.message)
      .toLowerCase()
      .includes("not authorized") ||
    String(error.message)
      .toLowerCase()
      .includes("unauthorized")
  ) {
    return res.status(500).json({
      success: false,
      message:
        "MongoDB Atlas no tiene permisos para realizar esta operación.",
    });
  }

  return res.status(500).json({
    success: false,
    message: mensajeGeneral,
  });
};


// =====================================================
// GET /api/tickets
// Obtener todos los tickets
// =====================================================

exports.obtenerTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      message:
        "Tickets obtenidos correctamente.",
      data: tickets,
    });

  } catch (error) {
    return manejarErrorMongo(
      error,
      res,
      "No se pudieron obtener los tickets."
    );
  }
};


// =====================================================
// GET /api/tickets/:id
// Obtener un ticket por ID
// =====================================================

exports.obtenerTicketPorId = async (req, res) => {
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
        message:
          "Ticket no encontrado.",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Ticket obtenido correctamente.",
      data: ticket,
    });

  } catch (error) {
    return manejarErrorMongo(
      error,
      res,
      "No se pudo obtener el ticket."
    );
  }
};


// =====================================================
// POST /api/tickets
// Crear ticket
// =====================================================

exports.crearTicket = async (req, res) => {
  try {
    console.log("");
    console.log("📥 NUEVA SOLICITUD PARA CREAR TICKET");
    console.log("Datos recibidos:", req.body);

    const validacion =
      validarDatosTicket(req.body);

    if (!validacion.valido) {
      console.log(
        "⚠️ Error de validación:",
        validacion.errores
      );

      return res.status(400).json({
        success: false,
        message:
          validacion.errores[0] ||
          "Los datos ingresados no son válidos.",
        errors: validacion.errores,
      });
    }

    console.log(
      "✅ Datos validados:",
      validacion.datos
    );

    const nuevoTicket = new Ticket({
      titulo: validacion.datos.titulo,
      descripcion:
        validacion.datos.descripcion,
      categoria:
        validacion.datos.categoria,
      prioridad:
        validacion.datos.prioridad,
      estado:
        validacion.datos.estado,
    });

    const ticketGuardado =
      await nuevoTicket.save();

    console.log(
      "✅ Ticket guardado correctamente:"
    );

    console.log(
      ticketGuardado.toJSON()
    );

    console.log("");

    return res.status(201).json({
      success: true,
      message:
        "Ticket registrado correctamente.",
      data: ticketGuardado,
    });

  } catch (error) {
    return manejarErrorMongo(
      error,
      res,
      "No se pudo registrar el ticket."
    );
  }
};


// =====================================================
// PUT /api/tickets/:id
// Actualizar ticket
// =====================================================

exports.actualizarTicket = async (req, res) => {
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
      validarDatosTicket(
        req.body,
        {
          parcial: true,
        }
      );

    if (!validacion.valido) {
      return res.status(400).json({
        success: false,
        message:
          validacion.errores[0] ||
          "Los datos ingresados no son válidos.",
        errors:
          validacion.errores,
      });
    }

    const ticketActualizado =
      await Ticket.findByIdAndUpdate(
        id,
        {
          $set: validacion.datos,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!ticketActualizado) {
      return res.status(404).json({
        success: false,
        message:
          "Ticket no encontrado.",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Ticket actualizado correctamente.",
      data: ticketActualizado,
    });

  } catch (error) {
    return manejarErrorMongo(
      error,
      res,
      "No se pudo actualizar el ticket."
    );
  }
};


// =====================================================
// DELETE /api/tickets/:id
// Eliminar ticket
// =====================================================

exports.eliminarTicket = async (req, res) => {
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
        message:
          "Ticket no encontrado.",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Ticket eliminado correctamente.",
    });

  } catch (error) {
    return manejarErrorMongo(
      error,
      res,
      "No se pudo eliminar el ticket."
    );
  }
};