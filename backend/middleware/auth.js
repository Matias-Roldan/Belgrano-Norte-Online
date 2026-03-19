// middleware/auth.js
// ─────────────────────────────────────────────
// Verifica el JWT en el header Authorization.
// Se aplica a todas las rutas de /api/panel
// ─────────────────────────────────────────────
const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ error: 'Acceso no autorizado' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload;
    next();
  } catch {
    return res.status(403).json({ error: 'Token invalido o expirado' });
  }
}

module.exports = { verificarToken };
