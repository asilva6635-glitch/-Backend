const express = require('express');
const router = express.Router();

const ticketRoutes = require('./ticketRoutes');
const usuarioRoutes = require('./usuarioRoutes');

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Servidor operacional',
    timestamp: new Date()
  });
});

// Rutas principales
router.use('/tickets', ticketRoutes);
router.use('/usuarios', usuarioRoutes);

module.exports = router;