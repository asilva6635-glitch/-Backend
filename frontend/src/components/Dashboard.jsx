import { useEffect, useState } from "react";
import { obtenerTickets } from "../services/ticketService";

function Dashboard({ actualizacion }) {
  const [tickets, setTickets] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const normalizarRespuesta = (respuesta) => {
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

  const cargarEstadisticas = async () => {
    try {
      setCargando(true);
      setError("");

      const respuesta = await obtenerTickets();
      const lista = normalizarRespuesta(respuesta);

      setTickets(lista);
    } catch (errorPeticion) {
      console.error(
        "Error al cargar las estadísticas:",
        errorPeticion
      );

      setTickets([]);
      setError("No se pudieron cargar las estadísticas.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarEstadisticas();
  }, [actualizacion]);

  const normalizarTexto = (valor) =>
    String(valor || "")
      .trim()
      .toLowerCase();

  const totalTickets = tickets.length;

  const ticketsAbiertos = tickets.filter(
    (ticket) =>
      normalizarTexto(ticket.estado) === "abierto"
  ).length;

  const ticketsEnProgreso = tickets.filter((ticket) => {
    const estado = normalizarTexto(ticket.estado);

    return (
      estado === "en progreso" ||
      estado === "en_progreso"
    );
  }).length;

  const ticketsCerrados = tickets.filter(
    (ticket) =>
      normalizarTexto(ticket.estado) === "cerrado"
  ).length;

  return (
    <section className="dashboard">
      <div className="dashboard-header">
        <h2>Panel de control</h2>

        <button
          type="button"
          className="button button-refresh"
          onClick={cargarEstadisticas}
          disabled={cargando}
        >
          {cargando ? "Actualizando..." : "Actualizar panel"}
        </button>
      </div>

      {error && (
        <div className="mensaje mensaje-error">
          {error}
        </div>
      )}

      <div className="dashboard-cards">
        <article className="dashboard-card">
          <h3>Total de tickets</h3>
          <p>{cargando ? "..." : totalTickets}</p>
        </article>

        <article className="dashboard-card">
          <h3>Tickets abiertos</h3>
          <p>{cargando ? "..." : ticketsAbiertos}</p>
        </article>

        <article className="dashboard-card">
          <h3>En progreso</h3>
          <p>{cargando ? "..." : ticketsEnProgreso}</p>
        </article>

        <article className="dashboard-card">
          <h3>Tickets cerrados</h3>
          <p>{cargando ? "..." : ticketsCerrados}</p>
        </article>
      </div>
    </section>
  );
}

export default Dashboard;