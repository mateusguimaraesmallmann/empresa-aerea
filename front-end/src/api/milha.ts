import api from 'src/api/api';

// Atualizar saldo de milhas (PUT)
export const atualizarMilhasCliente = (codigoCliente: number, quantidade: number) =>
  api.put(`/clientes/${codigoCliente}/milhas`, { quantidade });

// Obter extrato de milhas + saldo (GET)
export const obterExtratoMilhas = (codigoCliente: number) =>
  api.get(`/clientes/${codigoCliente}/milhas`);