import axios from "axios";

const API_URL = String(
  import.meta.env.VITE_API_URL ||
    "http://localhost:4000/api"
)
  .trim()
  .replace(/\/+$/, "");

const api = axios.create({
  baseURL: API_URL,

  headers: {
    "Content-Type": "application/json",
  },

  timeout: 15000,
});

api.interceptors.response.use(
  (response) => response,

  (error) => {
    console.error(
      "Error en la comunicación con la API:",
      error.response?.data || error.message
    );

    return Promise.reject(error);
  }
);

export default api;