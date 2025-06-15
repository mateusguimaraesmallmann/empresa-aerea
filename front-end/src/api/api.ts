import axios, { AxiosInstance } from 'axios';

// Cria uma instância do axios com a baseURL do Gateway
const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api',  // <-- Gateway
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token JWT (se existir) no cabeçalho Authorization,
// exceto para rotas públicas como /voos/listar
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  // Verifica se a URL NÃO é de rota pública
  const isPublicRoute =
    config.url?.includes('/voos/listar') ||
    config.url?.includes('/aeroportos');

  if (token && !isPublicRoute) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
})


export default api;