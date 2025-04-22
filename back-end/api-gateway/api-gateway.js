require("dotenv-safe").config();
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({ origin: ["http://localhost:4200"], credentials: true, }));

const authServiceUrl = process.env.MS_AUTH_URL;
const clienteServiceUrl = process.env.MS_CLIENTE_URL;
const funcionarioServiceUrl = process.env.MS_FUNCIONARIO_URL;
const reservaServiceUrl = process.env.MS_RESERVA_URL;
const voosServiceUrl = process.env.MS_VOOS_URL;

// ======================= LOGIN =================================
app.post(
    "/api/login",
    createProxyMiddleware({
      target: authServiceUrl,
      changeOrigin: true,
      pathRewrite: {
        "^/api/login": "/auth/login",
      },
    })
);

// ======================= LOGOUT ================================
  app.post ('/logout', function (req, res) {
    res.json ({ auth: false, token: null }) ;
})

// ======================= CLIENTE ===============================

app.post(
  "/api/clientes",
  createProxyMiddleware({
    target: clienteServiceUrl,
    changeOrigin: true,
    pathRewrite: (path) => path.replace("/api/clientes", "/ms-cliente/clientes")
  })
);

app.get(
  "/api/clientes/:codigoCliente",
  createProxyMiddleware({
    target: clienteServiceUrl,
    changeOrigin: true,
    pathRewrite: (path) =>  path.replace("/api/clientes/", "/ms-cliente/clientes/")
  })
);

app.get(
  "/api/clientes/:codigoCliente/reservas",
  createProxyMiddleware({
    target: clienteServiceUrl,
    changeOrigin: true,
    pathRewrite: (path) => path.replace("/api/clientes/", "/ms-cliente/clientes/")
  })
);

app.put(
  "/api/clientes/:codigoCliente/milhas",
  createProxyMiddleware({
    target: clienteServiceUrl,
    changeOrigin: true,
    pathRewrite: (path) => path.replace("/api/clientes/", "/ms-cliente/clientes/")
  })
);

app.get(
  "/api/clientes/:codigoCliente/milhas",
  createProxyMiddleware({
    target: clienteServiceUrl,
    changeOrigin: true,
    pathRewrite: (path) => path.replace("/api/clientes/", "/ms-cliente/clientes/")
  })
);

// ======================= FUNCIONARIO ===========================

app.get(
  "/api/funcionarios",
  createProxyMiddleware({
    target: funcionarioServiceUrl,
    changeOrigin: true,
    pathRewrite: (path) => path.replace("/api/funcionarios", "/ms-funcionario/funcionarios")
  })
);

app.post(
  "/api/funcionarios",
  createProxyMiddleware({
    target: funcionarioServiceUrl,
    changeOrigin: true,
    pathRewrite: (path) => path.replace("/api/funcionarios", "/ms-funcionario/funcionarios")
  })
);

app.put(
  "/api/funcionarios/:codigoFuncionario",
  createProxyMiddleware({
    target: funcionarioServiceUrl,
    changeOrigin: true,
    pathRewrite: (path) => path.replace("/api/funcionarios/", "/ms-funcionario/funcionarios")
  })
);

app.delete(
  "/api/funcionarios/:codigoFuncionario",
  createProxyMiddleware({
    target: funcionarioServiceUrl,
    changeOrigin: true,
    pathRewrite: (path) => path.replace("/api/funcionarios/", "/ms-funcionario/funcionarios")
  })
);
// ======================= RESERVAR ==============================

app.get(
  "/api/reservas/:codigoReserva",
  createProxyMiddleware({
    target: reservaServiceUrl,
    changeOrigin: true,
    pathRewrite: (path) => path.replace("/api/reservas/", "/ms-reserva/reservas")
  })
);

app.post(
  "/api/reservas",
  createProxyMiddleware({
    target: reservaServiceUrl,
    changeOrigin: true,
    pathRewrite: (path) => path.replace("/api/reservas", "/ms-reserva/reservas")
  })
);

app.delete(
  "/api/reservas/:codigoReserva",
  createProxyMiddleware({
    target: reservaServiceUrl,
    changeOrigin: true,
    pathRewrite: (path) =>  path.replace("/api/reservas/", "/ms-reserva/reservas")
  })
);

app.patch(
  "/api/reservas/:codigoReserva/estado",
  createProxyMiddleware({
    target: reservaServiceUrl,
    changeOrigin: true,
    pathRewrite: (path) => path.replace("/api/reservas/", "/ms-reserva/reservas/")
  })
);

// ======================= VOOS ==================================

app.post(
  "/api/voos",
  createProxyMiddleware({
    target: voosServiceUrl,
    changeOrigin: true,
    pathRewrite: (path) => path.replace("/api/voos", "/ms-voos/voos")
  })
);

app.get(
  "/api/voos",
  createProxyMiddleware({
    target: voosServiceUrl,
    changeOrigin: true,
    pathRewrite: (path) => path.replace("/api/voos", "/ms-voos/voos")
  })
);

app.get(
  "/api/voos/:codigoVoo",
  createProxyMiddleware({
    target: voosServiceUrl,
    changeOrigin: true,
    pathRewrite: (path) => path.replace("/api/voos/", "/ms-voos/voos/")
  })
);

app.patch(
  "/api/voos/:codigoVoo/estado",
  createProxyMiddleware({
    target: voosServiceUrl,
    changeOrigin: true,
    pathRewrite: (path) => path.replace("/api/voos/", "/ms-voos/voos/")
  })
);

// ======================= AEROPORTOS ============================

app.get(
  "/api/aeroportos",
  createProxyMiddleware({
    target: voosServiceUrl,
    changeOrigin: true,
    pathRewrite: (path) => path.replace("/api/aeroportos", "/ms-voos/aeroportos")
  })
);

app.get(
  "/api/voos/busca",
  createProxyMiddleware({
    target: voosServiceUrl,
    changeOrigin: true,
    pathRewrite: (path) => path.replace("/api/voos/busca", "/ms-voos/voos/busca")
  })
);


// ======================= INIT O SERVIDOR =======================
app.listen(port, () => {
    console.log(`API Gateway in port ${port}`);
});