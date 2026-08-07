import api from "./api";

export const obtenerTickets = async () => {
  const respuesta = await api.get("/tickets");
  return respuesta.data;
};

export const obtenerTicketPorId = async (id) => {
  const respuesta = await api.get(`/tickets/${id}`);
  return respuesta.data;
};

export const crearTicket = async (ticket) => {
  const respuesta = await api.post("/tickets", ticket);
  return respuesta.data;
};

export const actualizarTicket = async (id, ticket) => {
  const respuesta = await api.put(`/tickets/${id}`, ticket);
  return respuesta.data;
};

export const eliminarTicket = async (id) => {
  const respuesta = await api.delete(`/tickets/${id}`);
  return respuesta.data;
};