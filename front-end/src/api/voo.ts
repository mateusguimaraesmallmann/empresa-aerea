import api from 'src/api/api';
import axios from 'axios';

// Modelo de aeroporto
export interface Aeroporto {
  codigoAeroporto: string;
  nome: string;
  cidade: string;
  estado: string;
}

// Modelo completo de voo (usado em listagens e atualizações)
export interface Voo {
  id: string;
  codigo: string;
  dataHora: string;
  preco: number;
  poltronas: number;
  poltronasOcupadas: number;
  estado: 'CONFIRMADO' | 'CANCELADO' | 'REALIZADO';
  origem: Aeroporto;
  destino: Aeroporto;
}

// DTO para criação de voo (envio no cadastro)
export interface CriarVooDTO {
  id: string;
  codigo: string;
  dataHora: string;
  origemCodigo: string;
  destinoCodigo: string;
  preco: number;
  poltronas: number;
  poltronasOcupadas: number;
  estado: 'CONFIRMADO' | 'CANCELADO' | 'REALIZADO';
}

// POST /voos — criar voo
export async function criarVoo(dados: CriarVooDTO): Promise<Voo> {
  const response = await api.post<Voo>('/voos', dados);
  return response.data;
}

// GET /voos — buscar voos por data, origem e destino
export async function buscarVoos(data: string, origem: string, destino: string) {
  const params = { data, origem, destino };
  const response = await api.get('/voos', { params });
  return response.data;
}

// GET /voos/listar — buscar todos os voos
export async function buscarTodosVoos(): Promise<Voo[]> {
  const response = await axios.get<Voo[]>('http://localhost:3000/api/voos/listar', {
    headers: {
      // Isso impede que o token seja enviado, mesmo se estiver no interceptor global
      Authorization: undefined,
    },
    withCredentials: false // reforça que não envie cookies JWT
  });
  return response.data;
}

// GET /voos/:codigoVoo — buscar voo por código
export async function buscarVooPorCodigo(codigoVoo: string): Promise<Voo> {
  const response = await api.get<Voo>(`/voos/${codigoVoo}`);
  return response.data;
}

// PATCH /voos/:codigoVoo/estado — atualizar estado do voo
export async function atualizarEstadoVoo(
  codigoVoo: string,
  novoEstado: 'CONFIRMADO' | 'CANCELADO' | 'REALIZADO'
): Promise<Voo> {
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

export async function cancelarVoo(codigoVoo: string): Promise<Voo> {
  const response = await api.patch<Voo>(`/voos/${codigoVoo}/cancelar`, null, {
    headers: {
      Authorization: undefined
    }
  });
  return response.data;
}