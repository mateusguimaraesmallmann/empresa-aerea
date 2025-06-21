import api from 'src/api/api';
import { Funcionario } from '../../sections/funcionario/types/funcionario';


// R16: Listar todos os funcionários
export async function listarFuncionarios(): Promise<Funcionario[]> {
  const response = await api.get<Funcionario[]>('/funcionarios');
  return response.data;
}

// R17: Criar novo funcionário
export async function criarFuncionario(
  dados: Omit<Funcionario, 'ativo'>
): Promise<Funcionario> {
  const response = await api.post<Funcionario>('/funcionarios', dados);
  return response.data;
}

// R18: Atualizar funcionário (exceto CPF)
export async function atualizarFuncionario(
  codigoFuncionario: string,
  dados: Partial<Omit<Funcionario, 'cpf'>>
): Promise<Funcionario> {
  const response = await api.put<Funcionario>(`/funcionarios/${codigoFuncionario}`, dados);
  return response.data;
}

// Buscar funcionário por CPF
export async function buscarFuncionarioPorCpf(cpf: string): Promise<Funcionario> {
  const response = await api.get<Funcionario>(`/funcionarios/${cpf}`);
  return response.data;
}

// R19: Inativar funcionário (remoção via DELETE)
export async function deletarFuncionario(codigoFuncionario: string): Promise<void> {
  await api.delete(`/funcionarios/${codigoFuncionario}`);
}

// método para inativar
export async function inativarFuncionario(cpf: string): Promise<Funcionario> {
  const response = await api.patch<Funcionario>(`/funcionarios/${cpf}/inativar`, {});
  return response.data;
}

// método para reativar
export async function reativarFuncionario(cpf: string): Promise<Funcionario> {
  const response = await api.patch<Funcionario>(`/funcionarios/${cpf}/reativar`, {});
  return response.data;
}