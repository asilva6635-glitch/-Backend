require("dotenv").config();

const express = require("express");
const cors = require("cors");

const conectarMongoDB = require("./config/database");
const routes = require("./routes");

const app = express();

const PORT = Number(process.env.PORT) || 4000;
const HOST = "0.0.0.0";

// ======================================
// ORÍGENES PERMITIDOS
// ======================================

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

console.log(
  "🌐 Frontends permitidos:",
  origenesPermitidos
);

// ======================================
// CORS
// ======================================

const corsOptions = {
  origin: (origin, callback) => {
    // Permite Postman, Render Health Check, etc.
    if (!origin) {
      return callback(null, true);
    }

    const origenNormalizado =
      normalizarOrigen(origin);

    if (
      origenesPermitidos.includes(
        origenNormalizado
      )
    ) {
      return callback(null, true);
    }

    console.error(
      `❌ Origen bloqueado por CORS: ${origin}`
    );

    return callback(
      new Error("Origen no permitido por CORS")
    );
  },

  methods: [
    "GET",
    "POST",
    "PUT",
    "DELETE",
    "PATCH",
    "OPTIONS",
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
  ],

  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// El middleware oficial `cors` puede configurar
// Access-Control-Allow-Origin según el origen permitido.
app.disable("x-powered-by");

// ======================================
// BODY
// ======================================

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

// ======================================
// SEGURIDAD
// ======================================

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

// ======================================
// RUTA PRINCIPAL
// ======================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "API Help Desk funcionando correctamente",
    database: "MongoDB Atlas",
  });
});

// ======================================
// API
// ======================================

app.use("/api", routes);

// ======================================
// 404
// ======================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Ruta no encontrada",
  });
});

// ======================================
// MANEJO DE ERRORES
// ======================================

app.use((error, req, res, next) => {
  console.error(
    "❌ Error del servidor:",
    error.message
  );

  if (
    error.message ===
    "Origen no permitido por CORS"
  ) {
    return res.status(403).json({
      success: false,
      message:
        "El frontend no está autorizado por CORS.",
    });
  }

  return res.status(500).json({
    success: false,
    message:
      "Error interno del servidor.",
  });
});

// ======================================
// INICIAR SERVIDOR
// ======================================

const iniciarServidor = async () => {
  try {
    await conectarMongoDB();

    app.listen(PORT, HOST, () => {
      console.log("");
      console.log(
        "🚀 SERVIDOR INICIADO CORRECTAMENTE"
      );

      console.log(
        `📍 Puerto: ${PORT}`
      );

      console.log(
        "🍃 MongoDB Atlas conectado"
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