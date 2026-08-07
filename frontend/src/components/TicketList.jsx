import { useCallback, useEffect, useState } from "react";

import {
  obtenerTickets,
  actualizarTicket,
  eliminarTicket,
} from "../services/ticketService";

import { validarTicket } from "../utils/ticketValidation";

const FORMULARIO_INICIAL = {
  titulo: "",
  descripcion: "",
  categoria: "Software",
  prioridad: "Media",
  estado: "Abierto",
};

const normalizarTickets = (respuesta) => {
  if (Array.isArray(respuesta)) {
    return respuesta;
  }

  if (Array.isArray(respuesta?.data)) {
    return respuesta.data;
  }

  if (Array.isArray(respuesta?.tickets)) {
    return respuesta.tickets;
  }

  return [];
};

function TicketList({ actualizacion, onTicketsActualizados }) {
  const [tickets, setTickets] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [procesandoId, setProcesandoId] = useState(null);

  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [ticketEditando, setTicketEditando] = useState(null);

  const [formularioEdicion, setFormularioEdicion] = useState(
    FORMULARIO_INICIAL
  );

  const cargarTickets = useCallback(async () => {
    try {
      setCargando(true);
      setError("");

      const respuesta = await obtenerTickets();
      const listaTickets = normalizarTickets(respuesta);

      setTickets(listaTickets);
    } catch (errorPeticion) {
      console.error("Error al obtener los tickets:", errorPeticion);

      setTickets([]);

      setError(
        errorPeticion.response?.data?.message ||
          errorPeticion.response?.data?.mensaje ||
          "No fue posible cargar los tickets. Verifique que el backend esté funcionando."
      );
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarTickets();
  }, [actualizacion, cargarTickets]);

  const limpiarMensajes = () => {
    setError("");
    setMensaje("");
  };

  const notificarActualizacion = () => {
    if (typeof onTicketsActualizados === "function") {
      onTicketsActualizados();
    }
  };

  const cambiarEstado = async (ticket, nuevoEstado) => {
    try {
      setProcesandoId(ticket.id);
      limpiarMensajes();

      await actualizarTicket(ticket.id, {
        estado: nuevoEstado,
      });

      setMensaje(
        `El estado del ticket #${ticket.id} fue actualizado a "${nuevoEstado}".`
      );

      await cargarTickets();
      notificarActualizacion();
    } catch (errorPeticion) {
      console.error("Error al actualizar el estado:", errorPeticion);

      setError(
        errorPeticion.response?.data?.message ||
          errorPeticion.response?.data?.mensaje ||
          "No se pudo actualizar el estado del ticket."
      );
    } finally {
      setProcesandoId(null);
    }
  };

  const abrirFormularioEdicion = (ticket) => {
    limpiarMensajes();

    setTicketEditando(ticket);

    setFormularioEdicion({
      titulo: ticket.titulo || "",
      descripcion: ticket.descripcion || "",
      categoria: ticket.categoria || "Software",
      prioridad: ticket.prioridad || "Media",
      estado: ticket.estado || "Abierto",
    });
  };

  const cerrarFormularioEdicion = () => {
    if (procesandoId !== null) {
      return;
    }

    setTicketEditando(null);
    setFormularioEdicion(FORMULARIO_INICIAL);
    setError("");
  };

  const manejarCambioEdicion = (evento) => {
    const { name, value } = evento.target;

    setFormularioEdicion((datosAnteriores) => ({
      ...datosAnteriores,
      [name]: value,
    }));

    setError("");
  };

  const guardarEdicion = async (evento) => {
    evento.preventDefault();

    if (!ticketEditando) {
      return;
    }

    /*
     * Valida y limpia los campos antes de enviarlos.
     * También elimina caracteres como < y > para reducir
     * el riesgo de contenido malicioso.
     */
    const resultado = validarTicket(formularioEdicion);

    if (!resultado.valido) {
      const primerError = Object.values(resultado.errores)[0];

      setError(
        primerError || "Revise la información ingresada."
      );

      return;
    }

    try {
      setProcesandoId(ticketEditando.id);
      limpiarMensajes();

      await actualizarTicket(
        ticketEditando.id,
        resultado.ticketLimpio
      );

      setMensaje(
        `El ticket #${ticketEditando.id} fue editado correctamente.`
      );

      setTicketEditando(null);
      setFormularioEdicion(FORMULARIO_INICIAL);

      await cargarTickets();
      notificarActualizacion();
    } catch (errorPeticion) {
      console.error("Error al editar el ticket:", errorPeticion);

      setError(
        errorPeticion.response?.data?.message ||
          errorPeticion.response?.data?.mensaje ||
          "No se pudo editar el ticket."
      );
    } finally {
      setProcesandoId(null);
    }
  };

  const confirmarEliminacion = async (ticket) => {
    const confirmacion = window.confirm(
      `¿Está segura de eliminar el ticket #${ticket.id}: "${ticket.titulo}"?`
    );

    if (!confirmacion) {
      return;
    }

    try {
      setProcesandoId(ticket.id);
      limpiarMensajes();

      await eliminarTicket(ticket.id);

      setMensaje(
        `El ticket #${ticket.id} fue eliminado correctamente.`
      );

      await cargarTickets();
      notificarActualizacion();
    } catch (errorPeticion) {
      console.error("Error al eliminar el ticket:", errorPeticion);

      setError(
        errorPeticion.response?.data?.message ||
          errorPeticion.response?.data?.mensaje ||
          "No se pudo eliminar el ticket."
      );
    } finally {
      setProcesandoId(null);
    }
  };

  const obtenerClasePrioridad = (prioridad) => {
    const valor = String(prioridad || "")
      .trim()
      .toLowerCase();

    if (valor === "alta") {
      return "prioridad-alta";
    }

    if (valor === "media") {
      return "prioridad-media";
    }

    return "prioridad-baja";
  };

  return (
    <section className="ticket-section ticket-list-section">
      <div className="section-header list-header">
        <div>
          <h2>Listado de tickets</h2>

          <p>
            Incidentes registrados en el sistema Help Desk.
          </p>
        </div>

        <button
          type="button"
          className="button button-refresh"
          onClick={cargarTickets}
          disabled={cargando}
        >
          {cargando ? "Cargando..." : "Actualizar"}
        </button>
      </div>

      {mensaje && (
        <div
          className="mensaje mensaje-exito"
          role="status"
        >
          {mensaje}
        </div>
      )}

      {error && !ticketEditando && (
        <div
          className="mensaje mensaje-error"
          role="alert"
        >
          {error}
        </div>
      )}

      {cargando ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando tickets...</p>
        </div>
      ) : tickets.length === 0 ? (
        <div className="empty-state">
          <h3>No hay tickets registrados</h3>

          <p>
            Registre un nuevo incidente utilizando el formulario.
          </p>
        </div>
      ) : (
        <>
          <div className="ticket-counter">
            Total de registros:{" "}
            <strong>{tickets.length}</strong>
          </div>

          <div className="table-container">
            <table className="ticket-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Título</th>
                  <th>Categoría</th>
                  <th>Prioridad</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {tickets.map((ticket) => {
                  const estaProcesando =
                    procesandoId === ticket.id;

                  return (
                    <tr key={ticket.id}>
                      <td>#{ticket.id}</td>

                      <td>
                        <div className="ticket-title">
                          <strong>
                            {ticket.titulo}
                          </strong>

                          <span title={ticket.descripcion}>
                            {ticket.descripcion}
                          </span>
                        </div>
                      </td>

                      <td>{ticket.categoria}</td>

                      <td>
                        <span
                          className={`badge ${obtenerClasePrioridad(
                            ticket.prioridad
                          )}`}
                        >
                          {ticket.prioridad}
                        </span>
                      </td>

                      <td>
                        <select
                          className="estado-select"
                          value={ticket.estado || "Abierto"}
                          disabled={estaProcesando}
                          onChange={(evento) =>
                            cambiarEstado(
                              ticket,
                              evento.target.value
                            )
                          }
                        >
                          <option value="Abierto">
                            Abierto
                          </option>

                          <option value="En Progreso">
                            En Progreso
                          </option>

                          <option value="Cerrado">
                            Cerrado
                          </option>
                        </select>
                      </td>

                      <td>
                        <div className="action-buttons">
                          <button
                            type="button"
                            className="button-edit"
                            disabled={estaProcesando}
                            onClick={() =>
                              abrirFormularioEdicion(ticket)
                            }
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            className="button-delete"
                            disabled={estaProcesando}
                            onClick={() =>
                              confirmarEliminacion(ticket)
                            }
                          >
                            {estaProcesando
                              ? "Procesando..."
                              : "Eliminar"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {ticketEditando && (
        <div className="modal-overlay">
          <div
            className="modal-content"
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-modal-edicion"
          >
            <div className="modal-header">
              <div>
                <h2 id="titulo-modal-edicion">
                  Editar ticket #{ticketEditando.id}
                </h2>

                <p>
                  Modifique la información del incidente.
                </p>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={cerrarFormularioEdicion}
                disabled={procesandoId !== null}
                aria-label="Cerrar formulario de edición"
              >
                ×
              </button>
            </div>

            {error && (
              <div
                className="mensaje mensaje-error"
                role="alert"
              >
                {error}
              </div>
            )}

            <form
              className="ticket-form"
              onSubmit={guardarEdicion}
              noValidate
            >
              <div className="form-group">
                <label htmlFor="editar-titulo">
                  Título del incidente
                </label>

                <input
                  type="text"
                  id="editar-titulo"
                  name="titulo"
                  value={formularioEdicion.titulo}
                  onChange={manejarCambioEdicion}
                  maxLength={150}
                  disabled={procesandoId !== null}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="editar-descripcion">
                  Descripción
                </label>

                <textarea
                  id="editar-descripcion"
                  name="descripcion"
                  value={formularioEdicion.descripcion}
                  onChange={manejarCambioEdicion}
                  rows={5}
                  maxLength={500}
                  disabled={procesandoId !== null}
                  required
                />

                <div className="field-information">
                  <span></span>

                  <small>
                    {formularioEdicion.descripcion.length}/500
                  </small>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="editar-categoria">
                    Categoría
                  </label>

                  <select
                    id="editar-categoria"
                    name="categoria"
                    value={formularioEdicion.categoria}
                    onChange={manejarCambioEdicion}
                    disabled={procesandoId !== null}
                  >
                    <option value="Red">Red</option>

                    <option value="Hardware">
                      Hardware
                    </option>

                    <option value="Software">
                      Software
                    </option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="editar-prioridad">
                    Prioridad
                  </label>

                  <select
                    id="editar-prioridad"
                    name="prioridad"
                    value={formularioEdicion.prioridad}
                    onChange={manejarCambioEdicion}
                    disabled={procesandoId !== null}
                  >
                    <option value="Alta">Alta</option>

                    <option value="Media">Media</option>

                    <option value="Baja">Baja</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="editar-estado">
                  Estado
                </label>

                <select
                  id="editar-estado"
                  name="estado"
                  value={formularioEdicion.estado}
                  onChange={manejarCambioEdicion}
                  disabled={procesandoId !== null}
                >
                  <option value="Abierto">
                    Abierto
                  </option>

                  <option value="En Progreso">
                    En Progreso
                  </option>

                  <option value="Cerrado">
                    Cerrado
                  </option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={cerrarFormularioEdicion}
                  disabled={procesandoId !== null}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="button button-primary"
                  disabled={procesandoId !== null}
                >
                  {procesandoId === ticketEditando.id
                    ? "Guardando..."
                    : "Guardar cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default TicketList;