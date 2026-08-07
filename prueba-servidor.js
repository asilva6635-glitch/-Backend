const express = require("express");

const app = express();
const PORT = 4000;

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Servidor funcionando correctamente"
  });
});

app.listen(PORT, () => {
  console.log(`Servidor de prueba activo en http://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
});
