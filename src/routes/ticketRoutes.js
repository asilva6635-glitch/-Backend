const express = require("express");

const {
  obtenerTickets,
  obtenerTicketPorId,
  crearTicket,
  actualizarTicket,
  eliminarTicket,
} = require("../controllers/TicketController");

const router = express.Router();

router.get("/", obtenerTickets);

router.get("/:id", obtenerTicketPorId);

router.post("/", crearTicket);

router.put("/:id", actualizarTicket);

router.delete("/:id", eliminarTicket);

module.exports = router;