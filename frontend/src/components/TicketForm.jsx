import { useState } from "react";

import { crearTicket } from "../services/ticketService";
import { validarTicket } from "../utils/ticketValidation";

function TicketForm({ onTicketCreado }) {
  const estadoInicial = {
    titulo: "",
    descripcion: "",
    categoria: "Software",
    prioridad: "Media",
    estado: "Abierto",
  };

  const [ticket, setTicket] = useState(estadoInicial);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);

  const manejarCambio = (evento) => {
    const { name, value } = evento.target;

    setTicket((ticketAnterior) => ({
      ...ticketAnterior,
      [name]: value,
    }));

    setErrores((erroresAnteriores) => ({
      ...erroresAnteriores,
      [name]: "",
    }));

    setMensaje("");
  };

  const manejarEnvio = async (evento) => {
    evento.preventDefault();

    setMensaje("");
    setTipoMensaje("");

    const resultado = validarTicket(ticket);

    if (!resultado.valido) {
      setErrores(resultado.errores);
      setMensaje(
        "Revise los campos marcados antes de registrar el incidente."
      );
      setTipoMensaje("error");
      return;
    }

    try {
      setEnviando(true);
      setErrores({});

      const respuesta = await crearTicket(
        resultado.ticketLimpio
      );

      setTicket(estadoInicial);
      setMensaje(
        respuesta?.message ||
          "El incidente fue registrado correctamente."
      );
      setTipoMensaje("exito");

      if (onTicketCreado) {
        onTicketCreado();
      }
    } catch (error) {
      console.error("Error al registrar el ticket:", error);

      const mensajeServidor =
        error.response?.data?.message ||
        error.response?.data?.mensaje;

      setMensaje(
        mensajeServidor ||
          "No fue posible registrar el incidente. Verifique la conexión con el servidor."
      );

      setTipoMensaje("error");
    } finally {
      setEnviando(false);
    }
  };

  const limpiarFormulario = () => {
    setTicket(estadoInicial);
    setErrores({});
    setMensaje("");
    setTipoMensaje("");
  };

  return (
    <section className="ticket-section">
      <div className="section-header">
        <div>
          <h2>Registrar incidente</h2>
          <p>Ingrese la información del nuevo ticket.</p>
        </div>
      </div>

      {mensaje && (
        <div
          className={`mensaje mensaje-${tipoMensaje}`}
          role="alert"
        >
          {mensaje}
        </div>
      )}

      <form
        className="ticket-form"
        onSubmit={manejarEnvio}
        noValidate
      >
        <div className="form-group">
          <label htmlFor="titulo">
            Título del incidente
          </label>

          <input
            type="text"
            id="titulo"
            name="titulo"
            value={ticket.titulo}
            onChange={manejarCambio}
            placeholder="Ejemplo: Computadora sin internet"
            maxLength={150}
            disabled={enviando}
            className={errores.titulo ? "input-error" : ""}
            aria-invalid={Boolean(errores.titulo)}
          />

          {errores.titulo && (
            <small className="field-error">
              {errores.titulo}
            </small>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="descripcion">Descripción</label>

          <textarea
            id="descripcion"
            name="descripcion"
            value={ticket.descripcion}
            onChange={manejarCambio}
            placeholder="Describa detalladamente el problema"
            rows={5}
            maxLength={500}
            disabled={enviando}
            className={
              errores.descripcion ? "input-error" : ""
            }
            aria-invalid={Boolean(errores.descripcion)}
          />

          <div className="field-information">
            <span>
              {errores.descripcion && (
                <small className="field-error">
                  {errores.descripcion}
                </small>
              )}
            </span>

            <small>
              {ticket.descripcion.length}/500
            </small>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="categoria">Categoría</label>

            <select
              id="categoria"
              name="categoria"
              value={ticket.categoria}
              onChange={manejarCambio}
              disabled={enviando}
            >
              <option value="Red">Red</option>
              <option value="Hardware">Hardware</option>
              <option value="Software">Software</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="prioridad">Prioridad</label>

            <select
              id="prioridad"
              name="prioridad"
              value={ticket.prioridad}
              onChange={manejarCambio}
              disabled={enviando}
            >
              <option value="Alta">Alta</option>
              <option value="Media">Media</option>
              <option value="Baja">Baja</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="estado">Estado inicial</label>

          <select
            id="estado"
            name="estado"
            value={ticket.estado}
            onChange={manejarCambio}
            disabled={enviando}
          >
            <option value="Abierto">Abierto</option>
            <option value="En Progreso">En Progreso</option>
            <option value="Cerrado">Cerrado</option>
          </select>
        </div>

        <div className="form-buttons">
          <button
            type="button"
            className="button button-secondary"
            onClick={limpiarFormulario}
            disabled={enviando}
          >
            Limpiar
          </button>

          <button
            type="submit"
            className="button button-primary"
            disabled={enviando}
          >
            {enviando
              ? "Registrando..."
              : "Registrar incidente"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default TicketForm;