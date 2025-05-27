require('dotenv-safe').config();
const express = require('express');
const { expressjwt: jwt } = require('express-jwt');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 3000;

// Middlewares globais
app.use(helmet());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: ['http://localhost:3040', 'http://localhost:4200'],
  credentials: true,
}));

// URLs dos microsserviços
const authServiceUrl = process.env.MS_AUTH_URL;
const clienteServiceUrl = process.env.MS_CLIENTE_URL;
const funcionarioServiceUrl = process.env.MS_FUNCIONARIO_URL;
const reservaServiceUrl = process.env.MS_RESERVA_URL;
const voosServiceUrl = process.env.MS_VOOS_URL;
const sagaServiceUrl = process.env.MS_SAGA_URL;

// ================= Verificação das variáveis ===================
if (!authServiceUrl || !clienteServiceUrl || !funcionarioServiceUrl || !reservaServiceUrl || !voosServiceUrl || !sagaServiceUrl) {
  console.error("Alguma variável de ambiente obrigatória está faltando.");
  process.exit(1);
}

// ======================= Controle de Papeis ====================
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      console.warn("Acesso negado: usuário não autenticado");
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (role !== 'TODOS' && req.user.tipo !== role) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}

// ======================= ROTAS PÚBLICAS ========================

// ======================= LOGIN =================================
app.post("/api/login",
  createProxyMiddleware({
    target: authServiceUrl,
    changeOrigin: true,
    pathRewrite: path => path.replace("/api/login", "/auth/login")
  })
);

// ======================= REGISTRO =================================
app.post(
  "/api/register",
  createProxyMiddleware({
    target: authServiceUrl,
    changeOrigin: true,
    pathRewrite: (path) => path.replace("/api/register", "/auth/register")
  })
);

// ======================= SAGA AUTOCADASTRO ======================
app.post(
  "/api/saga/autocadastro",
  createProxyMiddleware({
    target: sagaServiceUrl,
    changeOrigin: true,
    pathRewrite: (path) =>
      path.replace("/api/saga/autocadastro", "/saga/ms-cliente/cadastrar-cliente"),
  })
);

// ======================= Cadastro Cliente ======================
app.post(
  "/api/clientes",
  createProxyMiddleware({
    target: clienteServiceUrl,
    changeOrigin: true,
    pathRewrite: (path) => path.replace("/api/clientes", "/ms-cliente/clientes")
  })
);

// ======================= AEROPORTOS (liberado para testes) ====
// app.use('/api/aeroportos', (req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3040');
//   res.setHeader('Access-Control-Allow-Credentials', 'true');
//   next();
// });
app.get(
  '/api/aeroportos',
  requireRole('TODOS'),
  createProxyMiddleware({
    target: voosServiceUrl,
    changeOrigin: true,
    pathRewrite: path => path.replace('/api/aeroportos', '/ms-voos/aeroportos'),
    onProxyRes: function (proxyRes, req, res) {
      const allowedOrigins = ['http://localhost:3040', 'http://localhost:4200'];
      const origin = req.headers.origin;
      if (allowedOrigins.includes(origin)) {
        proxyRes.headers['Access-Control-Allow-Origin'] = origin;
        proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
      }
    },
  })
);

// ======================= LOGOUT ================================
app.post('/api/logout', function (req, res) {
  res.status(200).json({ auth: false, token: null });
});

// ======================= JWT Token Middleware ==================
const requireJwt = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  requestProperty: 'user'
}).unless({
  path: [
    '/api/login',
    '/api/register',
    '/api/saga/autocadastro',
    '/saga/ms-cliente/cadastrar-cliente',
    '/api/clientes',
  ]
});

app.use("/api", requireJwt);

// ======================= CLIENTE ===============================

app.get(
  '/api/clientes/:codigoCliente',
  requireRole('CLIENTE'),
  createProxyMiddleware({
    target: clienteServiceUrl,
    changeOrigin: true,
    pathRewrite: path => path.replace('/api/clientes/', '/ms-cliente/clientes/'),
  })
);

