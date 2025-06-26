import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';
import { Reserva, listarReservasPorCliente } from 'src/api/reserva';
import { obterExtratoMilhas } from 'src/api/milha';
import { useAuth } from 'src/context/AuthContext';
import { TabelaReservasCliente } from '../tabela-reservas-cliente';


export function TelaInicialView() {
  const { usuario } = useAuth();
  const idCliente = Number(usuario?.id); // ✅ converter para número

  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [milhas, setMilhas] = useState(0);

  useEffect(() => {
    async function carregar() {
      if (!idCliente) return;

      try {
        const reservasApi = await listarReservasPorCliente(idCliente);
        setReservas(reservasApi);

        const response = await obterExtratoMilhas(idCliente); // ✅ corrigido
        setMilhas(response.data.saldo_milhas); // ✅ corrigido
      } catch (error) {
        console.error('Erro ao carregar dados do cliente', error);
        setReservas([]);
      }
    }

    carregar();
  }, [idCliente]);

  return (
    <>
      <Helmet>
        <title>Dashboard | Cliente</title>
      </Helmet>

      <DashboardContent>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4">Bem-vindo, {usuario?.email}</Typography>
          <Typography variant="subtitle1" mt={2}>
            Saldo de milhas: <strong>{milhas}</strong>
          </Typography>
        </Box>

        <TabelaReservasCliente
          reservas={reservas}
          milhas={milhas}
          onAtualizarReservas={() => {}}
        />
      </DashboardContent>
    </>
  );
}
