// controllers/authController.js
// ─────────────────────────────────────────────
// Logica de autenticacion del panel de operadores.
// TODO produccion: reemplazar comparacion de .env
//      por consulta a DB con bcrypt.compare()
// ─────────────────────────────────────────────
const jwt                    = require('jsonwebtoken');
const { sanitizar, errInterno } = require('../helpers/validar');

// POST /api/auth/login
const login = async (req, res) => {
  const usuario  = sanitizar(req.body.usuario,  80);
  const password = sanitizar(req.body.password, 128);

  if (!usuario || !password) {
    return res.status(400).json({ error: 'Usuario y contrasena requeridos' });
  }

  // [SEC-FIX] Comparacion en tiempo constante no es posible con strings planos.
  // Migracion a bcrypt pendiente antes del deploy a produccion.
  const usuarioValido  = usuario  === process.env.ADMIN_USER;
  const passwordValida = password === process.env.ADMIN_PASS;

  if (!usuarioValido || !passwordValida) {
    // [SEC-FIX] Mensaje generico — no revela si fallo usuario o password
    return res.status(401).json({ error: 'Credenciales incorrectas' });
  }

  try {
    const token = jwt.sign(
      { usuario, rol: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.json({ token });
  } catch (err) { errInterno(res, err); }
};

module.exports = { login };
