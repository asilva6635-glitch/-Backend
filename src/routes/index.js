const express = require("express");

const ticketRoutes = require("./ticketRoutes");

const router = express.Router();


// Ruta para verificar el servidor
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "Servidor Help Desk operacional",
    database: "MongoDB Atlas",
    timestamp: new Date().toISOString(),
  });
});


// Rutas de tickets
router.use("/tickets", ticketRoutes);

module.exports = router;