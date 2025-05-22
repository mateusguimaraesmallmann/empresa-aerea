import api from 'src/api/api';

// Atualizar saldo de milhas (PUT)
export const atualizarMilhasCliente = (codigoCliente: number, quantidade: number) => {
  return api.put(`/clientes/${codigoCliente}/milhas`, { quantidade });
};

// Obter extrato de milhas + saldo (GET)
export const obterExtratoMilhas = (codigoCliente: number) => {
  return api.get(`/clientes/${codigoCliente}/milhas`);
};