app.get(
  '/api/clientes/cpf/:cpf',
  requireRole('CLIENTE'),
  createProxyMiddleware({
    target: clienteServiceUrl,
    changeOrigin: true,
    pathRewrite: path => path.replace('/api/clientes/cpf/', '/ms-cliente/cpf/'),
  })
);

app.get(
  '/api/clientes/email/:email',
  requireRole('CLIENTE'),
  createProxyMiddleware({
    target: clienteServiceUrl,
    changeOrigin: true,
    pathRewrite: path => path.replace('/api/clientes/email/', '/ms-cliente/por-email/'),
  })
);

app.get(
  '/api/clientes/:codigoCliente/reservas',
  requireRole('CLIENTE'),
  createProxyMiddleware({
    target: clienteServiceUrl,
    changeOrigin: true,
    pathRewrite: path => path.replace('/api/clientes/', '/ms-cliente/clientes/'),
  })
);

app.put(
  '/api/clientes/:codigoCliente/milhas',
  requireRole('CLIENTE'),
  createProxyMiddleware({
    target: clienteServiceUrl,
    changeOrigin: true,
    pathRewrite: path => path.replace('/api/clientes/', '/ms-cliente/clientes/'),
  })
);

app.get(
  '/api/clientes/:codigoCliente/milhas',
  requireRole('CLIENTE'),
  createProxyMiddleware({
    target: clienteServiceUrl,
    changeOrigin: true,
    pathRewrite: path => path.replace('/api/clientes/', '/ms-cliente/clientes/'),
  })
);

// ======================= FUNCIONARIO ===========================
app.get(
  '/api/funcionarios',
  requireRole('FUNCIONARIO'),
  createProxyMiddleware({
    target: funcionarioServiceUrl,
    changeOrigin: true,
    pathRewrite: path => path.replace('/api/funcionarios', '/ms-funcionario/funcionarios'),
  })
);

app.post(
  '/api/funcionarios',
  requireRole('FUNCIONARIO'),
  createProxyMiddleware({
    target: funcionarioServiceUrl,
    changeOrigin: true,
    pathRewrite: path => path.replace('/api/funcionarios', '/ms-funcionario/funcionarios'),
  })
);

app.put(
  '/api/funcionarios/:codigoFuncionario',
  requireRole('FUNCIONARIO'),
  createProxyMiddleware({
    target: funcionarioServiceUrl,
    changeOrigin: true,
    pathRewrite: path => path.replace('/api/funcionarios/', '/ms-funcionario/funcionarios/'),
  })
);

app.delete(
  '/api/funcionarios/:codigoFuncionario',
  requireRole('FUNCIONARIO'),
  createProxyMiddleware({
    target: funcionarioServiceUrl,
    changeOrigin: true,
    pathRewrite: path => path.replace('/api/funcionarios/', '/ms-funcionario/funcionarios/'),
  })
);

// ======================= RESERVAS ==============================
app.get(
  '/api/reservas/:codigoReserva',
  requireRole('TODOS'),
  createProxyMiddleware({
    target: reservaServiceUrl,
    changeOrigin: true,
    pathRewrite: path => path.replace('/api/reservas/', '/ms-reserva/reservas/'),
  })
);

app.post(
  '/api/reservas',
  requireRole('CLIENTE'),
  createProxyMiddleware({
    target: reservaServiceUrl,
    changeOrigin: true,
    pathRewrite: path => path.replace('/api/reservas', '/ms-reserva/reservas'),
  })
);

app.delete(
  '/api/reservas/:codigoReserva',
  requireRole('CLIENTE'),
  createProxyMiddleware({
    target: reservaServiceUrl,
    changeOrigin: true,
    pathRewrite: path => path.replace('/api/reservas/', '/ms-reserva/reservas/'),
  })
);

app.patch(
  '/api/reservas/:codigoReserva/estado',
  requireRole('CLIENTE'),
  createProxyMiddleware({
    target: reservaServiceUrl,
    changeOrigin: true,
    pathRewrite: path => path.replace('/api/reservas/', '/ms-reserva/'),
  })
);

