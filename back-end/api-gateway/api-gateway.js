require('dotenv-safe').config();
const express = require('express');
const { expressjwt: jwt } = require('express-jwt');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const sagaServiceUrl = process.env.MS_SAGA_URL;

const app = express();
const port = process.env.PORT || 3000;

// Middlewares globais
app.use(helmet());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: ['http://localhost:4200'], credentials: true }));

// URLs dos microsserviços
const authServiceUrl = process.env.MS_AUTH_URL;
const clienteServiceUrl = process.env.MS_CLIENTE_URL;
const funcionarioServiceUrl = process.env.MS_FUNCIONARIO_URL;
const reservaServiceUrl = process.env.MS_RESERVA_URL;
const voosServiceUrl = process.env.MS_VOOS_URL;

// Verificação das variáveis 
if (!authServiceUrl || !clienteServiceUrl || !funcionarioServiceUrl || !reservaServiceUrl || !voosServiceUrl || sagaServiceUrl) {
  console.error(" ❌ Alguma variável de ambiente obrigatória está faltando.");
  process.exit(1);
}

// ======================= LOGIN =================================
app.post("/api/login",
  createProxyMiddleware({
    target: authServiceUrl,
    changeOrigin: true,
    pathRewrite: path => path.replace("/api/login", "/auth/login")
  })
);

// ======================= JWT Token Middleware ==================
const requireJwt = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  requestProperty: 'user'
});

