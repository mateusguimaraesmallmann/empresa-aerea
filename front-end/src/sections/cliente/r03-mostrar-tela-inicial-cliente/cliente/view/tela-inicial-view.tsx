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

  const calcularMilhas = () => {
    const compras = JSON.parse(localStorage.getItem('comprasMilhas') || '[]');
    const totalComprado = compras.reduce((acc: number, item: any) => acc + Number(item.milhas), 0);

    const reservasSalvas = JSON.parse(localStorage.getItem('reservas') || '[]');
    const totalUsado = reservasSalvas.reduce((acc: number, r: any) => acc + (r.milhasUsadas || 0), 0);

    setMilhas(totalComprado - totalUsado);
  };

  useEffect(() => {
    carregarReservas();
    calcularMilhas();
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
          onAtualizarReservas={() => {
            carregarReservas();
            calcularMilhas();
          }}
        />
      </DashboardContent>
    </>
  );
}