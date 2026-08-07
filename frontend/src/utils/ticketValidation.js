const CATEGORIAS_VALIDAS = [
  "Red",
  "Hardware",
  "Software",
];

const PRIORIDADES_VALIDAS = [
  "Alta",
  "Media",
  "Baja",
];

const ESTADOS_VALIDOS = [
  "Abierto",
  "En Progreso",
  "Cerrado",
];

/**
 * Limpia caracteres de control y limita la longitud.
 * React ya representa el texto de manera segura en JSX,
 * pero esta limpieza evita guardar símbolos no deseados.
 */
export const limpiarTexto = (valor, longitudMaxima) => {
  return String(valor ?? "")
    .replace(
      /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g,
      ""
    )
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, longitudMaxima);
};

export const validarTicket = (datos = {}) => {
  const ticketLimpio = {
    titulo: limpiarTexto(datos.titulo, 150),
    descripcion: limpiarTexto(datos.descripcion, 500),
    categoria: limpiarTexto(datos.categoria, 30),
    prioridad: limpiarTexto(datos.prioridad, 20),
    estado: limpiarTexto(datos.estado, 30),
  };

  const errores = {};

  if (!ticketLimpio.titulo) {
    errores.titulo = "El título es obligatorio.";
  } else if (ticketLimpio.titulo.length < 4) {
    errores.titulo =
      "El título debe contener al menos 4 caracteres.";
  }

  if (!ticketLimpio.descripcion) {
    errores.descripcion =
      "La descripción es obligatoria.";
  } else if (ticketLimpio.descripcion.length < 10) {
    errores.descripcion =
      "La descripción debe contener al menos 10 caracteres.";
  }

  if (
    !CATEGORIAS_VALIDAS.includes(ticketLimpio.categoria)
  ) {
    errores.categoria =
      "La categoría seleccionada no es válida.";
  }

  if (
    !PRIORIDADES_VALIDAS.includes(ticketLimpio.prioridad)
  ) {
    errores.prioridad =
      "La prioridad seleccionada no es válida.";
  }

  if (!ESTADOS_VALIDOS.includes(ticketLimpio.estado)) {
    errores.estado =
      "El estado seleccionado no es válido.";
  }

  return {
    valido: Object.keys(errores).length === 0,
    errores,
    ticketLimpio,
  };
};