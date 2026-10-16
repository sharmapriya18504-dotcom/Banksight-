export function errorHandler(err, req, res, next) {
  console.error('[BankSight Error]:', err.message);

  const status = err.statusCode || err.status || 500;
  const message = err.message || 'An internal database or server error occurred.';

  res.status(status).json({
    error: message,
    timestamp: new Date().toISOString(),
    path: req.originalUrl
  });
}
