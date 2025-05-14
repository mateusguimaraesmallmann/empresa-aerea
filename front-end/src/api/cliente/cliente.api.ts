import axios from 'axios';

export type Cliente = {
  id?: number;
  cpf: string;
  nome: string;
  email: string;
  cep: string;
  ruaNumero: string;
  complemento: string;
  cidade: string;
  uf: string;
  milhas?: number;
  senha: string;
};

// URL base para o microserviço
const API_BASE = 'http://localhost:8080/ms-cliente';

// Envia os dados de um novo cliente para o back
export async function registrarCliente(cliente: Cliente): Promise<Cliente> {
  const response = await axios.post(`${API_BASE}`, cliente);
  return response.data;
}

export async function verificarCpfExiste(cpf: string): Promise<boolean> {
  try {
    await axios.get(`${API_BASE}/${cpf}`);
    return true; // já existe
  } catch {
    return false; // não encontrado
  }
}

export async function verificarEmailExiste(email: string): Promise<boolean> {
  try {
    await axios.get(`${API_BASE}/por-email/${encodeURIComponent(email)}`);
    return true;
  } catch {
    return false;
  }
}