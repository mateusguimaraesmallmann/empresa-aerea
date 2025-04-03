import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';
import { TabelaReservasCliente } from '../tabela-reservas-cliente';

// Tipos de dados conforme o localStorage e visualização
type ReservaStorage = {
  codigo: string;
  voo: {
    id: string;
    origem: string;
    destino: string;
    dataHora: string;
    preco: number;
  };
  quantidade: number;
  milhasUsadas: number;
  restanteEmDinheiro: number;
  status: string;
};

type ReservaAdaptada = {
  id: string;
  dataHora: string;
  origem: string;
  destino: string;
  codigo: string;
  status: string;
  statusVoo: string;
  valorReais: number;
  milhasGastas: number;
};

// ✅ Função utilitária para carregar e adaptar reservas do localStorage
function getReservasDoLocalStorage(): ReservaAdaptada[] {
  const salvas = JSON.parse(localStorage.getItem('reservas') || '[]') as ReservaStorage[];

  return salvas.map((r) => ({
    id: r.voo.id,
    dataHora: r.voo.dataHora,
    origem: r.voo.origem,
    destino: r.voo.destino,
    codigo: r.codigo,
    status: r.status,
    statusVoo: r.status === 'CANCELADA' ? 'Cancelado' : 'Reservado',
    valorReais: r.restanteEmDinheiro,
    milhasGastas: r.milhasUsadas,
  }));
}

export function TelaInicialView() {
  const [reservas, setReservas] = useState<ReservaAdaptada[]>([]);
  const [milhas, setMilhas] = useState(0);

  useEffect(() => {
    setReservas(getReservasDoLocalStorage());
  
    const milhasSalvas = localStorage.getItem('milhas');
    if (milhasSalvas === null) {
      localStorage.setItem('milhas', JSON.stringify(1000));
      setMilhas(1000);
    } else {
      setMilhas(Number(milhasSalvas));
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Tela inicial</title>
      </Helmet>

      <DashboardContent>
        <Box display="flex" alignItems="center" mb={5}>
          <Typography variant="h4" flexGrow={1}>
            Olá, Cliente!
          </Typography>
        </Box>

        <TabelaReservasCliente reservas={reservas} milhas={milhas} />
      </DashboardContent>
    </>
  );
}