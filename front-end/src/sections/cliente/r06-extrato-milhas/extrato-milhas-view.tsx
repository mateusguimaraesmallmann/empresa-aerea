import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { DashboardContent } from 'src/layouts/dashboard';
import { ExtratoMilhasTabela } from './extrato-milhas-tabela';
import { TransacaoMilhas } from './types';

export function ExtratoMilhasView() {
  const [transacoes, setTransacoes] = useState<TransacaoMilhas[]>([]);

  useEffect(() => {
    const carregarTransacoes = () => {
      const compras = JSON.parse(localStorage.getItem('comprasMilhas') || '[]');
      const reservas = JSON.parse(localStorage.getItem('reservas') || '[]');

      const transacoesCompra: TransacaoMilhas[] = compras.map((compra: any) => ({
        id: uuidv4(),
        dataHora: new Date(compra.dataHora).toISOString(),
        codigoReserva: null,
        valorReais: parseFloat(compra.valor),
        quantidadeMilhas: compra.milhas,
        descricao: 'COMPRA DE MILHAS',
        tipo: 'ENTRADA',
      }));

      const transacoesReserva: TransacaoMilhas[] = reservas.map((reserva: any) => ({
        id: uuidv4(),
        dataHora: new Date(reserva.dataHoraCriacao || new Date()).toISOString(),
        codigoReserva: reserva.codigo || null,
        valorReais: reserva.restanteEmDinheiro || 0,
        quantidadeMilhas: reserva.milhasUsadas || 0,
        descricao: `${(reserva.voo?.origem || '').slice(-4, -1)}->${(reserva.voo?.destino || '').slice(-4, -1)}`,
        tipo: 'SAÍDA',
      }));

      const todasTransacoes = [...transacoesCompra, ...transacoesReserva].sort(
        (a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime()
      );

      setTransacoes(todasTransacoes);
    };

    carregarTransacoes();
  }, []);

  return (
    <>
      <Helmet>
        <title>Extrato de Milhas</title>
      </Helmet>

      <DashboardContent>
        <Box mb={5}>
          <Typography variant="h4">Extrato de Milhas</Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            Histórico completo de todas as suas transações de milhas
          </Typography>
        </Box>

        <ExtratoMilhasTabela transacoes={transacoes} />
      </DashboardContent>
    </>
  );
}
