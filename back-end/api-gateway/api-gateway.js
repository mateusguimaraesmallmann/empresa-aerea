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

// ======================= AEROPORTOS (liberado para testes) ====

app.get(
  '/api/aeroportos',
  createProxyMiddleware({
    target: voosServiceUrl,
    changeOrigin: true,
    pathRewrite: path => path.replace('/api/aeroportos', '/ms-voos/aeroportos'),
  })
);

// LISTAR TODOS
app.get(
  '/api/funcionarios',
  createProxyMiddleware({
    target: funcionarioServiceUrl,
    changeOrigin: true,
    pathRewrite: { '^/api/funcionarios$': '/funcionarios' },
  })
);

// CRIAR
app.post(
  '/api/funcionarios',
  createProxyMiddleware({
    target: funcionarioServiceUrl,
    changeOrigin: true,
    pathRewrite: { '^/api/funcionarios$': '/funcionarios' },
    onProxyReq: (proxyReq, req) => {
      if (req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    }
  })
);

// BUSCAR, ATUALIZAR E REMOVER POR CPF
['get', 'put', 'delete'].forEach(method => {
  app[method](
    '/api/funcionarios/:cpf',
    createProxyMiddleware({
      target: funcionarioServiceUrl,
      changeOrigin: true,
      pathRewrite: (path, req) => `/funcionarios/${req.params.cpf}`,
      onProxyReq: (proxyReq, req) => {
        if (['PUT', 'DELETE'].includes(req.method) && req.body) {
          const bodyData = JSON.stringify(req.body);
          proxyReq.setHeader('Content-Type', 'application/json');
          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
        }
      }
    })
  );
});

app.patch(
  '/api/funcionarios/:cpf/inativar',
  createProxyMiddleware({
    target: funcionarioServiceUrl,
    changeOrigin: true,
    pathRewrite: path => path.replace('/api/funcionarios', '/funcionarios'),
  })
);

app.patch(
  '/api/funcionarios/:cpf/reativar',
  createProxyMiddleware({
    target: funcionarioServiceUrl,
    changeOrigin: true,
    pathRewrite: path => path.replace('/api/funcionarios', '/funcionarios'),
  })
);



// app.get(
//   '/api/aeroportos',
//   requireRole('TODOS'),
//   createProxyMiddleware({
//     target: voosServiceUrl,
//     changeOrigin: true,
//     pathRewrite: path => path.replace('/api/aeroportos', '/ms-voos/aeroportos'),
//     onProxyRes: function (proxyRes, req, res) {
//       const allowedOrigins = ['http://localhost:3040', 'http://localhost:4200'];
//       const origin = req.headers.origin;
//       if (allowedOrigins.includes(origin)) {
//         proxyRes.headers['Access-Control-Allow-Origin'] = origin;
//         proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
//       }
//     },
//   })
// );

// ======================= LOGOUT ================================
app.post('/api/logout', function (req, res) {
  res.status(200).json({ auth: false, token: null });
});

// ======================= JWT Token Middleware ==================
// const requireJwt = jwt({
//   secret: process.env.JWT_SECRET,
//   algorithms: ['HS256'],
//   requestProperty: 'user'
// }).unless({
//   path: [
//     '/api/login',
//     '/api/register',
//     '/api/saga/autocadastro',
//     '/api/clientes',
//     '/api/aeroportos',
//     '/api/voos',
//     '/api/voos/listar'
//   ]
// });

// app.use("/api", requireJwt);

app.get(
  '/api/voos/listar',
  createProxyMiddleware({
    target: voosServiceUrl,
    changeOrigin: true,
    pathRewrite: path => path.replace('/api/voos/listar', '/ms-voos/voos/listar'),
  })
);

app.patch(
  '/api/voos/:codigoVoo/cancelar',
  createProxyMiddleware({
    target: voosServiceUrl,
    changeOrigin: true,
    pathRewrite: (path, req) => {
      const codigoVoo = req.params.codigoVoo;
      return `/ms-voos/voos/${codigoVoo}/estado`;
    },
    onProxyReq: (proxyReq) => {
      const body = JSON.stringify('CANCELADO');
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(body));
      proxyReq.write(body);
      proxyReq.end();
    },
  })
);

// ================== MIDDLEWARE JWT =============================
/* LOGICA USADA POR MIM APENAS PARA OS ENDPOINTS DE LOGIN E AUTOCADASTRO
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
*/

// ================== MIDDLEWARE JWT =============================
const requireJwt = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  requestProperty: 'user'
}).unless({
  path: [
    /^\/api\/login/,
    /^\/api\/register/,
    /^\/api\/saga\/autocadastro/,
    /^\/api\/clientes/,
    /^\/api\/aeroportos/,
    /^\/api\/voos\/listar\/?$/,   // <- aceita /api/voos/listar e /api/voos/listar/
    /^\/api\/voos$/,              // <- evita bloquear GET /api/voos com query params
    /^\/api\/voos\/[^/]+\/cancelar$/,
    /^\/api\/funcionarios$/,
    /^\/api\/funcionarios\/[^/]+$/,
    /^\/api\/reservas\/?$/,                // Para testes
    /^\/api\/reservas\/[^/]+\/?$/,         // GET, DELETE, com/sem barra no final
    /^\/api\/reservas\/[^/]+\/estado\/?$/,
    /^\/api\/funcionarios\/[^/]+\/inativar$/,
    /^\/api\/funcionarios\/[^/]+\/reativar$/
  ]
});

app.use(requireJwt);
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

// app.get(
//   '/api/clientes/:codigoCliente/reservas',
//   // requireRole('CLIENTE'),
//   createProxyMiddleware({
//     target: clienteServiceUrl,
//     changeOrigin: true,
//     pathRewrite: path => path.replace('/api/clientes/', '/ms-cliente/clientes/'),
//   })
// );

