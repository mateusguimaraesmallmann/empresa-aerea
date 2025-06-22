import api from 'src/api/api';

export type LoginPayload = {
  login: string;
  senha: string;
};

export type TokenResponse = {
  access_token: string;
  tipo: string;
  token_type: string;
  usuario: {
    id: number | string;
    email: string;
  };
};

// Realiza login no sistema via API Gateway
export async function loginUsuario(credentials: LoginPayload): Promise<TokenResponse> {
  const response = await api.post('/login', credentials);
  return response.data;
}
