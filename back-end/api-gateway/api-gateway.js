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

// Middlewares globais
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({
  origin: ["http://localhost:4200"],
  credentials: true
}));

// URLs dos serviços
const {
    MS_AUTH_URL,
    MS_CLIENTE_URL,
    MS_FUNCIONARIO_URL,
    MS_RESERVA_URL,
    MS_VOOS_URL
} = process.env;

// Roteamento dos microserviços
app.use("/auth", createProxyMiddleware({ target: MS_AUTH_URL, changeOrigin: true }));
app.use("/cliente", createProxyMiddleware({ target: MS_CLIENTE_URL, changeOrigin: true }));
app.use("/funcionario", createProxyMiddleware({ target: MS_FUNCIONARIO_URL, changeOrigin: true }));
app.use("/reserva", createProxyMiddleware({ target: MS_RESERVA_URL, changeOrigin: true }));
app.use("/voos", createProxyMiddleware({ target: MS_VOOS_URL, changeOrigin: true }));

// Inicia o servidor
app.listen(port, () => {
    console.log(`API Gateway rodando na porta ${port}`);
});

app.post ('/logout', function (req, res) {
    res.json ({ auth: false, token: null }) ;
})