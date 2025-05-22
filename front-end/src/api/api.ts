import axios from 'axios';

// Cria uma instância do axios com a baseURL do Gateway
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Adiciona token JWT (se existir) no cabeçalho Authorization
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;