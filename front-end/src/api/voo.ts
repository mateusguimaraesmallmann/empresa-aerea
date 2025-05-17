import api from 'src/api/api';

// Modelo do voo 
export interface Voo {
  codigo: string;
  origem: string;
  destino: string;
  dataHora: string;
  totalAssentos: number;
  assentosDisponiveis: number;
  valorReais: number;
  estado: 'CRIADO' | 'CANCELADO' | 'REALIZADO';
}

// DTO para criação de voo
export type CriarVooDTO = Omit<Voo, 'codigo' | 'estado' | 'assentosDisponiveis'>;

// Estado do voo 
export type EstadoVoo = 'CRIADO' | 'CANCELADO' | 'REALIZADO';

// Modelo de aeroporto
export interface Aeroporto {
  codigo: string;
  nome: string;
  cidade: string;
  estado: string;
}

// POST /api/voos — criar voo (FUNCIONARIO)
export async function criarVoo(dados: CriarVooDTO): Promise<Voo> {
  const response = await api.post<Voo>('/voos', dados);
  return response.data;
}

// GET /api/voos — listar todos os voos (TODOS)
export async function listarVoos(): Promise<Voo[]> {
  const response = await api.get<Voo[]>('/voos');
  return response.data;
}

// GET /api/voos/busca — buscar voos por origem/destino (TODOS)
export async function buscarVoos(origem?: string, destino?: string): Promise<Voo[]> {
  const params: Record<string, string> = {};
  if (origem) params.origem = origem;
  if (destino) params.destino = destino;

  const response = await api.get<Voo[]>('/voos/busca', { params });
  return response.data;
}

// GET /api/voos/:codigoVoo — buscar voo por código (TODOS)
export async function buscarVooPorCodigo(codigoVoo: string): Promise<Voo> {
  const response = await api.get<Voo>(`/voos/${codigoVoo}`);
  return response.data;
}

// PATCH /api/voos/:codigoVoo/estado — atualizar estado (FUNCIONARIO)
export async function atualizarEstadoVoo(codigoVoo: string, novoEstado: EstadoVoo): Promise<Voo> {
  const response = await api.patch<Voo>(`/voos/${codigoVoo}/estado`, novoEstado, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
}

// PATCH /api/voos/:codigoVoo/cancelar — cancelar voo (FUNCIONARIO)
export async function cancelarVoo(codigoVoo: string): Promise<Voo> {
  const response = await api.patch<Voo>(`/voos/${codigoVoo}/cancelar`);
  return response.data;
}

// PATCH /api/voos/:codigoVoo/realizar — marcar voo como realizado (FUNCIONARIO)
export async function realizarVoo(codigoVoo: string): Promise<Voo> {
  const response = await api.patch<Voo>(`/voos/${codigoVoo}/realizar`);
  return response.data;
}

// GET /api/aeroportos — listar aeroportos (TODOS)
export async function listarAeroportos(): Promise<Aeroporto[]> {
  const response = await api.get<Aeroporto[]>('/aeroportos');
  return response.data;
}
