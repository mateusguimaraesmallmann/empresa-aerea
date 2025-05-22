import api from 'src/api/api';

// Modelo de aeroporto
export interface Aeroporto {
  codigo: string;
  nome: string;
  cidade: string;
  estado: string;
}

// Modelo de voo conforme o DTO do back
export interface Voo {
  codigo: string;
  data: string;
  valor_passagem: number;
  quantidade_poltronas_total: number;
  quantidade_poltronas_ocupadas: number;
  estado: 'CONFIRMADO' | 'CANCELADO' | 'REALIZADO';
  aeroporto_origem: Aeroporto;
  aeroporto_destino: Aeroporto;
}

// Estado do voo 
export type EstadoVoo = 'CONFIRMADO' | 'CANCELADO' | 'REALIZADO';

// DTO para criar voo (formulário)
export interface CriarVooDTO {
  id: string;
  codigo: string;
  dataHora: string;
  origem: string; 
  destino: string; 
  valorReais: number;
  poltronas: number;
}

// Resposta da busca de voos
export interface BuscarVoosResponse {
  data: string;
  origem: string;
  destino: string;
  voos: Voo[];
}

// POST /voos — criar voo
export async function criarVoo(dados: CriarVooDTO): Promise<Voo> {
  const response = await api.post<Voo>('/voos', dados);
  return response.data;
}

// GET /voos — buscar voos por data, origem e destino
export async function buscarVoos(data: string, origem: string, destino: string): Promise<BuscarVoosResponse> {
  const params = { data, origem, destino };
  const response = await api.get<BuscarVoosResponse>('/voos', { params });
  return response.data;
}

// GET /voos/:codigoVoo — buscar voo por código
export async function buscarVooPorCodigo(codigoVoo: string): Promise<Voo> {
  const response = await api.get<Voo>(`/voos/${codigoVoo}`);
  return response.data;
}

//voos/:codigoVoo/estado — atualizar estado do voo
export async function atualizarEstadoVoo(codigoVoo: string, novoEstado: EstadoVoo): Promise<Voo> {
  const response = await api.patch<Voo>(`/voos/${codigoVoo}/estado`, novoEstado, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
}

// GET /aeroportos — listar aeroportos disponíveis
export async function listarAeroportos(): Promise<Aeroporto[]> {
  const response = await api.get<Aeroporto[]>('/aeroportos');
  return response.data;
}