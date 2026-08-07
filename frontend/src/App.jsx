import { useState } from "react";
import "./App.css";

import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import TicketForm from "./components/TicketForm";
import TicketList from "./components/TicketList";

function App() {
  const [actualizacion, setActualizacion] = useState(0);

  const actualizarSistema = () => {
    setActualizacion((valorAnterior) => valorAnterior + 1);
  };

  return (
    <>
      <Navbar />

      <main className="main-container">
        <Dashboard actualizacion={actualizacion} />

        <div className="content-grid">
          <TicketForm onTicketCreado={actualizarSistema} />

          <TicketList
            actualizacion={actualizacion}
            onTicketsActualizados={actualizarSistema}
          />
        </div>
      </main>

      <footer className="footer">
        <p>
          Sistema de Gestión de Incidentes Help Desk — Actividad 9
        </p>
      </footer>
    </>
  );
}

export default App;