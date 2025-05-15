import api from './api';

export type LoginPayload = {
  email: string;
  password: string;
};

export type TokenResponse = {
  token: string;
  auth: boolean;
  userId: number;
  role: string;
};

//Realiza login no sistema via API Gateway
export async function loginUsuario(credentials: LoginPayload): Promise<TokenResponse> {
  const response = await api.post('/login', credentials);
  return response.data;
}
