import api from './api'; // importa a instância configurada do axios

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

// Envia os dados de um novo cliente para o backend via Gateway
export async function registrarCliente(cliente: Cliente): Promise<Cliente> {
  const response = await api.post('/clientes', cliente);
  return response.data;
}

// Verifica se o CPF já está cadastrado
export async function verificarCpfExiste(cpf: string): Promise<boolean> {
  try {
    await api.get(`/clientes/${cpf}`);
    return true;
  } catch {
    return false;
  }
}

//Verifica se o e-mail já está cadastrado

export async function verificarEmailExiste(email: string): Promise<boolean> {
  try {
    await api.get(`/clientes/por-email/${encodeURIComponent(email)}`);
    return true;
  } catch {
    return false;
  }
}