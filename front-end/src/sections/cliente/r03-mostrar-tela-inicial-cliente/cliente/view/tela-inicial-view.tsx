import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';
import { Reserva, listarReservasPorCliente } from 'src/api/reserva';
import { TabelaReservasCliente } from '../tabela-reservas-cliente';

export function TelaInicialView() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [milhas, setMilhas] = useState(0);

  // Recupera o cliente logado do localStorage (TEMPORÁRIO, PRECISA AJUSTAR PRA VIR DO BACK)
  const usuario = JSON.parse(sessionStorage.getItem('usuarioLogado') || '{}');
  const idCliente = usuario.id;

  useEffect(() => {
    async function carregar() {
      if (!idCliente) return;
      try {
        const reservasApi = await listarReservasPorCliente(idCliente);
        setReservas(reservasApi);
      } catch {
        setReservas([]);
      }
    }
    carregar();
  }, [idCliente]);

  useEffect(() => {
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
            if (!idCliente) return;
            const reservasApi = await listarReservasPorCliente(idCliente);
            setReservas(reservasApi);
          }}
        />
      </DashboardContent>
    </>
  );
}


