const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
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
      connectSrc:     isDev
        ? ["'self'", "http://localhost:5000", "http://localhost:5173"]
        : ["'self'", "https://belgrano-norte-online-production.up.railway.app"],
      imgSrc:         ["'self'", "data:", "https:"],
      objectSrc:      ["'none'"],
      frameAncestors: ["'none'"],
    },
  },
  xFrameOptions:       { action: 'deny' },
  xContentTypeOptions: true,
  referrerPolicy:      { policy: 'strict-origin-when-cross-origin' },
}));

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

const publicas          = require('./routes/publicas');
const panel             = require('./routes/panel');
const auth              = require('./routes/auth');
const { verificarToken} = require('./middleware/auth');

app.use('/api',       publicas);
app.use('/api/auth',  auth);
app.use('/api/panel', verificarToken, panel);

app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(err.status || 500).json({
    error: isDev ? err.message : 'Error interno del servidor',
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => console.log(`Servidor corriendo en puerto ${PORT}`));