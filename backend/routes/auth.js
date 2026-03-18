const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');

// [SEC-FIX] En producción esto debe consultar la base de datos con
// password hasheado con bcrypt. Nunca guardar contraseñas en texto plano.
// npm install bcrypt
// const bcrypt = require('bcrypt');

router.post('/login', async (req, res) => {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
  }

  // [SEC-FIX] Reemplazar esto con consulta a DB + bcrypt.compare()
  const usuarioValido  = usuario  === process.env.ADMIN_USER;
  const passwordValida = password === process.env.ADMIN_PASS;

  if (!usuarioValido || !passwordValida) {
    // [SEC-FIX] Mismo mensaje para usuario y password incorrectos
    // — evita enumerar usuarios válidos
    return res.status(401).json({ error: 'Credenciales incorrectas' });
  }

  const token = jwt.sign(
    { usuario, rol: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.json({ token });
});

module.exports = router;