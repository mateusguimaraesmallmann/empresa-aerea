import api from 'src/api/api';

// Nova versão usando o endpoint correto do backend
export const atualizarMilhasCliente = (codigoCliente: number, quantidade: number) => {
  return api.post('/ms-cliente/milhas/comprar', null, {
    params: {
      clienteId: codigoCliente,
      quantidade,
      valorReais: quantidade * 5,
      codigoReserva: '', 
    },
  });
};

// Obter extrato de milhas (mantém o GET novo)
export const obterExtratoMilhas = (codigoCliente: number) =>
  api.get(`/ms-cliente/milhas/${codigoCliente}`);
