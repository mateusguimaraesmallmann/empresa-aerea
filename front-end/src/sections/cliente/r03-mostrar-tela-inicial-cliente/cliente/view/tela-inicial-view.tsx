import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';
import { Reserva, listarReservasPorCliente } from 'src/api/reserva'; // <- ajuste aqui!
import { TabelaReservasCliente } from '../tabela-reservas-cliente';

export function TelaInicialView() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [milhas, setMilhas] = useState(0);

  // Recupera CPF do localStorage (ou do contexto de auth se usar)
  const cpf = localStorage.getItem('cpf') || '';

  useEffect(() => {
    async function carregar() {
      if (!cpf) return;
      try {
        const reservasApi = await listarReservasPorCliente(cpf);
        setReservas(reservasApi);
      } catch {
        setReservas([]);
      }
    }
    carregar();
  }, [cpf]);

  // Calcular milhas usando os dados já do backend
  useEffect(() => {
    // Exemplo simples: some as milhas das reservas
    const totalMilhas = reservas.reduce((acc, r) => acc - (r.milhasUtilizadas || 0), 0);
    setMilhas(totalMilhas);
  }, [reservas]);

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

        <TabelaReservasCliente
          reservas={reservas}
          milhas={milhas}
          onAtualizarReservas={async () => {
            if (!cpf) return;
            const reservasApi = await listarReservasPorCliente(cpf);
            setReservas(reservasApi);
          }}
        />
      </DashboardContent>
    </>
  );
}

