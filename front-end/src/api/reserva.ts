import api from 'src/api/api';

// Modelo da reserva
export interface Reserva {
  codigo: string;
  codigoVoo: string;
  clienteCpf: string;
  idCliente: number;
  dataHora: string;
  estado: string;
  quantidadePassagens: number;
  milhasUtilizadas: number;
  valorPagoEmDinheiro: number;
}

// DTO para criar reserva
export interface CriarReservaDTO {
  codigoVoo: string;
  clienteCpf: string;
  idCliente: number;
  quantidadePassagens: number;
  milhasUtilizadas: number;
  valorPagoEmDinheiro: number;
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

// GET /api/clientes/:idCliente/reservas – listar reservas do cliente
export async function listarReservasPorCliente(idCliente: number): Promise<Reserva[]> {
  const response = await api.get<Reserva[]>(`/clientes/${idCliente}/reservas`);
  return response.data;
}

// PATCH /api/reservas/:codigoReserva/estado – avançar estado
export async function atualizarEstadoReserva(
  codigo: string,
  estado: 'CRIADA' | 'CHECK_IN' | 'EMBARCADA' | 'CANCELADA' | 'REALIZADA' | 'CANCELADA_VOO' | 'NAO_REALIZADA'
): Promise<Reserva> {
  const response = await api.patch<Reserva>(`/reservas/${codigo}/estado`, { estado });
  return response.data;
}

// CHECK-IN: PATCH /api/reservas/:codigoReserva/estado
export async function fazerCheckinReserva(codigo: string): Promise<Reserva> {
  return atualizarEstadoReserva(codigo, 'CHECK_IN');
}

// DELETE /api/reservas/:codigoReserva – cancelar (CLIENTE)
export async function cancelarReserva(codigo: string): Promise<void> {
  await api.delete(`/reservas/${codigo}`);
}

// PATCH /api/reservas/:codigoReserva/embarque – embarcar (FUNCIONARIO)
export async function embarcarReserva(codigo: string): Promise<Reserva> {
  const response = await api.patch<Reserva>(`/api/reservas/${codigo}/embarque`);
  return response.data;
}
