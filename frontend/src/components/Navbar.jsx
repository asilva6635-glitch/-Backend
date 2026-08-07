function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span className="logo-icon">HD</span>

        <div>
          <h1>Help Desk</h1>
          <p>Sistema de Gestión de Incidentes</p>
        </div>
      </div>

      <div className="navbar-user">
        <span>Administrador</span>
      </div>
    </nav>
  );
}

export default Navbar;