import api from './api';

// Modelo da reserva 
export interface Reserva {
  codigo: string;
  codigoVoo: string;
  clienteCpf: string;
  dataHora: string;
  estado: 'CRIADA' | 'CHECK-IN' | 'EMBARCADA' | 'CANCELADA' | 'REALIZADA';
}

// DTO para criar reserva
export interface CriarReservaDTO {
  codigoVoo: string;
  clienteCpf: string;
}

// POST /api/reservas – criação (CLIENTE)
export async function criarReserva(dados: CriarReservaDTO): Promise<Reserva> {
  const response = await api.post<Reserva>('/reservas', dados);
  return response.data;
}

// GET /api/reservas/:codigoReserva – detalhes (TODOS)
export async function buscarReservaPorCodigo(codigo: string): Promise<Reserva> {
  const response = await api.get<Reserva>(`/reservas/${codigo}`);
  return response.data;
}

// PATCH /api/reservas/:codigoReserva/estado – avançar estado (CLIENTE)
export async function atualizarEstadoReserva(codigo: string): Promise<Reserva> {
  const response = await api.patch<Reserva>(`/reservas/${codigo}/estado`);
  return response.data;
}

// DELETE /api/reservas/:codigoReserva – cancelar (CLIENTE)
export async function cancelarReserva(codigo: string): Promise<void> {
  await api.delete(`/reservas/${codigo}`);
}

// PATCH /api/reservas/:codigoReserva/checkin – check-in (CLIENTE)
export async function fazerCheckinReserva(codigo: string): Promise<Reserva> {
  const response = await api.patch<Reserva>(`/reservas/${codigo}/checkin`);
  return response.data;
}

// PATCH /api/reservas/:codigoReserva/embarque – embarcar (FUNCIONARIO)
export async function embarcarReserva(codigo: string): Promise<Reserva> {
  const response = await api.patch<Reserva>(`/reservas/${codigo}/embarque`);
  return response.data;
}