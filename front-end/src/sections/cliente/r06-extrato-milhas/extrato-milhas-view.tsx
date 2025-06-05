import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

import { obterExtratoMilhas } from 'src/api/milha';
import { DashboardContent } from 'src/layouts/dashboard';

import { ExtratoMilhasTabela } from './extrato-milhas-tabela';
import { TransacaoMilhas } from './types';

export function ExtratoMilhasView() {
  const [transacoes, setTransacoes] = useState<TransacaoMilhas[]>([]);

  useEffect(() => {
    const carregarTransacoes = async () => {
      try {
        const id = localStorage.getItem('cliente_codigo');
        if (!id) throw new Error('Cliente não identificado');

        const { data } = await obterExtratoMilhas(Number(id));

        const transacoesFormatadas: TransacaoMilhas[] = data.transacoes.map((t: any) => ({
          id: uuidv4(),
          dataHora: t.dataHora || new Date().toISOString(),
          codigoReserva: t.codigoReserva || null,
          valorReais: t.valorReais || 0,
          quantidadeMilhas: t.quantidade_milhas,
          descricao: t.descricao || 'Transação',
          tipo: t.tipo,
        }));

        setTransacoes(transacoesFormatadas);
      } catch (error) {
        console.error('Erro ao carregar extrato de milhas:', error);
      }
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
