const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, "El título es obligatorio"],
      trim: true,
      minlength: [4, "El título debe tener mínimo 4 caracteres"],
      maxlength: [150, "El título no puede superar 150 caracteres"],
    },

    descripcion: {
      type: String,
      required: [true, "La descripción es obligatoria"],
      trim: true,
      minlength: [
        10,
        "La descripción debe tener mínimo 10 caracteres",
      ],
      maxlength: [
        500,
        "La descripción no puede superar 500 caracteres",
      ],
    },

    categoria: {
      type: String,
      required: true,
      enum: {
        values: ["Red", "Hardware", "Software"],
        message: "Categoría no válida",
      },
      default: "Software",
    },

    prioridad: {
      type: String,
      required: true,
      enum: {
        values: ["Alta", "Media", "Baja"],
        message: "Prioridad no válida",
      },
      default: "Media",
    },

    estado: {
      type: String,
      required: true,
      enum: {
        values: ["Abierto", "En Progreso", "Cerrado"],
        message: "Estado no válido",
      },
      default: "Abierto",
    },
  },
  {
    timestamps: true,
    collection: "tickets",
    versionKey: false,

    toJSON: {
      transform: (documento, objeto) => {
        objeto.id = objeto._id.toString();

        delete objeto._id;

        return objeto;
      },
    },
  }
);

const Ticket =
  mongoose.models.Ticket ||
  mongoose.model("Ticket", ticketSchema);

module.exports = {
  Ticket,
};