// ======================= Cadastro Cliente ======================
app.post(
  "/api/clientes",
  createProxyMiddleware({
    target: clienteServiceUrl,
    changeOrigin: true,
    pathRewrite: (path) => path.replace("/api/clientes", "/ms-cliente/clientes")
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

// ======================= LOGOUT ================================
app.post('/api/logout', function (req, res) {
  res.status(200).json({ auth: false, token: null });
});

// Middleware de proteção JWT
app.use("/api", requireJwt);

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

// ======================= CLIENTE ===============================

app.get(
  '/api/clientes/:codigoCliente',
  requireJwt,
  requireRole('CLIENTE'),
  createProxyMiddleware({
    target: clienteServiceUrl,
    changeOrigin: true,
    pathRewrite: path => path.replace('/api/clientes/', '/ms-cliente/clientes/'),
  })
);

app.get(
  '/api/clientes/cpf/:cpf',
  requireJwt,
  requireRole('CLIENTE'),
  createProxyMiddleware({
    target: clienteServiceUrl,
    changeOrigin: true,
    pathRewrite: path => path.replace('/api/clientes/cpf/', '/ms-cliente/cpf/'),
  })
);

app.get(
  '/api/clientes/email/:email',
  requireJwt,
  requireRole('CLIENTE'),
  createProxyMiddleware({
    target: clienteServiceUrl,
    changeOrigin: true,
    pathRewrite: path => path.replace('/api/clientes/email/', '/ms-cliente/por-email/'),
  })
);

app.get(
  '/api/clientes/:codigoCliente/reservas',
  requireJwt,
  requireRole('CLIENTE'),
  createProxyMiddleware({
    target: clienteServiceUrl,
    changeOrigin: true,
    pathRewrite: path => path.replace('/api/clientes/', '/ms-cliente/clientes/'),
  })
);

app.put(
  '/api/clientes/:codigoCliente/milhas',
  requireJwt,
  requireRole('CLIENTE'),
  createProxyMiddleware({
    target: clienteServiceUrl,
    changeOrigin: true,
    pathRewrite: path => path.replace('/api/clientes/', '/ms-cliente/clientes/'),
  })
);

app.get(
  '/api/clientes/:codigoCliente/milhas',
  requireJwt,
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
  requireJwt,
  requireRole('FUNCIONARIO'),
  createProxyMiddleware({
    target: funcionarioServiceUrl,
    changeOrigin: true,
    pathRewrite: path => path.replace('/api/funcionarios', '/ms-funcionario/funcionarios'),
  })
);

app.post(
  '/api/funcionarios',
  requireJwt,
  requireRole('FUNCIONARIO'),
  createProxyMiddleware({
    target: funcionarioServiceUrl,
    changeOrigin: true,
    pathRewrite: path => path.replace('/api/funcionarios', '/ms-funcionario/funcionarios'),
  })
);

app.put(
  '/api/funcionarios/:codigoFuncionario',
  requireJwt,
  requireRole('FUNCIONARIO'),
  createProxyMiddleware({
    target: funcionarioServiceUrl,
    changeOrigin: true,
    pathRewrite: path => path.replace('/api/funcionarios/', '/ms-funcionario/funcionarios/'),
  })
);

app.delete(
  '/api/funcionarios/:codigoFuncionario',
  requireJwt,
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
  requireJwt,
  requireRole('TODOS'),
  createProxyMiddleware({
    target: reservaServiceUrl,
    changeOrigin: true,
    pathRewrite: path => path.replace('/api/reservas/', '/ms-reserva/reservas/'),
  })
);

app.post(
  '/api/reservas',
  requireJwt,
  requireRole('CLIENTE'),
  createProxyMiddleware({
    target: reservaServiceUrl,
    changeOrigin: true,
    pathRewrite: path => path.replace('/api/reservas', '/ms-reserva/reservas'),
  })
);

app.delete(
  '/api/reservas/:codigoReserva',
  requireJwt,
  requireRole('CLIENTE'),
  createProxyMiddleware({
    target: reservaServiceUrl,
    changeOrigin: true,
    pathRewrite: path => path.replace('/api/reservas/', '/ms-reserva/reservas/'),
  })
);

app.patch(
  '/api/reservas/:codigoReserva/estado',
  requireJwt,
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
  requireJwt,
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
  requireJwt,
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
  requireJwt,
  requireRole('TODOS'),
  createProxyMiddleware({
    target: voosServiceUrl,
    changeOrigin: true,
    pathRewrite: path => path.replace('/api/voos', '/ms-voos/voos'),
  })
);

app.get(
  '/api/voos/busca',
  requireJwt,
  requireRole('TODOS'),
  createProxyMiddleware({
    target: voosServiceUrl,
    changeOrigin: true,
    pathRewrite: path => path.replace('/api/voos/busca', '/ms-voos/voos/busca'),
  })
);

app.post(
  '/api/voos',
  requireJwt,
  requireRole('FUNCIONARIO'),
  createProxyMiddleware({
    target: voosServiceUrl,
    changeOrigin: true,
    pathRewrite: path => path.replace('/api/voos', '/ms-voos/voos'),
  })
);

app.get(
  '/api/voos/:codigoVoo',
  requireJwt,
  requireRole('TODOS'),
  createProxyMiddleware({
    target: voosServiceUrl,
    changeOrigin: true,
    pathRewrite: path => path.replace('/api/voos/', '/ms-voos/voos/'),
  })
);

app.patch(
  '/api/voos/:codigoVoo/estado',
  requireJwt,
  requireRole('FUNCIONARIO'),
  createProxyMiddleware({
    target: voosServiceUrl,
    changeOrigin: true,
    pathRewrite: path => path.replace('/api/voos/:codigoVoo/estado', '/ms-voos/voos/:codigoVoo/estado'),
  })
);

app.patch(
  '/api/voos/:codigoVoo/cancelar',
  requireJwt,
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
  requireJwt,
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
app.get(
  '/api/aeroportos',
  requireJwt,
  requireRole('TODOS'),
  createProxyMiddleware({
    target: voosServiceUrl,
    changeOrigin: true,
    pathRewrite: path => path.replace('/api/aeroportos', '/ms-voos/aeroportos'),
  })
);

// ======================= INIT O SERVIDOR =======================
app.listen(port, () => {
  console.log(`API Gateway in port ${port}`);
});