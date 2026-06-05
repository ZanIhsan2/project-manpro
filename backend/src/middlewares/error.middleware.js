function notFound(req, res) {
  res.status(404).json({
    message: `Route ${req.method} ${req.originalUrl} tidak ditemukan`
  });
}

function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    message: error.message || "Terjadi kesalahan pada server"
  });
}

module.exports = {
  notFound,
  errorHandler
};
