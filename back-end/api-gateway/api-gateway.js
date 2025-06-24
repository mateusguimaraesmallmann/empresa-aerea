if (!process.env.MS_AUTH_URL) {
  require('dotenv-safe').config();
}

const express = require('express');
const { expressjwt: jwt } = require('express-jwt');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// ================= MIDDLEWARES GLOBAIS ==================
app.use(helmet());
app.use(morgan('dev'));
app.use(cookieParser());

app.use(cors({
  origin: ['http://localhost:3039', 'http://localhost:3040', 'http://localhost:4200'],
  credentials: true,
}));

// ================= URLs DOS MICROSSERVIÇOS ===============
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

// =================== CONTROLE DE PAPÉIS ==================
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
  bodyParser.json(),
  createProxyMiddleware({
    target: sagaServiceUrl,
    changeOrigin: true,
    pathRewrite: path => path.replace("/api/login", "/saga/auth/login"),
    onProxyReq: (proxyReq, req, res) => {
      if (req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    }
  })
);

// ======================= AUTOCADASTRO ======================
app.post(
  "/api/clientes",
  createProxyMiddleware({
    target: sagaServiceUrl,
    changeOrigin: true,
    pathRewrite: path => path.replace("/api/clientes", "/saga/ms-cliente/clientes"),
    onProxyReq: (proxyReq, req, res) => {
      if (req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    }
  })
);

// ================== MIDDLEWARE JWT =============================
const requireJwt = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  requestProperty: 'user'
}).unless({
  path: [
    '/api/login',
    '/api/clientes'
  ]
});

app.use(requireJwt);
// ======================= ROTAS PRIVADAS ========================

// ======================= LOGOUT ================================
app.post('/api/logout', function (req, res) {
  res.status(200).json({ auth: false, token: null });
});

// ======================= INIT O SERVIDOR =======================
app.listen(port, () => {
  console.log(`API Gateway in port ${port}`);
});