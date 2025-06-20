import api from 'src/api/api';

export type LoginPayload = {
  login: string;
  senha: string;
};

export type TokenResponse = {
  token: string;
  auth: boolean;
  userId: number;
  tipo: string;
};

// Realiza login no sistema via API Gateway
export async function loginUsuario(credentials: LoginPayload): Promise<TokenResponse> {
  const response = await api.post('/login', credentials);
  return response.data;
}
