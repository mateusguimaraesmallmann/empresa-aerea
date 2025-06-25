import api from 'src/api/api';

export type Cliente = {
  id?: number;
  cpf: string;
  nome: string;
  email: string;
  senha?: string;
  tipo: string;
  endereco: {
    cep: string;
    rua: string;
    bairro: string;
    numero: string;
    complemento: string;
    cidade: string;
    uf: string;
  };
};

// Envia os dados de um novo cliente para o backend via Gateway (cadastro REST normal)
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

// Autocadastro: envia cliente com campo senha vazio, obrigatório para o ms-auth
export async function autocadastrarCliente(cliente: Cliente): Promise<{ cliente: Cliente; senhaGerada: string }> {
  const payload = { ...cliente, senha: '' }; // garante campo obrigatório para backend
  const response = await api.post('/clientes', payload);
  return response.data;
}