app.get(
  '/api/clientes/:codigoCliente/reservas',
  // requireRole('CLIENTE'), 
  createProxyMiddleware({
    target: reservaServiceUrl,
    changeOrigin: true,
    pathRewrite: (path, req) => {
      return `/ms-reserva/reservas?clienteId=${req.params.codigoCliente}`;
    },
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

// // LISTAR TODOS
// app.get(
//   '/api/funcionarios',
//   // requireRole('FUNCIONARIO'),
//   createProxyMiddleware({
//     target: funcionarioServiceUrl,
//     changeOrigin: true,
//     pathRewrite: { '^/api/funcionarios$': '/ms-funcionario' },
//   })
// );

// // CRIAR
// app.post(
//   '/api/funcionarios',
//   // requireRole('FUNCIONARIO'),
//   createProxyMiddleware({
//     target: funcionarioServiceUrl,
//     changeOrigin: true,
//     pathRewrite: { '^/api/funcionarios$': '/ms-funcionario' },
//   })
// );

// // BUSCAR, ATUALIZAR E REMOVER POR CPF
// ['get','put','delete'].forEach(method => {
//   app[method](
//     '/api/funcionarios/:cpf',
//     // requireRole('FUNCIONARIO'),
//     createProxyMiddleware({
//       target: funcionarioServiceUrl,
//       changeOrigin: true,
//       pathRewrite: { '^/api/funcionarios': '/ms-funcionario' },
//     })
//   );
// });

// ======================= RESERVAS ==============================

// CONSULTA RESERVA POR CÓDIGO (GET)
app.get(
  '/api/reservas/:codigoReserva',
  // requireRole('TODOS'),
  createProxyMiddleware({
    target: reservaServiceUrl,
    changeOrigin: true,
    pathRewrite: path => path.replace('/api/reservas/', '/ms-reserva/reservas/'),
  })
);

// CRIAR RESERVA (POST)
app.post(
  '/api/reservas',
  createProxyMiddleware({
    target: reservaServiceUrl,
    changeOrigin: true,
    pathRewrite: path => path.replace('/api/reservas', '/ms-reserva/reservas'),
    onProxyReq: (proxyReq, req) => {
      // Este trecho já garante que o body está indo para o backend
      if (req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    }
  })
);

// REMOVER RESERVA (DELETE)
app.delete(
  '/api/reservas/:codigoReserva',
  // requireRole('CLIENTE'),
  createProxyMiddleware({
    target: reservaServiceUrl,
    changeOrigin: true,
    pathRewrite: path => path.replace('/api/reservas/', '/ms-reserva/reservas/'),
  })
);

// LISTAGEM DE RESERVAS (GET) - para trazer todas ou usar filtro por clienteId (exemplo com query param)
app.get(
  '/api/reservas',
  createProxyMiddleware({
    target: reservaServiceUrl,
    changeOrigin: true,
    pathRewrite: path => path.replace('/api/reservas', '/ms-reserva/reservas'),
  })
);

app.patch(
  '/api/reservas/:codigoReserva/estado',
  // requireRole('CLIENTE'),
  createProxyMiddleware({
    target: reservaServiceUrl,
    changeOrigin: true,
    pathRewrite: path => path.replace('/api/reservas/', '/ms-reserva/'),
  })
);

// ======================= CHECK-IN ==============================
app.patch(
  '/api/reservas/:codigoReserva/checkin',
  // requireRole('CLIENTE'),
  createProxyMiddleware({
    target: reservaServiceUrl,
    changeOrigin: true,
    pathRewrite: (path, req) => path.replace(
      '/api/reservas/' + req.params.codigoReserva + '/checkin',
      '/ms-reserva/reservas/' + req.params.codigoReserva + '/estado'
    ),
    onProxyReq: (proxyReq) => {
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.write(JSON.stringify({ estado: 'CHECK_IN' }));
      proxyReq.end();
    },
  })
);

// ======================= EMBARQUE =============================
app.patch(
  '/api/reservas/:codigoReserva/embarque',
  // requireRole('FUNCIONARIO'),
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

// COMENTADO PARA EVITAR AUTENTICAÇÃO
// app.post(
//   '/api/voos',
//   requireRole('FUNCIONARIO'),
//   createProxyMiddleware({
//     target: voosServiceUrl,
//     changeOrigin: true,
//     pathRewrite: path => path.replace('/api/voos', '/ms-voos/voos'),
//   })
// );

app.post(
  '/api/voos',
  createProxyMiddleware({
    target: voosServiceUrl,
    changeOrigin: true,
    pathRewrite: path => path.replace('/api/voos', '/ms-voos/voos'),
    onProxyReq: (proxyReq, req) => {
      if (req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    }
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

// app.patch(
//   '/api/voos/:codigoVoo/cancelar',
//   // requireRole('FUNCIONARIO'),
//   createProxyMiddleware({
//     target: voosServiceUrl,
//     changeOrigin: true,
//     pathRewrite: path => path.replace('/api/voos/:codigoVoo/cancelar', '/ms-voos/voos/:codigoVoo/estado'),
//     onProxyReq: (proxyReq) => {
//       proxyReq.setHeader('Content-Type', 'application/json');
//       proxyReq.write(JSON.stringify({ estado: 'CANCELADO' }));
//       proxyReq.end();
//     },
//   })
// );

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

// app.get(
//   '/api/voos/listar',
//   createProxyMiddleware({
//     target: voosServiceUrl,
//     changeOrigin: true,
//     pathRewrite: path => path.replace('/api/voos/listar', '/ms-voos/voos/listar'),
//   })
// );

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
