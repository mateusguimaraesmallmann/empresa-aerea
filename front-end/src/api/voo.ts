import api from 'src/api/api';

// Modelo de aeroporto
export interface Aeroporto {
  codigo: string;
  nome: string;
  cidade: string;
  estado: string;
}

// Modelo de voo conforme o back-end
export interface Voo {
  codigo: string;
  dataHora: string;
  preco: number;
  poltronas: number;
  poltronasOcupadas: number;
  estado: 'CONFIRMADO' | 'CANCELADO' | 'REALIZADO';
  origem: Aeroporto;
  destino: Aeroporto;
  id: string;
}

// POST /voos — criar voo
export async function criarVoo(dados: Voo): Promise<Voo> {
  const response = await api.post<Voo>('/voos', dados);
  return response.data;
}

// GET /voos — buscar voos por data, origem e destino
export async function buscarVoos(data: string, origem: string, destino: string) {
  const params = { data, origem, destino };
  const response = await api.get('/voos', { params });
  return response.data;
}

// GET /voos/:codigoVoo — buscar voo por código
export async function buscarVooPorCodigo(codigoVoo: string): Promise<Voo> {
  const response = await api.get<Voo>(`/voos/${codigoVoo}`);
  return response.data;
}

// PATCH /voos/:codigoVoo/estado — atualizar estado do voo
export async function atualizarEstadoVoo(codigoVoo: string, novoEstado: 'CONFIRMADO' | 'CANCELADO' | 'REALIZADO'): Promise<Voo> {
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