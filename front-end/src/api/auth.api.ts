import api from 'src/api/api';

export type LoginPayload = {
  login: string;
  password: string;
};

export type TokenResponse = {
  access_token: string;
  token_type: string;
  tipo: 'CLIENTE' | 'FUNCIONARIO';
  usuario: any;
};

// Realiza login no sistema via API Gateway
export async function loginUsuario(credentials: LoginPayload): Promise<TokenResponse> {
  const response = await api.post('/login', credentials);
  return response.data;
}
