const mongoose = require("mongoose");

const conectarMongoDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error(
        "La variable MONGODB_URI no está configurada en el archivo .env"
      );
    }

    const conexion = await mongoose.connect(mongoURI, {
      dbName: process.env.MONGODB_DB || "helpdesk_db",
      serverSelectionTimeoutMS: 10000,
    });

    console.log("✅ MongoDB Atlas conectado correctamente");
    console.log(`✅ Base de datos: ${conexion.connection.name}`);

    return conexion;
  } catch (error) {
    console.error("❌ Error al conectar con MongoDB Atlas:");
    console.error(error.message);

    throw error;
  }
};

module.exports = conectarMongoDB;