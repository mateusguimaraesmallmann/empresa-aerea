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

// ======================= LOGIN ============================
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

// ======================= LOGOUT ===========================
  app.post ('/logout', function (req, res) {
    res.json ({ auth: false, token: null }) ;
})

// ======================= INIT O SERVIDOR ==================
app.listen(port, () => {
    console.log(`API Gateway rodando na porta ${port}`);
});