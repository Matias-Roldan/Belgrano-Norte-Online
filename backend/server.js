const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
require('dotenv').config();

const app = express();

// [SEC-FIX] Headers de seguridad HTTP completos
const isDev = process.env.NODE_ENV !== 'production';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc:     ["'self'"],
      scriptSrc:      ["'self'"],
      styleSrc:       ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc:        ["'self'", "https://fonts.gstatic.com"],
      // [SEC-FIX] connectSrc permite llamadas al backend desde el frontend.
      // En dev incluye localhost; en prod solo el dominio real.
      connectSrc:     isDev
        ? ["'self'", "http://localhost:5000", "http://localhost:5173"]
        : ["'self'", "https://tu-api-dominio.com"],
      imgSrc:         ["'self'", "data:", "https:"],
      objectSrc:      ["'none'"],
      frameAncestors: ["'none'"],
    },
  },
  xFrameOptions:       { action: 'deny' },
  xContentTypeOptions: true,
  referrerPolicy:      { policy: 'strict-origin-when-cross-origin' },
}));

// [SEC-FIX] CORS restringido solo a tu frontend
const ORIGENES_PERMITIDOS = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',').map(o => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    if (!origin && isDev) return callback(null, true);
    if (ORIGENES_PERMITIDOS.includes(origin)) return callback(null, true);
    callback(new Error('Origen no permitido por CORS'));
  },
  methods:        ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials:    true,
}));

// [SEC-FIX] Límite de tamaño de payload — previene DoS por JSON gigante
app.use(express.json({ limit: '50kb' }));

// [SEC-FIX] Rate limiting
const { rateLimit } = require('express-rate-limit');

const limitadorGeneral = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders:   false,
  message: { error: 'Demasiadas solicitudes. Intentá de nuevo en 15 minutos.' },
});

const limitadorPanel = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { error: 'Demasiadas solicitudes al panel.' },
});

// [SEC-FIX] Rate limiting estricto para login — máx 10 intentos / 15 min
// Previene ataques de fuerza bruta sobre las credenciales del panel
const limitadorLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders:   false,
  message: { error: 'Demasiados intentos de login. Intentá de nuevo en 15 minutos.' },
});

app.use('/api',             limitadorGeneral);
app.use('/api/panel',       limitadorPanel);
// [SEC-FIX] El limitador de login va ANTES del mount de la ruta
app.use('/api/auth/login',  limitadorLogin);

const publicas          = require('./routes/publicas');
const panel             = require('./routes/panel');
const auth              = require('./routes/auth');
const { verificarToken} = require('./middleware/auth');

app.use('/api',       publicas);
app.use('/api/auth',  auth);
app.use('/api/panel', verificarToken, panel);

// [SEC-FIX] Handler de errores global — nunca exponer stack en producción
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(err.status || 500).json({
    error: isDev ? err.message : 'Error interno del servidor',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));