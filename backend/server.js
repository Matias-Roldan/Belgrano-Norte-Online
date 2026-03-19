const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// ✅ AGREGADO: Validar variables críticas al arranque
// Si falta alguna, el error es claro en los logs de Railway
const VARS_REQUERIDAS = ['JWT_SECRET']; // agregá las que uses: DATABASE_URL, etc.
const faltantes = VARS_REQUERIDAS.filter(v => !process.env[v]);
if (faltantes.length > 0) {
  console.error(`[FATAL] Variables de entorno faltantes: ${faltantes.join(', ')}`);
  process.exit(1); // Falla rápido con mensaje claro en lugar de 500 misterioso
}

const app = express();
const isDev = process.env.NODE_ENV !== 'production';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc:     ["'self'"],
      scriptSrc:      ["'self'"],
      styleSrc:       ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc:        ["'self'", "https://fonts.gstatic.com"],
      connectSrc: isDev
      ? ["'self'", "http://localhost:5000", "http://localhost:5173"]
      : ["'self'", "https://belgrano-norte-online.vercel.app"],
      imgSrc:         ["'self'", "data:", "https:"],
      objectSrc:      ["'none'"],
      frameAncestors: ["'none'"],
    },
  },
  xFrameOptions:       { action: 'deny' },
  xContentTypeOptions: true,
  referrerPolicy:      { policy: 'strict-origin-when-cross-origin' },
}));

// ✅ CORREGIDO: Asegurate de que CORS_ORIGINS esté seteada en Railway
// En Railway dashboard: CORS_ORIGINS=https://belgrano-norte-online-production.up.railway.app
const ORIGENES_PERMITIDOS = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',').map(o => o.trim());

console.log('[CORS] Orígenes permitidos:', ORIGENES_PERMITIDOS); // ← para verificar en logs

app.use(cors({
  origin: (origin, callback) => {
    if (!origin && isDev) return callback(null, true);

    // ✅ AGREGADO: En producción, también permitir requests sin origin
    // (Postman, health checks de Railway, etc.)
    if (!origin && !isDev) return callback(null, true);

    if (ORIGENES_PERMITIDOS.includes(origin)) return callback(null, true);

    // ✅ CORREGIDO: Log del origen rechazado para debuggear
    console.warn('[CORS] Origen rechazado:', origin);
    callback(new Error('Origen no permitido por CORS'));
  },
  methods:        ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials:    true,
}));

app.use(express.json({ limit: '50kb' }));

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

const limitadorLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders:   false,
  message: { error: 'Demasiados intentos de login. Intentá de nuevo en 15 minutos.' },
});

app.use('/api',             limitadorGeneral);
app.use('/api/panel',       limitadorPanel);
app.use('/api/auth/login',  limitadorLogin);

// ✅ AGREGADO: Health check que Railway puede usar para verificar que el servidor vive
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// ✅ AGREGADO: Envolver los requires en try/catch para detectar errores de carga
let publicas, panel, auth, verificarToken;
try {
  publicas        = require('./routes/publicas');
  panel           = require('./routes/panel');
  auth            = require('./routes/auth');
  ({ verificarToken } = require('./middleware/auth'));
} catch (err) {
  console.error('[FATAL] Error cargando rutas o middleware:', err.message);
  process.exit(1);
}

app.use('/api',       publicas);
app.use('/api/auth',  auth);
app.use('/api/panel', verificarToken, panel);

// ✅ AGREGADO: Ruta catch-all para debuggear rutas inexistentes
app.use((req, res, next) => {
  console.warn(`[404] ${req.method} ${req.path}`);
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(err.status || 500).json({
    error: isDev ? err.message : 'Error interno del servidor',
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`Entorno: ${process.env.NODE_ENV || 'development'}`); // ✅ AGREGADO
});