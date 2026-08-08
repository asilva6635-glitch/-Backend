const mongoose = require("mongoose");

const conectarMongoDB = async () => {
  try {
    const usuario = process.env.MONGODB_USER;
    const password = process.env.MONGODB_PASSWORD;
    const host = process.env.MONGODB_HOST;
    const database = process.env.MONGODB_DB || "helpdesk_db";

    if (!usuario) {
      throw new Error(
        "Falta configurar MONGODB_USER en el archivo .env"
      );
    }

    if (!password) {
      throw new Error(
        "Falta configurar MONGODB_PASSWORD en el archivo .env"
      );
    }

    if (!host) {
      throw new Error(
        "Falta configurar MONGODB_HOST en el archivo .env"
      );
    }

    const usuarioCodificado =
      encodeURIComponent(usuario);

    const passwordCodificado =
      encodeURIComponent(password);

    const uri =
      `mongodb+srv://${usuarioCodificado}:${passwordCodificado}` +
      `@${host}/${database}` +
      `?retryWrites=true&w=majority&authSource=admin`;

    const conexion = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    });

    console.log("");
    console.log("✅ MongoDB Atlas conectado correctamente");
    console.log(
      `✅ Base de datos: ${conexion.connection.name}`
    );
    console.log(
      `✅ Host: ${conexion.connection.host}`
    );
    console.log("");

    return conexion;
  } catch (error) {
    console.error("");
    console.error(
      "❌ Error al conectar con MongoDB Atlas:"
    );

    if (
      error.message
        ?.toLowerCase()
        .includes("authentication failed") ||
      error.message
        ?.toLowerCase()
        .includes("bad auth")
    ) {
      console.error(
        "❌ Atlas rechazó el usuario o la contraseña."
      );

      console.error(
        "Verifica Security > Database Access en MongoDB Atlas."
      );
    } else {
      console.error(error.message);
    }

    console.error("");

    throw error;
  }
};

module.exports = conectarMongoDB;