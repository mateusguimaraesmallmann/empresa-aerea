import axios from 'axios';

// Tipo usado no formulário de login
export type LoginPayload = {
  email: string;
  password: string;
};

// Tipo retornado pelo backend após login bem-sucedido
export type TokenResponse = {
  token: string;
  auth: boolean;
  userId: number;
  role: string;
};

// URL base do serviço de autenticação
const API_BASE = 'http://localhost:8080/auth';

export async function loginUsuario(credentials: LoginPayload): Promise<TokenResponse> {
  const response = await axios.post(`${API_BASE}/login`, credentials);
  return response.data;
}