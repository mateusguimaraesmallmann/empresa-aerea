import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';
import { Reserva, getReservasDoLocalStorageAdaptadas } from 'src/sections/cliente/types/reserva';
import { TabelaReservasCliente } from '../tabela-reservas-cliente';

export function TelaInicialView() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [milhas, setMilhas] = useState(0);

  const carregarReservas = () => {
    setReservas(getReservasDoLocalStorageAdaptadas());
  };

  useEffect(() => {
    carregarReservas();

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

        <TabelaReservasCliente
          reservas={reservas}
          milhas={milhas}
          onAtualizarReservas={carregarReservas}
        />
      </DashboardContent>
    </>
  );
}