// ======================= CHECK-IN ==============================
app.patch(
  '/api/reservas/:codigoReserva/checkin',
  requireRole('CLIENTE'),
  createProxyMiddleware({
    target: reservaServiceUrl,
    changeOrigin: true,
    pathRewrite: path => path.replace('/api/reservas/:codigoReserva/checkin', '/ms-reserva/reservas/:codigoReserva/estado'),
    onProxyReq: (proxyReq) => {
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.write(JSON.stringify({ estado: 'CHECK-IN' }));
      proxyReq.end();
    },
  })
);

// ======================= EMBARQUE =============================
app.patch(
  '/api/reservas/:codigoReserva/embarque',
  requireRole('FUNCIONARIO'),
  createProxyMiddleware({
    target: reservaServiceUrl,
    changeOrigin: true,
    pathRewrite: path => path.replace('/api/reservas/:codigoReserva/embarque', '/ms-reserva/reservas/:codigoReserva/estado'),
    onProxyReq: (proxyReq) => {
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.write(JSON.stringify({ estado: 'EMBARCADA' }));
      proxyReq.end();
    },
  })
);

// ======================= VOOS ==================================
app.get(
  '/api/voos',
  requireRole('TODOS'),
  createProxyMiddleware({
    target: voosServiceUrl,
    changeOrigin: true,
    pathRewrite: path => path.replace('/api/voos', '/ms-voos/voos'),
  })
);

app.get(
  '/api/voos/busca',
  requireRole('TODOS'),
  createProxyMiddleware({
    target: voosServiceUrl,
    changeOrigin: true,
    pathRewrite: path => path.replace('/api/voos/busca', '/ms-voos/voos/busca'),
  })
);

app.post(
  '/api/voos',
  requireRole('FUNCIONARIO'),
  createProxyMiddleware({
    target: voosServiceUrl,
    changeOrigin: true,
    pathRewrite: path => path.replace('/api/voos', '/ms-voos/voos'),
  })
);

app.get(
  '/api/voos/:codigoVoo',
  requireRole('TODOS'),
  createProxyMiddleware({
    target: voosServiceUrl,
    changeOrigin: true,
    pathRewrite: path => path.replace('/api/voos/', '/ms-voos/voos/'),
  })
);

app.patch(
  '/api/voos/:codigoVoo/estado',
  requireRole('FUNCIONARIO'),
  createProxyMiddleware({
    target: voosServiceUrl,
    changeOrigin: true,
    pathRewrite: path => path.replace('/api/voos/:codigoVoo/estado', '/ms-voos/voos/:codigoVoo/estado'),
  })
);

app.patch(
  '/api/voos/:codigoVoo/cancelar',
  requireRole('FUNCIONARIO'),
  createProxyMiddleware({
    target: voosServiceUrl,
    changeOrigin: true,
    pathRewrite: path => path.replace('/api/voos/:codigoVoo/cancelar', '/ms-voos/voos/:codigoVoo/estado'),
    onProxyReq: (proxyReq) => {
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.write(JSON.stringify({ estado: 'CANCELADO' }));
      proxyReq.end();
    },
  })
);

app.patch(
  '/api/voos/:codigoVoo/realizar',
  requireRole('FUNCIONARIO'),
  createProxyMiddleware({
    target: voosServiceUrl,
    changeOrigin: true,
    pathRewrite: path => path.replace('/api/voos/:codigoVoo/realizar', '/ms-voos/voos/:codigoVoo/estado'),
    onProxyReq: (proxyReq) => {
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.write(JSON.stringify({ estado: 'REALIZADO' }));
      proxyReq.end();
    },
  })
);

// ======================= AEROPORTOS ============================
// app.get(
//   '/api/aeroportos',
//   requireJwt,
//   requireRole('TODOS'),
//   createProxyMiddleware({
//     target: voosServiceUrl,
//     changeOrigin: true,
//     pathRewrite: path => path.replace('/api/aeroportos', '/ms-voos/aeroportos'),
//   })
// );

// ======================= INIT O SERVIDOR =======================
app.listen(port, () => {
  console.log(`API Gateway in port ${port}`);
});
