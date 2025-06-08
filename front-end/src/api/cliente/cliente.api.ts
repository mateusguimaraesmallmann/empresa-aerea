import api from 'src/api/api';

export type Cliente = {
  id?: number;
  cpf: string;
  nome: string;
  email: string;
  tipo: string;
  endereco: {
    cep: string;
    rua: string;
    bairro: string;
    numero: string;
    complemento: string;
    cidade: string;
    estado: string;
  };
};

// Envia os dados de um novo cliente para o backend via Gateway
export async function registrarCliente(cliente: Cliente): Promise<Cliente> {
  const response = await api.post('/clientes', cliente);
  return response.data;
}

// Verifica se o CPF já está cadastrado
export async function verificarCpfExiste(cpf: string): Promise<boolean> {
  try {
    await api.get(`/clientes/cpf/${cpf}`);
    return true;
  } catch {
    return false;
  }
}

// Verifica se o e-mail já está cadastrado
export async function verificarEmailExiste(email: string): Promise<boolean> {
  try {
    await api.get(`/clientes/email/${encodeURIComponent(email)}`);
    return true;
  } catch {
    return false;
  }
}

// Autocadastro
export async function autocadastrarCliente(cliente: Cliente): Promise<{ senha: string }> {
  const response = await api.post('/saga/autocadastro', cliente);
  return response.data;
}