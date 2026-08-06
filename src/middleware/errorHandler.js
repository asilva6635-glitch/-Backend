// Middleware para rutas no encontradas
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    error: `No existe endpoint en ${req.method} ${req.path}`,
  });
};

// Middleware para errores globales
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};