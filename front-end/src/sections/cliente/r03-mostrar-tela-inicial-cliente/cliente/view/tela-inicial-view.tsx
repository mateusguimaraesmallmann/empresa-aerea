import { Helmet } from 'react-helmet-async';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';
import { TabelaReservasCliente } from '../tabela-reservas-cliente';

// ----------------------------------------------------------------------

const reservasMock = [
  {
    id: '1',
    dataHora: '2025-03-30T10:00:00',
    origem: 'Aeroporto A',
    destino: 'Aeroporto B',
    codigo: 'ABC123',
    status: 'Reservada',
    statusVoo: 'Reservado',
  },
  {
    id: '2',
    dataHora: '2025-03-25T15:30:00',
    origem: 'Aeroporto C',
    destino: 'Aeroporto D',
    codigo: 'XYZ789',
    status: 'Cancelada',
    statusVoo: 'Cancelado',
  },
];

// ----------------------------------------------------------------------

export function TelaInicialView() {
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

        <TabelaReservasCliente reservas={reservasMock} milhas={3200} />
      </DashboardContent>
    </>
  );
}
