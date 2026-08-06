const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/TicketController');

// Rutas de tickets
router.get('/', ticketController.obtenerTickets);
router.get('/stats/general', ticketController.obtenerEstadisticas);
router.get('/:id', ticketController.obtenerTicketPorId);
router.post('/', ticketController.crearTicket);
router.put('/:id', ticketController.actualizarTicket);
router.delete('/:id', ticketController.eliminarTicket);

module.exports = router;