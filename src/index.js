require("dotenv").config();

const express = require("express");
const cors = require("cors");

const conectarMongoDB = require("./config/database");
const routes = require("./routes");

const app = express();

const PORT = Number(process.env.PORT) || 4000;
const HOST = "0.0.0.0";

// ==========================================
// CONFIGURACIÓN CORS
// ==========================================

const normalizarOrigen = (origen) =>
  String(origen || "")
    .trim()
    .replace(/\/+$/, "");

const origenesPermitidos = [
  "http://localhost:5173",
  ...String(process.env.FRONTEND_URL || "")
    .split(",")
    .map(normalizarOrigen)
    .filter(Boolean),
];

app.use(
  cors({
    origin(origen, callback) {
      // Permite Postman y solicitudes sin Origin
      if (!origen) {
        return callback(null, true);
      }

      const origenNormalizado = normalizarOrigen(origen);

      if (origenesPermitidos.includes(origenNormalizado)) {
        return callback(null, true);
      }

      return callback(
        new Error(`Origen no permitido por CORS: ${origen}`)
      );
    },

    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// ==========================================
// MIDDLEWARE
// ==========================================

app.disable("x-powered-by");

app.use(
  express.json({
    limit: "20kb",
  })
);

app.use(
  express.urlencoded({
    extended: false,
    limit: "20kb",
  })
);

// ==========================================
// ENCABEZADOS DE SEGURIDAD
// ==========================================

app.use((req, res, next) => {
  res.setHeader(
    "X-Content-Type-Options",
    "nosniff"
  );

  res.setHeader(
    "X-Frame-Options",
    "DENY"
  );

  res.setHeader(
    "Referrer-Policy",
    "no-referrer"
  );

  next();
});

// ==========================================
// RUTA PRINCIPAL
// ==========================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "API del Sistema Help Desk funcionando correctamente",
    database: "MongoDB Atlas",
  });
});

// ==========================================
// RUTAS DE LA API
// ==========================================

app.use("/api", routes);

// ==========================================
// RUTA NO ENCONTRADA
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Ruta no encontrada",
  });
});

// ==========================================
// MANEJO DE ERRORES
// ==========================================

app.use((error, req, res, next) => {
  console.error(
    "❌ Error del servidor:",
    error.message
  );

  if (
    error.message &&
    error.message.includes(
      "Origen no permitido por CORS"
    )
  ) {
    return res.status(403).json({
      success: false,
      message:
        "El origen de la solicitud no está autorizado.",
    });
  }

  return res.status(500).json({
    success: false,
    message:
      "Se produjo un error interno en el servidor.",
  });
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================

const iniciarServidor = async () => {
  try {
    await conectarMongoDB();

    app.listen(PORT, HOST, () => {
      console.log("");
      console.log(
        "🚀 SERVIDOR INICIADO CORRECTAMENTE"
      );

      console.log(
        `📍 Servidor: http://localhost:${PORT}`
      );

      console.log(
        `📖 Tickets: http://localhost:${PORT}/api/tickets`
      );

      console.log(
        `💗 Health: http://localhost:${PORT}/api/health`
      );

      console.log(
        "🍃 Persistencia: MongoDB Atlas"
      );

      console.log("");
    });
  } catch (error) {
    console.error(
      "❌ No fue posible iniciar el servidor."
    );

    process.exitCode = 1;
  }
};

iniciarServidor();