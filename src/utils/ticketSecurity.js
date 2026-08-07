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

const CAMPOS_PERMITIDOS = [
  "titulo",
  "descripcion",
  "categoria",
  "prioridad",
  "estado",
];


const tieneCampo = (objeto, campo) =>
  Object.prototype.hasOwnProperty.call(
    objeto,
    campo
  );


const limpiarTexto = (
  valor,
  longitudMaxima
) => {
  return String(valor ?? "")
    .replace(
      /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g,
      ""
    )
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, longitudMaxima);
};


const validarDatosTicket = (
  cuerpo,
  { parcial = false } = {}
) => {
  const entrada =
    cuerpo &&
    typeof cuerpo === "object" &&
    !Array.isArray(cuerpo)
      ? cuerpo
      : {};

  const datos = {};
  const errores = [];


  const camposDesconocidos =
    Object.keys(entrada).filter(
      (campo) =>
        !CAMPOS_PERMITIDOS.includes(campo)
    );


  if (camposDesconocidos.length > 0) {
    errores.push(
      "La solicitud contiene campos no permitidos."
    );
  }


  // TÍTULO

  if (
    !parcial ||
    tieneCampo(entrada, "titulo")
  ) {
    const titulo = limpiarTexto(
      entrada.titulo,
      150
    );

    if (!titulo) {
      errores.push(
        "El título es obligatorio."
      );
    } else if (titulo.length < 4) {
      errores.push(
        "El título debe contener al menos 4 caracteres."
      );
    } else {
      datos.titulo = titulo;
    }
  }


  // DESCRIPCIÓN

  if (
    !parcial ||
    tieneCampo(entrada, "descripcion")
  ) {
    const descripcion = limpiarTexto(
      entrada.descripcion,
      500
    );

    if (!descripcion) {
      errores.push(
        "La descripción es obligatoria."
      );
    } else if (
      descripcion.length < 10
    ) {
      errores.push(
        "La descripción debe contener al menos 10 caracteres."
      );
    } else {
      datos.descripcion =
        descripcion;
    }
  }


  // CATEGORÍA

  if (
    !parcial ||
    tieneCampo(entrada, "categoria")
  ) {
    const categoria = limpiarTexto(
      entrada.categoria ||
        "Software",
      30
    );

    if (
      !CATEGORIAS_VALIDAS.includes(
        categoria
      )
    ) {
      errores.push(
        "La categoría no es válida."
      );
    } else {
      datos.categoria = categoria;
    }
  }


  // PRIORIDAD

  if (
    !parcial ||
    tieneCampo(entrada, "prioridad")
  ) {
    const prioridad = limpiarTexto(
      entrada.prioridad || "Media",
      20
    );

    if (
      !PRIORIDADES_VALIDAS.includes(
        prioridad
      )
    ) {
      errores.push(
        "La prioridad no es válida."
      );
    } else {
      datos.prioridad = prioridad;
    }
  }


  // ESTADO

  if (
    !parcial ||
    tieneCampo(entrada, "estado")
  ) {
    const estado = limpiarTexto(
      entrada.estado || "Abierto",
      30
    );

    if (
      !ESTADOS_VALIDOS.includes(
        estado
      )
    ) {
      errores.push(
        "El estado no es válido."
      );
    } else {
      datos.estado = estado;
    }
  }


  if (
    parcial &&
    Object.keys(datos).length === 0
  ) {
    errores.push(
      "No se proporcionaron datos válidos para actualizar."
    );
  }


  return {
    valido: errores.length === 0,
    datos,
    errores,
  };
};


module.exports = {
  validarDatosTicket,
};